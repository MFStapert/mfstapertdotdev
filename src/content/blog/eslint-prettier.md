---
title: 'mfstapert.[angular] minimal eslint and prettier setup'
slug: eslint-prettier
published: '2024-05-14'
displayTitle: '[angular] Minimal ESLint and prettier setup'
---

Updated: 9 Nov 2026. Prettier is gone. This site now formats with oxfmt.

Recently I had the assignment to set up formatting and ESLint for new projects at my company.
Most projects we do involve 2 webapps in a mono repo and 2-3 front-end developers working at a time.
In this article I'll summarize the setup this site uses now.
The older Prettier example is still [here](https://github.com/MFStapert/prettier-ESLint-angular-config).

## oxfmt

Prettier was an opinionated formatter with little configuration, and using it without any configuration was perfectly justifiable.
oxfmt fills that role now. It sorts imports itself, so the old organize-imports plugin is gone. No plugins at all.

```json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "singleQuote": true,
  "sortImports": true,
  "ignorePatterns": ["package-lock.json", "dist", "node_modules"]
}
```

Angular being pretty verbose still justifies a wide print width. oxfmt's default is 100, which is what I want, so I don't set it.
Single quotes stay, because that's what the code already uses.

```json
{
  "format": "oxfmt",
  "format:check": "oxfmt --check"
}
```

## ESLint

ESLint can be an obtuse tool both in its usage and configuration.
I would not recommend wiring it through the Angular CLI for the majority of projects.
One flat config file is enough.

Typed linting uses the TypeScript project service. There is no `tsconfig` that exists only for ESLint.

```js
export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.strictTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.html'],
    ignores: ['index.html'],
    extends: [...angular.configs.templateRecommended],
  },
);
```

`strict` and `strictTypeChecked` are the typescript-eslint presets. `strictTypeChecked` is why `projectService` is there: drop it and the type-aware rules go with it.
angular-eslint recommended covers TypeScript and templates. Inline templates are processed from the TypeScript files.
`no-console` is the behaviour rule I added. `warn` and `error` stay allowed.

OnPush is the Angular default, so components don't set `changeDetection`. The recommended preset already complains if you opt out to `Default` or `Eager`.

The file in this repo also allows decorated classes that would otherwise be empty, and it sets component and directive selectors without a required prefix. Those are there because this site has no `app` prefix. They are not extra behaviour rules.

```json
{
  "lint": "eslint ."
}
```

## pre-commit

husky and lint-staged still do the job Prettier recommended for JavaScript projects.
`npm ci` runs `prepare`, which installs the hook.

```
npx lint-staged
```

```json
{
  "lint-staged": {
    "*.{js,mjs,cjs,ts}": ["eslint --fix", "oxfmt"],
    "*.{html,json,jsonc,yml,yaml,md,scss,css}": "oxfmt"
  }
}
```

ESLint fixes first, oxfmt formats last, so the formatter wins.

## CI

The `checks` job runs the same two commands, after `npm ci` and before the tests and the build.

```
- run: npm run lint
- run: npm run format:check
```

## Conclusion

A small oxfmt and ESLint setup is enough to keep a project consistent.
Keep the config minimal and you can extend it later, when a specific need shows up.
