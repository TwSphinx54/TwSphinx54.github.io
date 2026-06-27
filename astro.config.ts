import fs from "node:fs";
import mdx from "@astrojs/mdx";
import tailwindcss from '@tailwindcss/vite';
import react from "@astrojs/react";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import { expressiveCodeOptions } from "./src/site.config";

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ["webmention.io"],
  },
  integrations: [
    react(),
    expressiveCode(expressiveCodeOptions),
    icon(),
    mdx(),
    robotsTxt(),
  ],
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: true,
  // ! Please remember to replace the following site property with your own domain
  site: "https://TwSphinx54.github.io",
  vite: {
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("react") || id.includes("scheduler")) {
              return "vendor-react";
            }
          },
        },
      },
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
