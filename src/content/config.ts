import { defineCollection, z } from "astro:content";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const post = defineCollection({
	schema: ({ image }) =>
		z.object({
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			description: z.string().min(50).max(160),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			title: z.string().max(60),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
		}),
	type: "content",
});

const PublicationEditable = z.object({
	author: z.array(z.string()),
	title: z.string(),
	booktitle: z.string(),
	time: z.string().optional(),
	doi: z.string().optional(),
	paper: z.string().optional(),
	code: z.string().optional(),
	image: z.string().optional(),
	venueIcon: z.string().optional(),
	venueColor: z.string().optional(),
	venueRank: z.string().optional(),
	venueLogo: z.string().optional(),
	abstract: z.string().optional(),
});

const NewsItem = z.object({
	date: z.string(),
	html: z.string().optional(),
	text: z.string().optional(),
	href: z.string().optional(),
	label: z.string().optional(),
});

const ProjectEditable = z.object({
	name: z.string(),
	description: z.string(),
	tags: z.array(z.string()).optional(),
	time: z.string().optional(),
	repo: z.string().optional(),
	demo: z.string().optional(),
	paper: z.string().optional(),
	orgLogos: z
		.array(z.string())
		.optional()
		.transform((arr) => (arr ? removeDupsAndLowerCase(arr) : arr)),
});

const HomeIntroSegment = z.union([
	z.object({
		type: z.literal("text"),
		html: z.string(),
	}),
	z.object({
		type: z.literal("link"),
		name: z.string(),
		href: z.string(),
		class: z.string().optional(),
	}),
	z.object({
		type: z.literal("org"),
		key: z.string(),
		name: z.string(),
		href: z.string(),
		alt: z.string().optional(),
		width: z.number().optional(),
		class: z.string().optional(),
	}),
]);

const HomeIntro = z.object({
	paragraphs: z.array(
		z.object({
			segments: z.array(HomeIntroSegment),
		}),
	),
});

const AckPerson = z.object({
	name: z.string(),
	href: z.string(),
});

const Acknowledgements = z.object({
	title: z.string(),
	introLines: z.array(z.string()).optional(),
	mentors: z.array(AckPerson).optional(),
	peersIntro: z.string().optional(),
	peers: z.array(AckPerson).optional(),
	outro: z.string().optional(),
});

const PersonalPhilosophy = z.object({
	intro: z.string(),
	quote: z.string(),
	cite: z.string(),
	slowScience: z.object({
		text: z.string(),
		href: z.string(),
	}),
	paragraphs: z.array(z.string()).default([]),
});

const AcademicService = z.object({
	role: z.string(),
	venue: z.string(),
	venueLink: z.string().optional(),
	year: z.string(),
});

const home = defineCollection({
	type: "data",
	schema: z.object({
		publicationsEditable: z.array(PublicationEditable),
		newsItems: z.array(NewsItem),
		projectsEditable: z.array(ProjectEditable),
		experienceMeta: z
			.record(z.object({ name: z.string(), link: z.string() }))
			.optional()
			.default({}),
		order: z.array(z.string()).optional(),
		homeIntro: HomeIntro.optional(),
		acknowledgements: Acknowledgements.optional(),
		personalPhilosophy: PersonalPhilosophy.optional(),
		academicServices: z.array(AcademicService).optional(),
	}),
});

export const collections = { post, home };
