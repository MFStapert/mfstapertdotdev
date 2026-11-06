# mfstapert.dev

Personal site for Marijn Stapert: [mfstapert.dev](https://mfstapert.dev).

This branch is an Analog (Angular + Vite) rewrite. It is not what GitHub Pages publishes. `master` is still the Jekyll site, built by the legacy Pages builder from the repository root.

## Analog app

Requires Node >=26.

```sh
npm install
npm start
```

The dev server runs at <http://localhost:5173>.

```sh
npm run build
npm test
```

`npm run build` prerenders the static site to `dist/analog/public`.

## Jekyll site on master

`master` still previews with Docker:

```sh
docker compose up
```

Jekyll listens on port 4000. That workflow goes away when the Analog cutover is merged and Pages is switched to GitHub Actions.
