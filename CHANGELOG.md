# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `CHANGELOG.md`.
- `SECURITY.md`, with vulnerability reports through GitHub private vulnerability reporting.
- `CODE_OF_CONDUCT.md`, adopting the Contributor Covenant 3.0.
- An Accuracy section in the README, and credit for Peter J. Acklam's algorithm behind `normalQuantile`.
- An [interactive demo](https://erikfox.github.io/wilson-interval/), deployed to GitHub Pages from `master`.

### Changed

- The finite population diagram in the README is now committed to the repository instead of loaded from a third-party site.
- `package.json` sets `"sideEffects": false`, and `homepage` points to the demo.

## [6.0.0] - 2026-11-21

See [Migrating from v5](README.md#migrating-from-v5) for how to update calls.

### Changed

- **Breaking:** `wilson()` takes an options object, `wilson(observed, sample, { population, confidence })`, instead of positional `population` and `confidence` arguments. Calls with a number or `null` as the third argument, or with a fourth argument, throw an error that shows the new form.
- **Breaking:** Node.js 22 or later is required.
- **Breaking:** Unknown option names, such as `{ confidnce: 0.9 }`, throw. Options must be an object, and `null` option values are rejected.
- The published package contains only the runtime files (`src/index.js`, `src/index.d.ts`, `package.json`, `README.md` and `LICENSE`).

### Added

- `continuityCorrection` option: the Wilson score interval with continuity correction (Newcombe 1998, method 4). With `population`, the bounds use the adjusted sample size while the `1/(2n)` shift uses the original one.
- TypeScript definitions (`src/index.d.ts`), exporting `WilsonOptions` and `WilsonInterval`.
- Tests against reference values computed independently by `scripts/reference.py`, which CI keeps in sync.

## [5.1.1] - 2026-11-21

### Fixed

- Finite population correction: the observed proportion `p = observed / sample` is now kept, and only the effective sample size is divided by ν² = (N − n) / (N − 1). Earlier versions divided by ν and recomputed `p`, which shifted results. **Results with `population` change.**
- `sample` equal to `population` returns a zero-width interval at `p`.
- Throws when `observed` exceeds `sample`, when `sample` exceeds `population`, or when `confidence` is not a number.
- A confidence level close to 1 no longer returns `NaN`.
- The bounds are exact at `p = 0` and `p = 1`, and always satisfy `0 <= low <= p <= high <= 1`.

### Changed

- Releases are published to npm with trusted publishing (OIDC) from GitHub Actions, with a provenance attestation.

## [5.1.0] - 2025-07-24

### Removed

- The runtime dependencies (`mathjs` and `pnormaldist`). The package has had no dependencies since.

### Added

- Errors for invalid inputs, including a population of zero or less.

## [5.0.0] - 2025-07-24

No functional changes to the source code. This release reworks the repository. It is a major version because the dependency updates may break existing installs.

### Changed

- The package is an ES module (`"type": "module"`) and requires Node.js 18 or later.
- Dependencies updated to their latest stable versions, resolving all flagged vulnerabilities.
- Tests use the built-in Node.js test runner, with coverage reported to Codecov.
- Releases are published to npm by a GitHub Actions workflow.

### Removed

- All development dependencies.

[Unreleased]: https://github.com/erikfox/wilson-interval/compare/v6.0.0...HEAD
[6.0.0]: https://github.com/erikfox/wilson-interval/releases/tag/v6.0.0
[5.1.1]: https://github.com/erikfox/wilson-interval/releases/tag/v5.1.1
[5.1.0]: https://github.com/erikfox/wilson-interval/releases/tag/v5.1.0
[5.0.0]: https://github.com/erikfox/wilson-interval/releases/tag/v5.0.0
