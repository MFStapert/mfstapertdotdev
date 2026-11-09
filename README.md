# mfstapert.dev

Personal site for Marijn Stapert: [mfstapert.dev](https://mfstapert.dev).

The site is an [Analog](https://analogjs.org/) app (Angular and Vite). `npm run build` prerenders static HTML to `dist/analog/public`, which GitHub Pages serves.

## Develop

Requires Node >=26 (see `package.json` `engines`).

```sh
npm ci
npm start
```

The dev server is at <http://localhost:5173>.

```sh
npm test
npm run build
npm run preview
```

`preview` serves the prerendered build.

## Project layout

- `src/app` — app bootstrap
- `src/pages` — routes (`/`, `/blog`, `/blog/<slug>`, `/resume`, and the 404)
- `src/content/blog` — posts, served at `/blog/<slug>`
- `src/content/resume` — resume entries rendered on `/resume`
- `src/lib` — shared logic
- `src/styles.css` — the only global stylesheet (see Styling)
- `public/` — files copied into the build as-is, including `CNAME`

## Styling

The site uses [Tailwind CSS](https://tailwindcss.com/) v4 through its Vite plugin. There is no JavaScript config. Everything global lives in `src/styles.css`, which `index.html` loads:

- `@theme` holds the design tokens: the `primary`, `light-grey` and `dark-grey` colors, the `sans` font, and the `micro`, `small`, `medium` and `large` spacing steps. Use them as utilities, for example `text-primary` or `mb-large`.
- `@layer base` sets element defaults on top of Preflight (body text, headings, paragraphs, links). These also cover HTML the templates do not write themselves, such as resume entries.
- `prose-site` tunes [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography) for blog post bodies. Use it together with `prose`. Code blocks keep Shiki's inline `github-light` colors.

## Deploy

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It calls [`.github/workflows/ci.yml`](.github/workflows/ci.yml), which installs dependencies, runs the tests and the build, and uploads `dist/analog/public` as the Pages artifact. The `deploy` job publishes that artifact. Pull requests run the `checks` job in `ci.yml` only.

`public/CNAME` (`mfstapert.dev`) is copied into that artifact so the custom domain stays attached. Posts are `/blog/<slug>`. The old dated Jekyll URLs are not redirected.
