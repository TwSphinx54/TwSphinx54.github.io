import { defineCollection, z } from "astro:content";

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array;
  const lowercaseItems = array.map((str) => str.toLowerCase());
  const distinctItems = new Set(lowercaseItems);
  return Array.from(distinctItems);
}

const PublicationEditable = z.object({
  author: z.array(z.string()),
  title: z.string(),
  booktitle: z.string(),
  time: z.string().optional(),
  doi: z.string().optional(),
  paper: z.string().optional(),
  code: z.string().optional(),
  huggingface: z.string().optional(),
  site: z.string().optional(),
  image: z.string().optional(),
  venueIcon: z.string().optional(),
  venueColor: z.string().optional(),
  venueRank: z.string().optional(),
  venueLogo: z.string().optional(),
  abstract: z.string().optional(),
  selected: z.boolean().optional().default(false),
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
  site: z.string().optional(),
  paper: z.string().optional(),
  orgLogos: z
    .array(z.string())
    .optional()
    .transform((arr) => (arr ? removeDupsAndLowerCase(arr) : arr)),
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
    homeIntroHtml: z.string().optional(),
    acknowledgements: Acknowledgements.optional(),
    personalPhilosophyHtml: z.string().optional(),
    academicServices: z.array(AcademicService).optional(),
  }),
});

export const collections = { home };
