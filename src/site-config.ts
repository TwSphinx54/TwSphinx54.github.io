interface SiteConfig {
	author: string;
	description: string;
	lang: string;
	ogLocale: string;
	title: string;
}

export interface SiteMeta {
	articleDate?: string;
	description?: string;
	ogImage?: string;
	title: string;
}

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
		path: "/projects/",
		title: "Projects",
	},
	{
		path: "/publications/",
		title: "Publications",
	},
	{
		path: "/creative/",
		title: "Creative",
	},
	{
		path: "/contact/",
		title: "Contact",
	},
];
