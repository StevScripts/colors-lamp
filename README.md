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
It then starts PHP and MySQL on the runner and runs the Jest tests. A lint error,
warning, or test failure fails the workflow. The project `.npmrc` enables normal
peer-dependency resolution so local installs use the same dependency rules as
GitHub Actions.

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

The `glob` and `minimatch` overrides in `package.json` keep ESLint and Jest's
transitive dependencies on versions patched for
[GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) and
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).

### Automated tests

- The front-end unit tests check how the browser script displays search results
  and the message for no matches. Run them with `npm test -- tests/unit`.
- The integration test sends real requests to PHP to log in, save a color in
  MySQL, and search by part of its name. It checks the status, content type, and
  JSON returned by each endpoint.

To run both suites locally, set up a fresh MySQL test database and import
`database/schema.sql` followed by `tests/fixtures/test-user.sql`. Use PHP 8 with
`mysqli` enabled. Set `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in the
server's shell, using a database account with `SELECT` and `INSERT` on the test
database. Start PHP from the repository root:

```sh
php -S 127.0.0.1:8000 -t public scripts/router.php
```

Run `npm test` in a second terminal. Node.js runs the lint tools and Jest.

To debug a failed run, open the repository's **Actions** tab, select the
**Lint and Test** run, and expand the failing step. Fix the failure, then
commit and push again. Use the commit with a green run for submission.
