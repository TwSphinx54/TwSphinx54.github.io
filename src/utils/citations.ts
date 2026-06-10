type CitationCacheEntry = { value: number | null; expiresAt: number };
type CitationCache = Map<string, CitationCacheEntry>;
type CitationInFlight = Map<string, Promise<number | null>>;

type PublicationCitationInput = {
	title: string;
	doi?: string;
	paper?: string;
	openAlexId?: string;
};

type OpenAlexWork = {
	id?: string;
	doi?: string;
	title?: string;
	cited_by_count?: number;
};

type OpenAlexListResponse = {
	results?: OpenAlexWork[];
};

const globalWithCache = globalThis as typeof globalThis & {
	__openAlexCitationCache?: CitationCache;
	__openAlexCitationInFlight?: CitationInFlight;
};

const citationCache = (globalWithCache.__openAlexCitationCache ??= new Map());
const citationInFlight = (globalWithCache.__openAlexCitationInFlight ??= new Map());

const CITATION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const NEGATIVE_TTL_MS = 10 * 60 * 1000; // 10min
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 8000;
const OPENALEX_API_BASE = "https://api.openalex.org";
const SELECT_FIELDS = "id,doi,title,cited_by_count";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeDoi = (raw?: string): string => {
	if (!raw) return "";
	let value = raw.trim();
	value = value.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
	value = value.replace(/^doi:\s*/i, "");
	return value.trim();
};

const arxivDoiFromUrl = (raw?: string): string => {
	if (!raw) return "";

	try {
		const url = new URL(raw);
		if (!url.hostname.toLowerCase().includes("arxiv.org")) return "";
		const match = url.pathname.match(/\/(?:abs|pdf)\/([^/.]+(?:\.\d+)?)(?:\.pdf)?$/i);
		return match?.[1] ? `10.48550/arXiv.${match[1]}` : "";
	} catch {
		return "";
	}
};

const normalizeOpenAlexId = (raw?: string): string => {
	if (!raw) return "";
	const value = raw.trim();
	const match = value.match(/(?:openalex\.org\/|works\/)?(W\d+)$/i);
	return match?.[1]?.toUpperCase() ?? "";
};

const normalizeTitle = (raw?: string): string =>
	(raw ?? "")
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, " ")
		.trim()
		.replace(/\s+/g, " ");

const getRetryDelayMs = (res: Response, attempt: number) => {
	const retryAfter = Number(res.headers.get("retry-after"));
	if (Number.isFinite(retryAfter) && retryAfter > 0) return retryAfter * 1000;
	return 500 * 2 ** attempt + Math.floor(Math.random() * 250);
};

const buildOpenAlexUrl = (path: string, params: Record<string, string | number | undefined>) => {
	const url = new URL(`${OPENALEX_API_BASE}${path}`);
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
	}

	const mailto = import.meta.env.OPENALEX_MAILTO;
	if (mailto) url.searchParams.set("mailto", mailto);

	const apiKey = import.meta.env.OPENALEX_API_KEY;
	if (apiKey) url.searchParams.set("api_key", apiKey);

	return url;
};

const requestJson = async <T>(url: URL): Promise<T | null> => {
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

		try {
			const res = await fetch(url, { signal: controller.signal });
			clearTimeout(timer);

			if (res.ok) return (await res.json()) as T;

			if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
				await sleep(getRetryDelayMs(res, attempt));
				continue;
			}

			return null;
		} catch {
			clearTimeout(timer);
			if (attempt < MAX_RETRIES) {
				await sleep(500 * 2 ** attempt + Math.floor(Math.random() * 250));
				continue;
			}
			return null;
		}
	}

	return null;
};

const citationFromWork = (work?: OpenAlexWork | null): number | null =>
	typeof work?.cited_by_count === "number" ? work.cited_by_count : null;

const titlesMatch = (left?: string, right?: string): boolean => {
	const normalizedLeft = normalizeTitle(left);
	const normalizedRight = normalizeTitle(right);
	return Boolean(normalizedLeft && normalizedLeft === normalizedRight);
};

const findByOpenAlexId = async (openAlexId: string): Promise<number | null> => {
	const url = buildOpenAlexUrl(`/works/${openAlexId}`, { select: SELECT_FIELDS });
	return citationFromWork(await requestJson<OpenAlexWork>(url));
};

const findByDoi = async (doi: string): Promise<OpenAlexWork | null> => {
	const url = buildOpenAlexUrl(`/works/doi:${encodeURIComponent(doi)}`, {
		select: SELECT_FIELDS,
	});
	return requestJson<OpenAlexWork>(url);
};

const findByTitle = async (title: string): Promise<number | null> => {
	const normalizedTarget = normalizeTitle(title);
	if (!normalizedTarget) return null;

	const url = buildOpenAlexUrl("/works", {
		search: title,
		"per-page": 5,
		select: SELECT_FIELDS,
	});
	const data = await requestJson<OpenAlexListResponse>(url);
	const exactMatch = data?.results?.find((work) => normalizeTitle(work.title) === normalizedTarget);

	return citationFromWork(exactMatch);
};

const getCacheKey = (pub: PublicationCitationInput): string => {
	const openAlexId = normalizeOpenAlexId(pub.openAlexId);
	const doi = normalizeDoi(pub.doi) || arxivDoiFromUrl(pub.paper);
	const title = normalizeTitle(pub.title);

	return openAlexId || doi || `title:${title}`;
};

const requestCitation = async (pub: PublicationCitationInput): Promise<number | null> => {
	const openAlexId = normalizeOpenAlexId(pub.openAlexId);
	if (openAlexId) {
		const value = await findByOpenAlexId(openAlexId);
		if (value !== null) return value;
	}

	const doi = normalizeDoi(pub.doi) || arxivDoiFromUrl(pub.paper);
	if (doi) {
		const work = await findByDoi(doi);
		const value = citationFromWork(work);
		if (value !== null && titlesMatch(work?.title, pub.title)) return value;
		const titleValue = await findByTitle(pub.title);
		if (titleValue !== null) return titleValue;
		if (value !== null) return value;
	}

	// Title search is only a fallback for items that opted into citation display.
	if (pub.openAlexId || pub.doi || pub.paper) {
		return findByTitle(pub.title);
	}

	return null;
};

export const hasCitationLookup = (pub: PublicationCitationInput): boolean =>
	Boolean(pub.openAlexId || pub.doi || pub.paper);

export const getOpenAlexCitationCount = async (
	pub: PublicationCitationInput,
): Promise<number | null> => {
	const cacheKey = getCacheKey(pub);
	if (!cacheKey) return null;

	const now = Date.now();
	const cached = citationCache.get(cacheKey);
	if (cached && cached.expiresAt > now) return cached.value;

	const inFlight = citationInFlight.get(cacheKey);
	if (inFlight) return inFlight;

	const task = (async () => {
		const value = await requestCitation(pub);
		citationCache.set(cacheKey, {
			value,
			expiresAt: Date.now() + (value === null ? NEGATIVE_TTL_MS : CITATION_TTL_MS),
		});
		return value;
	})().finally(() => {
		citationInFlight.delete(cacheKey);
	});

	citationInFlight.set(cacheKey, task);
	return task;
};
