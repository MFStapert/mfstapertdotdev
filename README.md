# mfstapert.dev

Personal site for Marijn Stapert: [mfstapert.dev](https://mfstapert.dev).

The site is an [Analog](https://analogjs.org/) app (Angular and Vite). `npm run build` prerenders static HTML to `dist/analog/public`.

## Develop

Requires Node >=26.

```sh
npm install
npm start
```

The dev server is at <http://localhost:5173>.

```sh
npm test
npm run build
```

## Publishing

Merging to `master` does not, by itself, switch the live site to this app.

The workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs only on pushes to `master`. It builds the static site and deploys with GitHub's Pages actions. That deploy publishes only after the repository's Pages source is **GitHub Actions**. Until then, Pages is the legacy Jekyll builder on `master`.

### Cutover, done by hand

1. Merge this stack into `master` only when you are ready to change the live site. If Pages is still "Deploy from a branch" / `master` / `/`, the next push makes Jekyll try to publish the Analog tree.
2. Right away, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Leave the custom domain `mfstapert.dev` and HTTPS as they are. Do not change DNS.
3. Watch the **Deploy site** workflow. Confirm `/`, `/blog`, one post, `/resume`, and an unknown path (the custom 404).
4. If the deploy fails, revert `master` to the last Jekyll commit and set Pages back to **Deploy from a branch**, branch `master`, folder `/`.

`CNAME` in the repo root and in `public/` both contain `mfstapert.dev`. The build copies `public/CNAME` and `public/.nojekyll` into the Pages artifact.

Old dated post URLs are not redirected. Posts are `/blog/<slug>`.
