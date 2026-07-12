import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
	author: "Xu Pan",
	description: "The brief introduction of Xu Pan",
	lang: "en-GB",
	ogLocale: "en_GB",
	title: "Xu Pan",
};

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
