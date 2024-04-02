---
layout: post
title: '[node] Why I no longer use npx in CI
date: 2024-04-02 00:00:00 +0100
---

I always prefixed "scripts" in the `scripts` property of my `package.json` with `npx`.
But recently I came to the conclusion this might be a bad idea, why? Let's take a look at what `npx` does. 

```
Executes <command> either from a local node_modules/.bin, or from a central cache, installing any packages needed in order for <command> to run.
```

So, when you run a script, `npx prettier` it will look in your `node_modules/.bin` first for an executable to run.
If nothing is found in your `node_modules`,  `npx` will start looking for _any_ version in your local cache (`~/.npm` folder on unix, `%LocalAppData%\npm-cache` on windows).
If nothing is found, it will install the latest version of the package it can find.

While this is great if you just want to run a standalone script: like scaffolding a new project or formatting some code, this can lead to issues in CI.
In a CI environment, you want to run commands with the versions specified in your `package.json`, nothing else.

If something in your pipeline breaks around the installation of `node_modules`, `npx` usage can lead to further issues. 
Say you are using an older version of `jest`, but you run a script with `npx`, your test can be run with a different `jest` version than the one you've configured.
This can lead to unintended behavior or worse, false positives. 

Running your scripts without `npx` ensures this is not possible, your CI environment will only use the dependencies specified or break.
This seems preferable to me versus a mechanism that can potentially introduce flakiness.