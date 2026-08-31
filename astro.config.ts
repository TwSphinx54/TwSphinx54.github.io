import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
	// No local SVG collection; use an existing SVG-free directory to disable the default src/icons scan.
	integrations: [icon({ iconDir: "src/content" }), robotsTxt({ sitemap: false })],
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	site: "https://xupan.top",
	vite: {
		plugins: [tailwindcss()],
	},
});
