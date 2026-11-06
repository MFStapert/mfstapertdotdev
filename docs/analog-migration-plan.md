# Migration plan: mfstapert.dev to Analog

Implementation of this plan lives in the phase 1–4 pull requests. A few decisions differ from the open questions below:

- Post URLs are `/blog/<slug>`. The old dated paths (the UTC days the Jekyll site served) meta-refresh to those slugs.
- Document titles stay in the `mfstapert.` style, including each post. The home page keeps the typographic apostrophe.
- Code blocks use Shiki `github-light`.
- A sitemap is generated. `/404.html` is prerendered and omitted from the sitemap.
- `/blog/` and `/resume/` may return 200. There is no canonical link.
- Resume and post copy keeps the source punctuation, except the typos called out in review.
- GoatCounter counts the first full load and later client-side navigations.
- Source Sans Pro and Font Awesome stay on their existing CDNs.
- There is no `gh-pages` branch. Cutover is the manual Pages setting change described in `README.md`. The Actions workflow runs only after it is merged to `master`.

The rest of this document is the original plan.

Plan for moving [mfstapert.dev](https://mfstapert.dev) from Jekyll on GitHub Pages to [Analog](https://analogjs.org/). This document is the only change in its PR. Later PRs do the migration.

Analog docs referenced below were checked on 5 November 2026:

- [Getting started](https://analogjs.org/docs/getting-started) (this project requires Node >=26, the current LTS; Angular 17+)
- [Version compatibility](https://analogjs.org/docs/guides/compatibility) (`create-analog@latest`; Analog `latest` listed with Angular 20 and 21 on Vite 7, and an Nx row for Angular 22 on Vite 8)
- [create-analog](https://analogjs.org/docs/packages/create-analog/overview) (`blog` template preset)
- [Routing](https://analogjs.org/docs/features/routing/overview), [route metadata](https://analogjs.org/docs/features/routing/metadata), [content](https://analogjs.org/docs/features/routing/content)
- [Static site generation](https://analogjs.org/docs/features/server/static-site-generation)
- [Deployment overview](https://analogjs.org/docs/features/deployment/overview) and [providers / GitHub Pages](https://analogjs.org/docs/features/deployment/providers)
- [CSS preprocessors](https://analogjs.org/docs/packages/vite-plugin-angular/css-preprocessors)

Do not use Nx. This is one small site.

## Current state

Personal site, repository [MFStapert/mfstapertdotdev](https://github.com/MFStapert/mfstapertdotdev), default branch `master`. There is no CI, no `package.json`, and no test suite.

### Publishing

GitHub Pages, legacy builder (Jekyll runs on GitHub):

| Setting | Value |
| --- | --- |
| Source | branch `master`, path `/` |
| Custom domain | `mfstapert.dev` (`CNAME` in the repo root) |
| HTTPS | enforced |
| Actions | none |

`Gemfile` depends only on the `github-pages` gem. `Gemfile.lock` pins `github-pages` 202 and Jekyll 3.8.5. `_config.yml` excludes `Gemfile` and `Gemfile.lock` from the generated site. Local preview is `docker-compose.yml`, image `starefossen/github-pages`, port 4000.

A push to `master` is a production deploy. Anything merged there is what Pages tries to build as Jekyll.

### Site shape

`_config.yml`:

- `title: mfstapert`
- `permalink: /blog/:title/:year/:month/:day/`
- `markdown: kramdown`, Sass compressed, `sass_dir: _sass`
- collection `resume` with `output: false` (entries render only inside the resume page)
- social URLs: GitHub, LinkedIn, Twitter

Chrome comes from includes and layouts, not from a component tree:

| File | Role |
| --- | --- |
| `_includes/head.html` | charset, viewport, favicon `/assets/favicon.ico`, `/assets/main.css`, [GoatCounter](https://mfstapert.goatcounter.com/count) (`gc.zgo.at/count.js`), title |
| `_includes/header.html` | `{ mfstapert; }` wordmark, nav Home / Resume / Blog |
| `_includes/footer.html` | social icons (Font Awesome classes) |
| `_layouts/default.html` | header, `<main><div class="container">`, footer |
| `_layouts/hero.html` | wraps the page in `h1.hero-title` and strips `<p>` / `</p>` |
| `_layouts/blog.html` | lists `site.posts` (newest first) |
| `_layouts/post.html` | title, `Published: YYYY-MM-DD`, body |
| `_layouts/resume.html` | hardcoded personalia plus `site.resume reversed` |

Document titles are `{{ site.title }}.{{ page.title | downcase }}`. Measured on the live site:

| URL | `<title>` |
| --- | --- |
| `/` | `mfstapert.` |
| `/404.html` | `mfstapert.` (the 404 page has no `title`) |
| `/blog` | `mfstapert.blog` |
| `/resume` | `mfstapert.resume` |
| each post | `mfstapert.` plus the lowercased post title, e.g. `mfstapert.[node] why i no longer use npx in ci` |

### Pages and content

| Live URL | Source | Notes |
| --- | --- | --- |
| `/` | `pages/index.md`, layout `hero` | One sentence. Inline `<span class="color-primary">`. |
| `/resume` | `pages/resume.md` + resume layout | Personalia (photo, birth date, Deventer, education) is HTML in the layout. Jobs come from the collection. |
| `/blog` | `pages/blog.md`, layout `blog` | Index only. |
| `/blog/<slug>/<year>/<month>/<day>/` | `_posts/*.markdown`, layout `post` | Five posts. |
| `/404.html` | `pages/404.md`, layout `hero` | GitHub Pages serves this file for unknown paths. |

`/blog/` and `/resume/` both return **404** today. Post URLs without the trailing slash **301** to the slash form. Section pages are the extensionless file (`blog.html` / `resume.html`), not a directory index.

Resume entries (`_resume/01yourholding.md` through `_resume/10xip.md`) are Markdown with front matter: `period`, `employer`, `title`, optional `languages`, optional `activities`, optional `technology`. The body is a short description. `06topicus.md` has no languages or technology. `09codefield.md` has only period, employer, and title. Display order is the reversed default collection order, which for these filenames is `10` … `01` (newest filename first). That is filename order, not a parse of `period` (`08mypoi.md` and `10xip.md` both say "current").

The resume layout prints the document, then tries to strip paragraph tags with a `remove` filter split across lines. The descriptions still show up. The Analog page should render Markdown normally and let the existing `article p` rules apply, instead of copying that filter.

### Posts and the date shift

Jekyll's permalink date is the front-matter timestamp, and GitHub Pages formats it in UTC. Every post is dated `00:00:00 +0100`, so the **live** year/month/day is the previous civil day. The filename date is a third value and is not what the site serves.

| File | Front matter | Live path and "Published" label |
| --- | --- | --- |
| `_posts/2021-12-30-warning-a-user-of-unsaved-changes-in-angular.markdown` | `2021-12-29 00:00:00 +0100` | `/blog/warning-a-user-of-unsaved-changes-in-angular/2021/12/28/` |
| `_posts/2024-03-13-bugfix-for-angular-retaining-input-value.markdown` | `2024-03-13 00:00:00 +0100` | `/blog/bugfix-for-angular-retaining-input-value/2024/03/12/` |
| `_posts/2024-04-02-why-i-no-longer-use-npx.markdown` | `2024-04-02 00:00:00 +0100` | `/blog/why-i-no-longer-use-npx/2024/04/01/` |
| `_posts/2024-05-12-eslint-prettier.markdown` | `2024-05-14 00:00:00 +0100` | `/blog/eslint-prettier/2024/05/13/` |
| `_posts/2024-08-20-testcontainers-with-github-actions.markdown` | `2024-08-20 00:00:00 +0100` | `/blog/testcontainers-with-github-actions/2024/08/19/` |

Blog index order on the live site matches that list (newest live date first).

Kramdown is doing more than piping Markdown through:

- Typographic quotes (`I'm` in source, `I’m` on the home page and in posts).
- Fenced code in `typescript`, `ts`, `json`, and unlabeled fences. The ESLint post uses four-backtick fences around a block that itself contains fences.
- Rouge markup: `<div class="language-… highlighter-rouge"><div class="highlight"><pre class="highlight"><code>`. Inline code gets `class="language-plaintext highlighter-rouge"`.
- Raw HTML in Markdown (the home and 404 color spans).

There is no RSS feed, no sitemap plugin, no tags, no pagination, and no search. Five posts, ten jobs.

### Styling and assets

`assets/main.scss` only `@import`s `_sass/_main.scss`, which pulls in:

- Google Fonts Source Sans Pro 400/600/900
- Font Awesome 4.7 from cdnjs (the footer icons)
- `_reset.scss` (Meyer reset, public domain header)
- `_pygments.scss` (selectors are `.highlight`, written for Rouge/Pygments class names)
- `site/` partials: variables, typography, site chrome, blog, resume

Palette is small: primary `#0094c6`, dark grey `#565554`, light grey `#fbfbfb`, 62.5% root font size. One breakpoint, in the resume personalia block at 600px (photo hidden).

Static files that must keep working:

- `/assets/favicon.ico` (the tag says `type="image/png"`; the file is `.ico`)
- `/assets/imgs/mugshot.jpg`
- `/assets/main.css` (generated; Analog will emit its own hashed CSS and this path goes away)

`.gitignore` ignores `.idea`, `_site`, `.sass-cache`, `.jekyll-metadata`.

## Target architecture

A Vite + Angular app at the **repository root**, scaffolded with `npm create analog@latest` on Node >=26. The `blog` template is a useful reference for `provideContent`, `injectContentFiles`, and `MarkdownComponent`. Delete its sample posts before committing. Record the resolved Analog, Angular, and Vite versions in the scaffold PR. Analog's compatibility table treats "latest" as the supported line for current Angular majors; pin the lockfile rather than floating `latest` in CI.

Production is a static site. No Node server, no API routes, no Nx.

### Rendering and SSG

In `vite.config.ts`:

- `static: true` so the build does not emit a server.
- `ssr: true` as well. Analog still requires SSR to prerender, and the deployed artifact is the static files.
- `prerender.routes` lists `/`, `/resume`, `/blog`, `/404.html`, and every post path.
- `prerender.sitemap.host` is `https://mfstapert.dev` once we decide a sitemap is in scope (see open questions). There is no sitemap today.
- Nitro `routeRules` includes `'/404.html': { ssr: false }`, matching the [SSG docs](https://analogjs.org/docs/features/server/static-site-generation) example that prerenders `404.html` for static hosts.

Output directory: `dist/analog/public`. That directory is what GitHub Pages should publish.

Prerender every public URL. Client-side routing can still hydrate, and the first response for each known URL is finished HTML. Resume entries stay data: they are not routes (`output: false` today).

GoatCounter stays a script tag in `index.html` (same `data-goatcounter` URL). See open questions for in-app navigations.

### Routing

Filesystem routes under `src/app/pages`. The shared chrome (header, main container, footer) lives on the root application component around `<router-outlet>`, which replaces `_layouts/default.html`.

| Route file | URL |
| --- | --- |
| `src/app/pages/(home).page.ts` | `/` |
| `src/app/pages/resume.page.ts` | `/resume` |
| `src/app/pages/blog.page.ts` | `/blog` |
| `src/app/pages/blog/[slug]/[year]/[month]/[day].page.ts` | `/blog/:slug/:year/:month/:day` |
| a page that prerenders to `404.html` | `/404.html` |

Home and 404 are component templates. Their only "Markdown" is one line with a span, and the hero layout exists to undo kramdown's `<p>` wrapper. A template with `h1.hero-title` is the whole feature.

`routeMeta.title` replaces the Liquid title expression. Keep the current strings until the title question below is decided, including the home/404 value `mfstapert.`.

The post page loads Markdown with `injectContent` by **slug only**. `year`, `month`, and `day` exist so the URL matches production. The component should fail the page when those params disagree with the path stored on the file, so a wrong date does not serve the article.

Blog index uses `injectContentFiles` filtered to the blog directory. That API returns `filename`, `slug`, and `attributes` only; the body is loaded on the post page. Sort by the stored published date, newest first, in the component. Do not rely on directory order.

Resume page uses `injectContentFiles` on the resume directory and sorts by the numeric filename prefix descending (`10` … `01`). Missing `languages`, `activities`, and `technology` stay optional.

Analog also supports Markdown files as routes (`src/app/pages/about.md`). Use that only if a page is truly a Markdown document. Home, resume, blog index, and 404 are layouts plus data, so they stay `.page.ts` files.

### Content

```
src/content/blog/<slug>.md
src/content/resume/01yourholding.md … 10xip.md
public/assets/favicon.ico
public/assets/imgs/mugshot.jpg
public/CNAME          # contains mfstapert.dev
public/.nojekyll
```

Blog front matter should record the live URL explicitly so nothing recomputes midnight-+0100:

```yaml
---
title: '[node] Why I no longer use npx in CI'
slug: why-i-no-longer-use-npx
published: 2024-04-01
path: /blog/why-i-no-longer-use-npx/2024/04/01/
---
```

`published` is the label shown as "Published:" and the blog sort key. `path` is what prerender emits. Copy both from the live site (table above), not from the filename and not from `new Date()` of the +0100 timestamp.

Resume front matter can move as-is. Add nothing required. Keep the `NN` filename prefix as the sort key.

`app.config.ts` providers:

```ts
provideContent(withMarkdownRenderer(), withShikiHighlighter());
```

`vite.config.ts` content highlighter: `shiki`, with languages that cover the posts (`typescript` / `ts`, `json`, and unlabeled fences as plaintext). Shiki runs at build time, which fits SSG. Prism is the other supported highlighter; it would ship highlighting in the client. Prefer Shiki.

Map each content file to its public path in prerender config:

```ts
{
  contentDir: 'src/content/blog',
  transform: (file) => file.attributes.path,
}
```

Also list `/`, `/blog`, `/resume`, and `/404.html`.

Kramdown-to-Analog checks while moving the five files (this is the real content risk, and it is small):

- Four-backtick fence in `_posts/2024-05-12-eslint-prettier.markdown`.
- Language tags `typescript` and `ts`.
- Unlabeled fences (the npx post).
- Curly quotes. Either leave kramdown's substitutions as characters in the Markdown, or accept straight quotes. Decide in the content PR and glance at the rendered post.
- Inline HTML. Home and 404 should not depend on the Markdown renderer allowing raw HTML.

Call the content renderer from the post template:

```html
<h1>{{ post.attributes.title }}</h1>
<h3 class="color-primary">Published: {{ post.attributes.published }}</h3>
<analog-markdown [content]="post.content" />
```

### Styling

Port `_sass` to a global stylesheet (Vite SCSS, `sass` as a dev dependency) and import it the way the Analog scaffold loads global styles. Keep the class names the templates already use: `container`, `hero-title`, `color-primary`, `blog-item`, `resume-section`, `resume-personalia`, `resume-experience`, `multi-column`, `social-icons`, `site-title`, `main-nav`.

External component `styleUrls` work without extra Analog config. Inline component `styles` in SCSS need `inlineStylesExtension: 'scss'` on the Angular plugin. Prefer the global sheet plus a few component templates so that setting stays unnecessary.

Drop `_pygments.scss` when the highlighter changes. Rouge's `.highlight` wrappers will not be in the HTML. Shiki emits its own `pre` (theme class `shiki` by default). Restyle code blocks in the blog partial against that markup: dark background, padding, and the inline `code` treatment that is there today (dark grey background, white text). Pick the Shiki theme in the open-questions list; `github-dark` is Analog's default and will not match the current Rouge palette until someone chooses a closer theme.

Keep the Google Fonts and Font Awesome `@import`s on the first pass so the wordmark and footer icons match. Self-hosting is optional cleanup.

Copy `favicon.ico` and `mugshot.jpg` into `public/assets/...` so the existing URLs still resolve. The resume image `src` stays `/assets/imgs/mugshot.jpg`.

## Route mapping

Canonical URLs to preserve:

| Current URL | HTTP today | Analog |
| --- | --- | --- |
| `/` | 200 `mfstapert.` | `(home).page.ts`, hero template |
| `/resume` | 200 | `resume.page.ts` + resume content files |
| `/resume/` | 404 | see trailing-slash note |
| `/blog` | 200 | `blog.page.ts` |
| `/blog/` | 404 | see trailing-slash note |
| `/blog/warning-a-user-of-unsaved-changes-in-angular/2021/12/28/` | 200 | dynamic post route + stored `path` |
| `/blog/bugfix-for-angular-retaining-input-value/2024/03/12/` | 200 | same |
| `/blog/why-i-no-longer-use-npx/2024/04/01/` | 200 | same |
| `/blog/eslint-prettier/2024/05/13/` | 200 | same |
| `/blog/testcontainers-with-github-actions/2024/08/19/` | 200 | same |
| post URL with the slash removed | 301 to the slash form | static host / router should still end on the slash form |
| `/404.html` | the Pages 404 document | prerendered `404.html` |
| any other path | 404 from that document | same file, once Pages is serving the Analog output |
| `/assets/favicon.ico`, `/assets/imgs/mugshot.jpg` | 200 | `public/assets/...` |
| resume entry URLs | none (`output: false`) | still none |

Trailing slash: GitHub Pages serves `/resume` from `resume.html` and returns 404 for `/resume/`. A generator that emits `resume/index.html` would make `/resume/` a 200. That is a behavior change, not a broken link. Prefer whatever Analog already emits, and add `<link rel="canonical">` for `/resume`, `/blog`, and each stored post `path` so the slash duplicate is not a second URL. Confirm the emitted filenames in the prerender PR (`blog.html` vs `blog/index.html`, and post `index.html` under the dated directory).

Internal links in the header should be router links to `/`, `/resume`, and `/blog`. Post links on the index should be the stored `path`.

## Phased PRs

Rule for every phase before cutover: **do not merge the Analog app onto `master` while Pages still builds `master` with Jekyll.** Jekyll would copy `src/`, `package.json`, and the rest into the published site, or fail the build. Implementation PRs target a long-lived branch (this plan's branch, or a successor cut from it). `master` stays the Jekyll site until the hosting step says otherwise.

Effort is focused engineering time for someone who knows Angular and is using Analog for the first time. It is not a calendar estimate.

### Phase 0 — this plan

Doc only. No app, no Pages change.

**Effort:** done in this PR.

### Phase 1 — scaffold and chrome

- Scaffold Analog at the repo root on the migration branch. `create-analog` refuses a non-empty directory; scaffold to a temp directory and copy the project files in, leaving Jekyll files in place on that branch until phase 4.
- Root shell: header, footer, container, nav. Global SCSS port of `_sass` except `_pygments.scss`.
- `public/assets` favicon and mugshot.
- Placeholder home, resume, blog, and 404 routes with the real copy for home and 404 (they are one line each).
- `npm start` on port 5173. README on this branch notes that `master` still uses Docker/Jekyll.
- `.gitignore` gains Analog/Node entries (`node_modules`, `dist`, `.angular`). Keep the existing Jekyll ignores until phase 4.

**Done when:** the four routes render the current chrome locally, SCSS variables and the 600px resume breakpoint are in the global sheet, and `master` is unchanged.

**Effort:** 0.5–1 day.

### Phase 2 — content

- Move five posts and ten resume files into `src/content`, with the front matter described above. `published` and `path` copied from the live table.
- Blog index, post page, resume page (personalia markup moved into the resume component, jobs from content).
- Shiki enabled. Adjust blog code-block CSS to Shiki's markup.
- Prerender list includes `/`, `/blog`, `/resume`, `/404.html`, and the five `path`s.
- `npm run build` succeeds. Spot-check the ESLint post (nested fences), the npx post (unlabeled fence), and a TypeScript post against production HTML for structure, not for identical class names.

**Done when:** local preview shows the same five posts in the same order, the same ten jobs in `10`…`01` order, and optional resume fields omitted where the source omits them.

**Effort:** 1–1.5 days.

### Phase 3 — URL and HTML parity

- Titles match the chosen scheme (current Liquid strings, unless the open question is resolved toward readable titles).
- Canonical tags.
- Confirm prerender filenames for slash and non-slash URLs.
- `404.html` is a real file in `dist/analog/public`.
- GoatCounter script present in built HTML.
- Diff a production page and a built page for home, resume, blog index, and one post: nav, footer links, photo, published dates, code blocks.

**Done when:** a checklist of the route-mapping table is attached to the PR, each row marked with the built file that serves it.

**Effort:** 0.5–1 day.

### Phase 4 — hosting cutover

Do this only after phase 3's checklist is green on the migration branch. Details are in the next section. Sequence:

1. Freeze the current site onto a `gh-pages` branch (built HTML, `CNAME`, `.nojekyll`) and point Pages at that branch. `master` can then change without taking the site down.
2. Merge the Analog app and the Actions workflow to `master`.
3. Switch Pages source from the `gh-pages` branch to GitHub Actions. First successful Action deploy replaces the frozen Jekyll snapshot.
4. Watch home, a post, resume, and a bogus path on `https://mfstapert.dev`.
5. Follow-up PR deletes Jekyll: `_config.yml`, `_layouts`, `_includes`, `_sass`, `_posts`, `_resume`, `pages`, `Gemfile`, `Gemfile.lock`, `docker-compose.yml`, and the Jekyll lines in `.gitignore`. Update `README.md` to Analog (`npm install`, `npm start`, `npm run build`).

**Done when:** Pages is "GitHub Actions", the custom domain and HTTPS still match today's settings, and the Jekyll tree is gone.

**Effort:** about half a day, plus the production check. The risk is operational, not the volume of code.

### Phase 5 — optional follow-ups

Separate small PRs, any order, after cutover:

- Sitemap via Analog's prerender sitemap config.
- GoatCounter `count` on client navigations, if we want them.
- Self-host Source Sans Pro and Font Awesome.
- Drop the Docker workflow entirely from the README (phase 4 already removes the compose file).

**Effort:** up to half a day for the whole list.

**Total for phases 1–4:** about 3–4 days of engineering time.

## Deployment and hosting

Stay on GitHub Pages and on `mfstapert.dev`. DNS does not change. What changes is who builds the site.

Today a push to `master` triggers the legacy Jekyll builder. Analog's build is `npm run build`, and GitHub's Jekyll builder will not run it. The published directory becomes `dist/analog/public`.

### Why not switch `master` in place

If the Analog tree lands on `master` while the Pages source is still "branch `master` /", the next Jekyll build publishes the wrong tree. There is no Actions workflow on `master` today, and a Pages Actions workflow only runs from the default branch, so the safe order is: detach publishing from `master` first, then merge.

### Freeze, then cut over

1. From a clean Jekyll build of current `master` (GitHub's last good deploy, or a local `starefossen/github-pages` build), commit the **generated HTML** to an orphan `gh-pages` branch. Include `CNAME` (`mfstapert.dev`) and an empty `.nojekyll` so Pages does not run Jekyll on that branch.
2. In the repo settings, set Pages to deploy from branch `gh-pages` / root. Confirm `https://mfstapert.dev` still looks like production. Rollback from this moment until step 4 is "Pages source = `gh-pages` branch", which is still the old site.
3. Merge the migration branch to `master`. Add `.github/workflows/pages.yml` that:
   - runs on push to `master` (and on `workflow_dispatch`)
   - `actions/checkout`, `actions/setup-node` with `node-version-file: package.json` (engines `>=26`) and npm cache
   - `npm ci`, `npm run build`
   - uploads `dist/analog/public` with `actions/upload-pages-artifact`
   - deploys with `actions/deploy-pages`
   - permissions: `contents: read`, `pages: write`, `id-token: write`
   - `environment: github-pages`
4. After that workflow file is on `master`, switch Pages source from "Deploy from a branch" to "GitHub Actions" and run the workflow. Analog's docs also show `k9n-dev/analog-publish-gh-pages` and `angular-cli-ghpages`. Those push a branch with a personal access token and were demonstrated against older Analog/Node combinations. Prefer the official `deploy-pages` action and `GITHUB_TOKEN`.
5. The artifact must contain `CNAME` and `.nojekyll`. Put both in Vite `public/` so they land in `dist/analog/public`. Analog's GitHub Pages docs require `.nojekyll` on a `gh-pages` branch deploy; keep it for the artifact deploy too.
6. Verify, then the phase-4 cleanup PR removes Jekyll.

Rollback after step 4: redeploy the previous Actions artifact, or point Pages back at the `gh-pages` branch until that branch is deleted. Delete `gh-pages` only after a few known-good Action deploys.

Local Docker preview goes away with the Jekyll files. Replacement is `npm start` (Vite, port 5173). No new hosting account, no server process, no change to the GoatCounter property beyond the script still being on the page.

Node in CI is >=26, the current LTS, taken from `package.json` `engines`. The older Pages examples that pin Node 20 should not be copied.

## Risks

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Merging Analog onto `master` too early | Legacy Pages publishes `master` as Jekyll | Freeze on `gh-pages` first. Keep implementation PRs off `master`. |
| Recomputing post dates | Every live URL is the UTC day before the `+0100` front-matter instant; filenames differ again | Store `path` and `published` as plain strings from the live table. |
| Highlighter markup | Blog CSS targets `.highlight`. Shiki does not emit Rouge wrappers | New code-block rules in the same PR that enables Shiki. Compare one post visually. |
| Nested fences | The ESLint post is four backticks around inner fences | Render that post in phase 2 before calling content done. |
| `injectContentFiles` order | Blog order is date order; resume order is reversed filename order | Sort in the components. Cover both with a quick unit or a build assertion if the scaffold includes a test runner. |
| Trailing slash duplicates | `/blog/` is 404 today; `blog/index.html` would make it 200 | Canonical tags. Record actual output filenames in the phase-3 checklist. |
| `404.html` not emitted | Unknown paths would be GitHub's generic 404 | Prerender `/404.html` and confirm the file is in the artifact. |
| Angular weight | Current HTML is a few KB. Analog still ships the framework (the Analog docs site's main chunk is on the order of 100 KB gzip, plus page chunks) | Accepted. The site stays static. No SSR host to run. |
| GoatCounter under-counts | The script counts full loads. Client-side navigations may not | Direct visits and reloads still count. A router hook is phase 5. |
| Cutover window | Settings and the first Actions deploy have to both be right | Frozen `gh-pages` branch is the rollback. |
| Third-party deploy actions | PAT-based `gh-pages` pushes, older version pins | Official Pages actions only. |
| Lockfile drift | Analog's compatibility table moves with Angular majors | Pin versions in the scaffold PR; upgrade with `ng update @analogjs/platform@latest` later, on purpose. |

## Open questions

1. **Post URLs.** Keep the live UTC-shifted paths (recommended; zero broken links), or canonicalize to the front-matter civil date and add static redirect HTML at the old paths? GitHub Pages has no redirect service of its own.
2. **Document titles.** Keep `mfstapert.blog`, `mfstapert.[node] why i no longer use npx in ci`, and the home/404 title `mfstapert.`, or switch to readable titles (`mfstapert`, `Blog · mfstapert`, post title)?
3. **Code theme.** Shiki `github-dark` (Analog default) or a theme closer to the current Rouge palette in `_sass/_pygments.scss`?
4. **Quotes.** Preserve the curly quotes kramdown already published, or let the source punctuation through?
5. **Analytics.** Are full-page loads enough, or should client navigations call GoatCounter too?
6. **Sitemap.** Analog can emit `sitemap.xml`. The Jekyll site has none. In or out of the cutover?
7. **Fonts and icons.** Leave the Google Fonts and cdnjs Font Awesome imports, or self-host in phase 5?
8. **Slash URLs for `/blog` and `/resume`.** Accept a 200 on the trailing-slash form if the build emits `index.html`, as long as canonical points at the current URL?

## Suggested first implementation step

Phase 1 on this branch's successor: scaffold with the blog template, port the global SCSS and the shell, and stop. Content files and the Pages setting stay untouched until their own PRs.
