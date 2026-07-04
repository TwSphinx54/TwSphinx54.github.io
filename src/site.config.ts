import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: "Xu Pan",
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: "en-GB",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  // Used as the default description meta property and webmanifest description
  description: "The brief introduction of Xu Pan",
  // HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
  lang: "en-GB",
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: "en_GB",
  sortPostsByUpdatedDate: false,
  // Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
  title: "Xu Pan",
};

// Used to generate links in both the Header & Footer.
export const menuLinks: { path: string; title: string }[] = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/publications/",
    title: "Publications",
  },
  {
    path: "/contact/",
    title: "Contact",
  },
];
