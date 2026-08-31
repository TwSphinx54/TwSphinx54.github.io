# Xu Pan — Personal Website

Astro-based academic portfolio for publications, projects, experience, honors, service, and contact information.

## Requirements

- Node.js 22.12 or newer
- pnpm 11.x (the project pins pnpm 11.20.0)

## Development

```bash
pnpm install
pnpm dev
```

Before publishing, run the complete validation suite:

```bash
pnpm validate
```

The validation command runs Biome linting, Astro type checks, and a production build in sequence.

Asset maintenance commands:

```bash
pnpm normalize-icons
pnpm social-cards
```

Production deployment is handled exclusively by the GitHub Pages workflow after changes reach
`main`; the validation workflow remains separate so pull requests can be checked without deploying.

## Dependency overview

- `astro` — static site framework, routing, content collections, and image optimization
- `astro-icon` with the Lucide and Simple Icons datasets — build-time SVG icons used throughout the site
- `astro-robots-txt` — generated crawler policy
- `sharp` — Astro image processing and the social-card/tool-icon scripts
- Tailwind CSS — utility generation alongside the custom global design system
- Biome, Prettier, and TypeScript — linting, formatting, and type checking

Routine dependency maintenance:

```bash
pnpm outdated --include-github-actions
pnpm update
pnpm audit
pnpm validate
```

The pnpm build-script allowlist and temporary release-age exceptions are documented in
[`pnpm-workspace.yaml`](pnpm-workspace.yaml). Avoid forcing transitive dependency overrides unless an
upstream-compatible fix has been verified.

## Content

Most homepage content is maintained in [`src/content/home/index.yaml`](src/content/home/index.yaml), including publications, news, selected builds, experience metadata, honors, service, acknowledgements, the introduction, philosophy, and the optional homepage callout.

The callout is shown only when it contains text:

```yaml
callout: |
  I am actively seeking Ph.D. opportunities. <a href="/contact/">Connect with me</a>.
```

Set `callout:` to an empty value, or remove the field, to hide it.

Research project pages and their homepage cards follow [`PROJECT_PAGE_GUIDE.md`](PROJECT_PAGE_GUIDE.md). Add research-project metadata once in `src/data/projects.ts` and use the `<slug>-card.*` naming convention; the homepage carousel, Projects page, and More Works menu update from that shared registry.

## Structure

- `src/pages/` — page entry points
- `src/layouts/` — shared document layout
- `src/components/` — reusable UI and publication components
- `src/content/` — validated YAML content
- `src/styles/` — global design system and responsive styles
- `src/utils/` — shared DOM and asset helpers
- `src/assets/` — imported images processed by Astro
  - `creative/` — photography and visual works
  - `home/` — homepage-only profile and experience images
  - `organizations/` — organization logos referenced by content keys
  - `projects/` — project figures plus shared card artwork
  - `social/` — source artwork for generated social cards
  - `tools/` — tool icons rendered through Astro Image
- `public/` — files that require stable, unchanged URLs
  - root files — `CNAME`, favicon, resumes, and the default generated social card
  - `projects/<slug>/` — videos or downloads served without processing
  - `social/projects/` — generated project social cards

Keep imported visual assets in `src/assets/`. Use `public/` only when a file must retain its original
filename or be addressed by a stable public URL. Avoid adding page images directly to either directory
root; place them in the closest semantic subdirectory instead.
