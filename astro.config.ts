import fs from "node:fs";
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ["webmention.io"],
  },
  integrations: [
    icon(),
    robotsTxt(),
  ],
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: true,
  // ! Please remember to replace the following site property with your own domain
  site: "https://TwSphinx54.github.io",
  vite: {
    build: {
      chunkSizeWarningLimit: 800,
    },
    optimizeDeps: {
      exclude: [],
    },
    plugins: [
      rawFonts([".ttf", ".woff"]),
      tailwindcss()
    ],
  },
});

function rawFonts(ext: string[]) {
  return {
    name: "vite-plugin-raw-fonts",
    // @ts-expect-error:next-line
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
