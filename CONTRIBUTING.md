# Contributing to wilson-interval

Thanks for helping out. Bug reports, fixes, docs improvements and feature ideas are all welcome.

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

Coverage must stay at **100%** (Codecov checks this on every pull request). To see a coverage summary locally:

```sh
node --test --experimental-test-coverage src/index.test.js
```

`npm run test:cc` writes the same report to `lcov.info`, which is what CI uploads.

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

## Pull requests

1. Fork the repo and create a branch from `master`.
2. Make your change, with tests.
3. Run `npm test` and check coverage.
4. Open a pull request and fill in the template. Link the issue it fixes (for example `Closes #12`).

CI runs the tests on every supported Node version. A maintainer will review, and may ask for changes before merging. Commits on `master` must be signed; if yours aren't, the maintainer can squash-merge.

## Reporting bugs

Use the [bug report form](https://github.com/erikfox/wilson-interval/issues/new?template=bug_report.yml). For a wrong-result bug, include the exact call, the output you got, and the value you expected along with where that value comes from.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
