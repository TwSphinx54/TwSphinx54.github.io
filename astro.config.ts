import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [icon(), robotsTxt()],
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	site: "https://xupan.top",
	vite: {
		plugins: [tailwindcss()],
	},
});
