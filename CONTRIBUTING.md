# Contributing to wilson-interval

Thanks for helping out. Bug reports, fixes, docs improvements and feature ideas are all welcome.

Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).

## Ground rules

- **No runtime dependencies.** The package is a single ES module with no build step. Changes that add a dependency or a compile step are unlikely to be accepted.
- **Statistics need a source.** If you change a formula or add a new one, cite where it comes from (a paper, a textbook, or one of the [Wallis posts](https://corplingstats.wordpress.com/) the README links to).
- **Open an issue first for larger changes,** such as new options or API changes, so we can agree on the approach before you write code.

## Setup

You need a current Node.js LTS release (see `engines` in `package.json`) and npm.

```sh
git clone https://github.com/erikfox/wilson-interval.git
cd wilson-interval
npm ci
```

## Tests

Tests use the built-in Node test runner (`node:test`), so there is nothing else to install.

```sh
npm test
```

Coverage must stay at **100%** of lines, branches and functions. CI enforces this: the command below fails if any of the three drops, prints a coverage summary, and writes `lcov.info` for Codecov. It needs Node 22.8 or later.

```sh
npm run test:cc
```

TypeScript definitions are hand-written in `src/index.d.ts`. If you change the public API, update them and the fixture in `test/types.ts` (which also checks that invalid calls are rejected), then run:

```sh
npm run test:types
```

When you write tests:

- **Fixing a bug:** add a test that fails before your fix and passes after it.
- **Expected values come from an independent calculation,** not from running this module and copying the output. [`scripts/reference.py`](scripts/reference.py) computes them with Python's standard library (`statistics.NormalDist`). Add a case there, then regenerate the table the tests read:

  ```sh
  python3 scripts/reference.py > scripts/reference.json
  ```

  CI runs `python3 scripts/reference.py --check scripts/reference.json` and fails if the two are out of sync.
- **Compare floating-point results with a tolerance** (see `assertClose` in `src/index.test.js`), not exact equality.

## Linting and formatting

[Biome](https://biomejs.dev/) lints and formats the JavaScript, TypeScript and JSON files, using the rules in `biome.json`. Like the other tools, it runs through a pinned `npx`, so there is nothing to install.

```sh
npm run lint     # check, as CI does
npm run format   # fix formatting in place
```

## Pull requests

1. Fork the repo and create a branch from `master`.
2. Make your change, with tests.
3. Run `npm test`, `npm run test:cc` and `npm run lint`.
4. Open a pull request and fill in the template. Link the issue it fixes (for example `Closes #12`).

A maintainer will review, and may ask for changes before merging. Commits on `master` must be signed; if yours aren't, the maintainer can squash-merge.

### CI checks

Every pull request runs these checks, and they must pass before it can merge:

| Check | What it checks | Run it locally |
|---|---|---|
| `test (22.x)`, `test (24.x)`, `test (latest)` | The test suite on each supported Node release | `npm test` |
| `coverage` | 100% line, branch and function coverage | `npm run test:cc` |
| `lint` | Lint rules and formatting, with [Biome](https://biomejs.dev/) (`biome.json`) | `npm run lint`; `npm run format` fixes formatting |
| `types` | `src/index.d.ts` against the fixture in `test/types.ts` | `npm run test:types` |
| `reference` | `scripts/reference.json` matches `scripts/reference.py` | `python3 scripts/reference.py --check scripts/reference.json` |
| `package` | The files `npm publish` would ship, `package.json` fields and exports, and that the types resolve | `npm pack --dry-run`, then `npx -y publint@0.3.25 --strict` and `npx -y @arethetypeswrong/cli@0.18.5 --pack . --profile esm-only` |
| `actionlint` | Workflow syntax and expressions | [`actionlint`](https://github.com/rhysd/actionlint) |
| `zizmor` | Workflow and Dependabot security audits | `uvx zizmor@1.32.0 --offline .` or `pipx run --spec zizmor==1.32.0 zizmor --offline .` |

You only need `actionlint` and `zizmor` if you change files under `.github/`. Codecov also comments on each pull request with a coverage report. It isn't a required check, since `coverage` already enforces 100%.

## Reporting bugs

Use the [bug report form](https://github.com/erikfox/wilson-interval/issues/new?template=bug_report.yml). For a wrong-result bug, include the exact call, the output you got, and the value you expected along with where that value comes from.

To report a security vulnerability, don't open an issue: follow the [security policy](SECURITY.md) instead.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
