---
layout: post
title: '[angular] Minimal ESLint and prettier setup'
date: 2024-05-14 00:00:00 +0100
---

Recently I had the assignment to set up prettier and ESLint for new projects at my company.
Most projects we do involve 2 webapps in a mono repo and 2-3 front-end developers working at a time.
In this article I'll summarize my findings to save you, the reader, some time setting this up.
A repo with this setup can be found [here](https://github.com/MFStapert/prettier-ESLint-angular-config).

## .editorconfig

`.editorconfig` will be picked up by all editors unless specified otherwise.
This config has overlap with prettier, moving all config that is not unique to `.editorconfig`, to prettier config, makes both easier to maintain. 

````
root = true

[*]
charset = utf-8
insert_final_newline = true
trim_trailing_whitespace = true
````

## prettier 

Prettier is as an opinionated formatter with little configuration options, using it without any configuration is perfectly justifiable.

```json
{
    "printWidth": 100,
    "singleQuote": true,
    "arrowParens": "avoid",
    "plugins": [
        "prettier-plugin-organize-imports", 
        "prettier-plugin-organize-attributes"
    ]
}
```
Angular being pretty verbose justifies the increased print width for me, you can still view 2 files open on a small screen side by side.

For plugins; `prettier-plugin-organize-imports` is mandatory since it eliminates review comments about unused imports.
I would recommend `prettier-plugin-organize-attributes`, for consistency’s sake.

## ESLint

ESLint can be an obtuse tool both in its usage and configuration. 
I would not recommend using ESLint in combination with the angular CLI for the majority of projects.
Setting up ESLint with the angular CLI requires extra configuration and dependencies while adding no benefits in most scenarios.
I would consider the angular CLI in multi project repo's so projects can be linted individually.

For configuration, I use a single file, that can be extended:

```json
{
  "root": true,
  "ignorePatterns": [
    "**/build/**",
    "**/coverage/**",
    "**/dist/**",
    "**/generated/**",
    "**/node_modules/**"
  ],
  "extends": [
    "prettier"
  ],
  "overrides": [
    /* abreviated */
  ]
}
```

Prettier configuration being extended here is the only exiting line since it's needed to play nice with prettier.
The overrides look as follows:

```json
{
  "overrides": [{
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "no-console": ["error", {"allow": ["warn", "error"]}],
        "@angular-eslint/prefer-standalone": "error",
        "@angular-eslint/use-lifecycle-interface": "error"
      }
  },
  {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-ESLint/template/recommended",
        "plugin:@angular-ESLint/template/accessibility"
      ],
      "rules": {
        "@angular-eslint/template/prefer-control-flow": "error",
        "@angular-eslint/template/prefer-ngsrc":"error"
      }
  }]
}
```

Only recommended rulesets are chosen, most rules chosen are to enforce use of modern angular features.
My recommendation is to only extend these rules to prevent problems specific to your organisation. 

Rules for selector prefix are omitted since it's redundant for single app projects.
For multi-app projects you can add config files per app, that extend from this parent config and add the rules `@angular-ESLint/directive-selector` and `"@angular-ESLint/component-selector"`.
This way you can enforce prefixes on components like `app1-component` and `app2-component` on a per-app basis.

## pre-commit

Lint-staged and husky are recommended by prettier for javascript projects.
If you use a polyglot monorepo there are alternatives, like `pre-commit` and `husky-dotnet`. 

```json
{
  "lint-staged": {
    "**/*.{css,html,json,md,js,ts,yaml}": "prettier --write --ignore-unknown",
    "**/*.{js,ts,html}": "eslint --fix"
  }
}

```

## Alternatives

Currently, there aren't any viable alternatives to these tools, there are in development but nothing mature yet.
Most new tooling seems to focus on speed, but I'd like to see tooling that reduces the amount of setup and dependencies.

## Conclusion

Having a decent set-up for prettier and ESLint can provide a decent basis for code quality.
By keeping the configuration minimal you can later on easily modify and extend it when specific needs arise.
