import type { ImageMetadata } from "astro";

type ProjectDefinition = {
	slug: string;
	name: string;
	topic: string;
	venue: string;
	description: string;
};

export type ResearchProject = ProjectDefinition & {
	href: string;
	cardImage: ImageMetadata;
};

const cardImages = import.meta.glob<ImageMetadata>(
	"../assets/projects/cards/*-card.{png,jpg,jpeg,webp}",
	{
		eager: true,
		import: "default",
	},
);

function getCardImage(slug: string): ImageMetadata {
	const suffix = `/${slug}-card.`;
	const match = Object.entries(cardImages).find(([path]) => path.includes(suffix));
	if (!match) {
		throw new Error(`Missing project card image: src/assets/projects/cards/${slug}-card.*`);
	}
	return match[1];
}

const projectDefinitions: ProjectDefinition[] = [
	{
		slug: "sfm",
		name: "SFM",
		topic: "Embodied AI",
		venue: "Under Review · 2026",
		description:
			"Geometry-aware representation, grounded reward, and annealed exploration for robust flow-matching VLA reinforcement learning.",
	},
	{
		slug: "savla",
		name: "SA-VLA",
		topic: "Embodied AI",
		venue: "CVPRW · 2026",
		description:
			"Spatially-aware reinforcement learning for robust flow-matching vision-language-action policies.",
	},
	{
		slug: "samatcher",
		name: "SAMatcher",
		topic: "3D Vision",
		venue: "arXiv · 2026",
		description:
			"Explicit co-visibility modeling with Segment Anything for robust cross-view feature matching.",
	},
	{
		slug: "scode",
		name: "SCoDe",
		topic: "Image Matching",
		venue: "ISPRS JPRS · 2025",
		description:
			"Scale-aware co-visible region detection for matching images under drastic scale variation.",
	},
];

export const projects: ResearchProject[] = projectDefinitions.map((project) => ({
	...project,
	href: `/projects/${project.slug}/`,
	cardImage: getCardImage(project.slug),
}));
