import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const width = 1200;
const height = 630;
const cream = "#f5f3ef";
const ink = "#151412";
const muted = "#77736c";
const blue = "#2d00ff";

const escapeXml = (value) =>
	value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const svg = (body) =>
	Buffer.from(`
		<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
			<style>
				.sans { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
				.serif { font-family: "Libre Baskerville", Georgia, serif; }
				.mono { font-family: "SFMono-Regular", Consolas, monospace; }
			</style>
			${body}
		</svg>
	`);

const projectCards = [
	{
		slug: "sfm",
		name: "SFM",
		year: "2026",
		line1: "Spatially-Aware Flow Matching",
		line2: "for Embodied Reinforcement Learning",
	},
	{
		slug: "savla",
		name: "SA-VLA",
		year: "2026",
		line1: "Spatially-Aware Reinforcement Learning",
		line2: "for Vision-Language-Action Models",
	},
	{
		slug: "samatcher",
		name: "SAMatcher",
		year: "2026",
		line1: "Co-Visibility Modeling with Segment Anything",
		line2: "for Robust Feature Matching",
		copySize: 17,
	},
	{
		slug: "scode",
		name: "SCoDe",
		year: "2025",
		line1: "Scale-aware Co-visible Region Detection",
		line2: "for Image Matching",
	},
];

await mkdir(path.join(root, "public", "social", "projects"), { recursive: true });

const siteOverlay = svg(`
	<rect x="72" y="75" width="12" height="12" fill="${blue}" />
	<text x="100" y="86" class="mono" fill="${ink}" font-size="15" letter-spacing="2.5">RESEARCH PORTFOLIO / 2026</text>
	<text x="72" y="245" class="serif" fill="${ink}" font-size="88" font-weight="700" letter-spacing="-3">Xu Pan</text>
	<line x1="72" y1="282" x2="454" y2="282" stroke="${ink}" stroke-opacity=".24" />
	<text x="72" y="329" class="sans" fill="${ink}" font-size="21" font-weight="500">Embodied AI · 3D Vision</text>
	<text x="72" y="363" class="sans" fill="${ink}" font-size="21" font-weight="500">Image Matching · Spatial Reasoning</text>
	<text x="72" y="539" class="mono" fill="${muted}" font-size="15" letter-spacing="1.25">XUPAN.TOP</text>
	<text x="72" y="568" class="sans" fill="${muted}" font-size="15">Research, publications, and selected projects</text>
`);

await sharp(path.join(root, "src", "assets", "social", "social-card-background.png"))
	.resize(width, height, { fit: "cover" })
	.composite([{ input: siteOverlay }])
	.png({ compressionLevel: 9, palette: true, quality: 92 })
	.toFile(path.join(root, "public", "social-card.png"));

for (const card of projectCards) {
	const projectOverlay = svg(`
		<rect width="466" height="630" fill="${cream}" fill-opacity=".96" />
		<line x1="466" y1="0" x2="466" y2="630" stroke="${ink}" stroke-opacity=".18" />
		<rect x="64" y="68" width="11" height="11" fill="${blue}" />
		<text x="91" y="79" class="mono" fill="${ink}" font-size="14" letter-spacing="2.2">PROJECT / XU PAN</text>
		<text x="64" y="239" class="serif" fill="${ink}" font-size="${card.name.length > 8 ? 56 : 70}" font-weight="700" letter-spacing="-2">${escapeXml(card.name)}</text>
		<line x1="64" y1="274" x2="402" y2="274" stroke="${ink}" stroke-opacity=".24" />
		<text x="64" y="324" class="sans" fill="${ink}" font-size="${card.copySize ?? 20}" font-weight="500">${escapeXml(card.line1)}</text>
		<text x="64" y="355" class="sans" fill="${ink}" font-size="${card.copySize ?? 20}" font-weight="500">${escapeXml(card.line2)}</text>
		<text x="64" y="526" class="mono" fill="${muted}" font-size="14" letter-spacing="1.25">${card.year} / RESEARCH PROJECT</text>
		<text x="64" y="559" class="mono" fill="${muted}" font-size="13" letter-spacing=".8">XUPAN.TOP/PROJECTS/${card.slug.toUpperCase()}</text>
	`);

	await sharp(path.join(root, "src", "assets", "projects", "cards", `${card.slug}-card.png`))
		.resize(width, height, { fit: "cover", position: "centre" })
		.composite([{ input: projectOverlay }])
		.png({ compressionLevel: 9, palette: true, quality: 92 })
		.toFile(path.join(root, "public", "social", "projects", `${card.slug}.png`));
}

console.log(`Generated the default card and ${projectCards.length} project cards.`);
