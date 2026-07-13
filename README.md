# Xu Pan — Personal Website

Astro-based academic portfolio for publications, projects, experience, honors, service, and contact information.

## Development

```bash
pnpm install
pnpm dev
```

Before publishing, run:

```bash
pnpm build
pnpm check
```

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
- `src/assets/` — source images and organization logos
- `public/` — downloadable resumes and favicon
