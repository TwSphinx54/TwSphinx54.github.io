# Project Page Build Standard

This document is the repository standard for creating or substantially rebuilding research project pages. Read it before starting any new project-page task.

The goal is not to reproduce a paper as HTML. A project page should be an accurate, compact, visually coherent explanation of the work that matches the personal website while preserving each paper's identity.

## 1. Sources of truth

Use sources in this order:

1. The paper's LaTeX source for title, author order, affiliations, method details, metrics, table values, figure numbering, captions, citations, and BibTeX.
2. The previous project HTML, if supplied, for author profile links, project links, venue links, and useful media that may not be present in the paper source.
3. The current project pages for layout and interaction patterns:
   - `src/pages/projects/savla.astro`
   - `src/pages/projects/samatcher.astro`
   - `src/pages/projects/scode.astro`
4. `src/layouts/Project.astro` for shared navigation, theme switching, MathJax, More Works, table-caption sizing, and BibTeX-copy behavior.

Do not invent claims, affiliations, citations, metric values, venue status, or release links. Resolve discrepancies against the latest paper source and clearly flag anything that cannot be verified.

## 2. Required repository changes

For a project slug named `<slug>`:

- Create `src/pages/projects/<slug>.astro`.
- Put imported images in `src/assets/projects/<slug>/`.
- Put video or other files that must be served unchanged in `public/projects/<slug>/`.
- Add the project name, compact venue, year, and lowercase route to `src/data/projects.ts`.
- Add or update the corresponding homepage publication/project entry in `src/content/home/index.yaml` when appropriate.
- Use `/projects/<slug>/` for all internal links. Never introduce new `/Projects/...` links.

The generic compatibility logic in `src/pages/404.astro` handles legacy uppercase `/Projects/<slug>` URLs. Do not create case-only duplicate pages or Astro redirects on a case-insensitive filesystem.

## 3. Shared layout contract

Every project page must use `ProjectLayout`:

```astro
<ProjectLayout
	projectName="METHOD"
	navItems={[
		{ label: "Abstract", href: "#abstract-heading" },
		{ label: "Method", href: "#method-heading" },
		{ label: "Evaluation", href: "#evaluation-heading" },
		{ label: "Results", href: "#results-heading" },
		{ label: "Citation", href: "#citation-heading" },
		{ label: "References", href: "#references-heading" },
	]}
	meta={{
		title: "METHOD",
		description: "A concise, factual one-sentence description.",
	}}
>
	<article class="project-page">...</article>
</ProjectLayout>
```

Only include navigation items for sections that exist. Add `In motion` only when the page contains a video section.

Do not reimplement these shared elements inside a page:

- Project-name brand and page table of contents
- Home, More Works, and theme controls
- More Works project catalog
- Theme provider or theme toggle
- MathJax loading/configuration
- BibTeX copy script
- Responsive table-caption measurement script

If behavior is needed by multiple project pages, implement it in the shared layout or a shared component rather than copying it between pages.

## 4. Information architecture

Use the following order unless the paper provides a compelling reason to change it:

1. Hero metadata
2. Abstract
3. Method
4. Evaluation
5. Results
6. Video or interactive media, if present
7. Citation
8. References

### Hero

The hero must include:

- `Research project · YEAR` kicker
- Full paper title
- Authors in paper order
- Affiliation superscripts and full affiliation names
- Equal-contribution, work-done-at, and corresponding-author notes when applicable
- Linked venue name; venue links do not receive a separate external-link arrow
- Available Paper, Code, Model, Dataset, DOI, arXiv, or Demo buttons

Represent authors, links, and affiliations as named data objects/arrays rather than positional tuple arrays:

```ts
const authors = [{ name: "Xu Pan", href: "/", mark: "1,*" }];
const affiliations = ["Full institution name"];
const links = [
	{ label: "Paper", href: "https://...", icon: "lucide:file-text" },
];
```

Author links should come from verified existing HTML, the paper source, or an authoritative profile. Internal author links stay in the same tab; external links use `target="_blank"` and `rel="noreferrer"`.

Affiliations must be allowed to use the full available project-page width. Do not constrain them to the narrow reading column.

### Abstract

Write one compact paragraph that explains:

- The concrete problem
- Why existing approaches fail
- The central method idea
- The main outcome

Do not copy a long abstract verbatim when it can be made clearer without changing meaning.

Figure 1 normally sits to the right of the abstract body, following the homepage profile-image positioning logic rather than the title layout. It may intrude slightly into the reading column when necessary for legibility, but remains anchored to the project's right boundary. On narrow screens it becomes a normal full-width block below the abstract.

An overview figure does not need its own section when it works better as the abstract visual.

### Method

Use the paper's true overview or pipeline figure as the primary method figure. Do not substitute a narrower component diagram merely because it is visually convenient.

Summarize the method in a short narrative and, when helpful, two to four compact mechanism cards. Explain relationships between components instead of restating labels already visible in the figure.

### Evaluation and results

Introduce the datasets, protocols, baselines, metrics, and splits before presenting results. Results should read as an argument, not as a sequence of disconnected figures and tables.

Group media by the question it answers, for example:

- Main quantitative comparison
- Ablation or mechanism validation
- Robustness/generalization
- Qualitative evidence

Use percentage points (`pp`) only for an absolute difference between percentages. Use `%` for success rates, accuracies, and other percentage-valued measurements. Keep notation consistent with the paper.

Include important paper tables rather than replacing all quantitative evidence with prose. A large main-results table belongs in Results; protocol, dataset, or compact ablation tables may belong in Evaluation.

## 5. Figures and media

Use Astro's asset pipeline for images:

```astro
import figure from "@/assets/projects/<slug>/figure.png"; ...
<Image src={figure} alt="Specific description of the figure" loading="lazy" />
```

Use `loading="eager"` only for the leading abstract figure. Other images should normally be lazy-loaded.

### Figure rules

- Preserve each image's intrinsic aspect ratio. Never force all figures into one arbitrary width and height.
- Choose display size by information density, not figure number.
- Related side-by-side figures may be made equal-height with `object-fit: contain`.
- A very wide diagram may extend beyond the reading column up to the site's right content boundary.
- Do not exceed the overall page boundary or create document-level horizontal scrolling.
- Every image receives a descriptive `alt`, not merely `Fig. 3`.
- Every visible figure caption begins with `Fig. x.` and follows the numbering in the paper.
- Caption wording should be based on the paper caption but edited for web readability and nearby context.
- The four theme-color corner crosses appear immediately on figure hover, without a fade. The image itself does not animate on hover.
- In light mode, white figure backgrounds may use the established blending behavior to merge with the page. In dark mode, preserve a readable white image canvas when blending would damage the figure.

Do not import unused media. After implementation, verify that every file in `src/assets/projects/<slug>/` is referenced.

### Media-size review

Before handoff, report source and generated sizes for unusually large media. Use these practical review thresholds:

- Source raster image over 1 MiB
- Generated web image over 250 KiB
- Any image dimension above roughly 3000 px when its rendered size does not justify it
- Video over 2 MiB or encoded at an unnecessarily high bitrate

Do not silently degrade scientific diagrams. For plots and diagrams containing fine text, prefer resolution reduction and optimized PNG/WebP settings over aggressive lossy compression.

## 6. Tables

Tables must be semantic HTML, not screenshots, when the source values are available.

Use this structure:

```astro
<figure class="paper-table-figure" data-sync-table-caption>
	<div
		class="table-scroll"
		tabindex="0"
		role="region"
		aria-label="Descriptive table name"
	>
		<table class="paper-table">...</table>
	</div>
	<figcaption class="table-caption">
		<strong>Table 1.</strong> Concise caption and necessary notes.
	</figcaption>
</figure>
```

`ProjectLayout` measures the rendered table body and gives its caption the same visible width. Do not add another `ResizeObserver` in the project page.

Table requirements:

- Use `<th scope="col">` and `<th scope="row">` correctly.
- Preserve every source column, row, pipeline name, metric, uncertainty, bold value, underline, and footnote.
- Keep columns only as wide as needed to avoid unintended wrapping.
- Let a table use intrinsic `max-content` width inside `.table-scroll`; do not stretch compact tables across the page.
- Two compact related tables may share one row on desktop and stack on mobile.
- The top and bottom rules end exactly at the table body's right edge.
- Header cells and the first column have no hover effect.
- Ordinary data-cell hover uses a neutral gray derived from theme variables.
- Highlighted rows/columns or emphasized values use the theme signal color on hover.
- Horizontal table scrollbars remain visually hidden at rest and appear without changing layout height.

## 7. Citations, references, and LaTeX

Use MathJax syntax already provided by `ProjectLayout`:

- Inline: `$...$` or `\\(...\\)`
- Display: `$$...$$` or `\\[...\\]`

Use LaTeX for mathematical notation such as `$\\pi_{0.5}$`; do not fake subscripts with plain text or Unicode formatting.

Citation markers use internal reference links:

```html
<sup class="citation-mark"><a href="#ref-1">[1]</a></sup>
```

References appear as the final content section and follow the compact numbered Cognition-style list already established in the project pages, while using this site's link treatment.

Before handoff, perform a two-way citation audit:

- Every reference list entry is cited somewhere appropriate in the body.
- Every body citation resolves to an existing reference ID.
- Dataset, benchmark, foundation-model, and directly compared method citations are included where they first become relevant.
- Do not attach citations decoratively to section introductions when they do not support a specific claim.

The Citation section contains the paper's verified BibTeX in a `<code>` block and a button with `data-copy-bibtex`. The shared layout supplies copy behavior.

## 8. Responsive behavior

Desktop project content follows the same reading width, typography, title rhythm, section numbering, and right content boundary as the personal homepage.

At `max-width: 1024px`:

- The page uses the full available width with the site's 18 px outer padding.
- `--reading-width`, profile width, and project content must not retain desktop viewport calculations.
- `.project-page`, hero, and sections use `width: 100%`, `max-width: none`, and `min-width: 0` where needed.
- Figures, video, citations, and table wrappers cannot create document-level overflow.
- Multi-column figure/table groups stack unless they remain genuinely readable.
- The page title can wrap safely with `overflow-wrap: anywhere` when required.
- The project navigation remains horizontally scrollable without a permanently visible scrollbar.

Do not fix mobile readability by applying an arbitrary narrow percentage width. Mobile body copy is full-width within the page padding.

## 9. Theme and interaction rules

- Use `var(--paper)`, `var(--ink)`, `var(--muted)`, `var(--line)`, `var(--line-strong)`, and `var(--signal)` instead of hard-coded theme colors.
- Verify light and dark themes independently.
- Theme switching must never change geometry or cause layout jumps.
- Reuse the shared `ThemeToggle`; do not create project-specific theme buttons.
- Home, More Works, and theme controls must remain exactly 30 px high and share the same top coordinate.
- Scrollbars should remain hidden or minimal at rest and reveal themselves without changing box height or page layout.
- Interactive controls need visible hover states and useful accessible names.

## 10. Code-quality rules

- Keep content data near the top of the page file: authors, affiliations, project links, result rows, captions, and BibTeX.
- Prefer named object fields over positional tuples.
- Render repeated authors, links, corner markers, rows, and result cards from arrays.
- Keep project-specific CSS in the page, but move repeated cross-project behavior to `ProjectLayout` or a shared component.
- Do not duplicate global theme or responsive fixes in every page.
- Do not leave commented experiments, obsolete selectors, unused imports, unused assets, or duplicate hover rules.
- Preserve unrelated user changes in a dirty worktree.
- Keep new routes and asset names lowercase and stable.

## 11. Required verification

Run at minimum:

```bash
pnpm exec prettier --write src/pages/projects/<slug>.astro src/data/projects.ts
pnpm check
pnpm lint
pnpm build
git diff --check
```

Then inspect the production build in a real browser at representative widths:

- Desktop: approximately 1280 px wide
- Mobile: approximately 390 px wide
- Light theme and dark theme

Verify:

- No document-level horizontal overflow
- Mobile body copy uses the full available width
- Title, section labels, and body align with existing project pages
- Authors and affiliations are complete
- Home, More Works, and theme controls align exactly
- More Works contains the new project name and venue
- All nav anchors resolve to real sections
- Figure numbering and captions match the paper
- Images retain intended aspect ratios and sizes
- Table captions match actual table widths
- Table header/first-column hover is disabled
- Highlighted cells use theme hover and ordinary cells use neutral hover
- BibTeX copy control is present
- Every citation link resolves
- No console errors

## 12. Definition of done

A new project page is complete only when:

1. Its factual content has been checked against the paper source.
2. It is reachable at `/projects/<slug>/` and registered in More Works.
3. Its hero, authors, affiliations, venue, project links, sections, figures, tables, citation, and references are complete as applicable.
4. Desktop, mobile, light theme, and dark theme have all been inspected.
5. No page-level overflow, dead link, missing asset, uncited reference, or duplicated shared logic remains.
6. Checks and production build pass.
7. Large media are reported to the user before committing unless the user explicitly asks Codex to optimize them.
