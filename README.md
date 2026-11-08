# COLORS

A COP 4331 lab application built with Linux, Apache, MySQL, and PHP.
Users can log in, save color names, and search their saved colors.

This repository organizes the existing lab application into version control.
It is based on the course's LAMP starter files. OpenAI Codex assisted with
setup, code fixes, verification, and repository organization.

## Continuous integration

The GitHub Actions workflow in `.github/workflows/lint.yml` runs on every
push and pull request, on all branches. It installs the locked development
dependencies with `npm ci`, then checks HTML, CSS, and JavaScript separately.
A lint error or warning fails the workflow. No database or running PHP server
is needed because linting checks source files without running the application.
The project `.npmrc` enables normal peer-dependency resolution so local installs
use the same dependency rules as GitHub Actions.

To run the same checks locally, use Node.js 22.22.3 and run:

```sh
npm ci
npm run lint
```

The tools and configuration files are:

| Files checked | Tool | Configuration | Individual command |
| --- | --- | --- | --- |
| `public/**/*.html` | HTML-validate | `.htmlvalidate.json` | `npm run lint:html` |
| `public/**/*.css` | Stylelint | `.stylelintrc.json` | `npm run lint:css` |
| JavaScript, including config files | ESLint | `eslint.config.mjs` | `npm run lint:js` |

HTML-validate uses its recommended rules. Stylelint uses its standard rules,
with an ID pattern that accepts the starter application's camelCase IDs.
ESLint uses its recommended rules plus strict equality, `no-var`, and
`prefer-const`. Browser globals are enabled for the application's scripts.
The `exported` comment in `code.js` identifies the functions called from HTML
so unused-variable checks remain enabled.

The `minimatch` overrides in `package.json` pin ESLint's glob dependencies to
the patched version for [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).

To debug a failed run, open the repository's **Actions** tab, select the **Lint**
run, and expand the failing step. Run that step's individual command locally,
fix the reported file and line, then commit and push again. The final commit
should have a green **Lint** run before submission.
