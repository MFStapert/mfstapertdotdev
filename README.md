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

- `src/app/pages` — routes (`/`, `/blog`, `/resume`, and the 404)
- `src/content/blog` — posts, served at `/blog/<slug>`
- `src/data/resume` — resume entries rendered on `/resume`
- `public/` — files copied into the build as-is, including `CNAME`

## Deploy

Pushes to `master` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow installs dependencies, runs the tests and the build, and deploys `dist/analog/public` with GitHub's Pages actions.

`public/CNAME` (`mfstapert.dev`) is copied into that artifact so the custom domain stays attached. Posts are `/blog/<slug>`. The old dated Jekyll URLs are not redirected.
