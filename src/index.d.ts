/** Options for {@link wilson}. Omitted or `undefined` options use their defaults. */
export interface WilsonOptions {
  /**
   * Size of the finite population the sample was drawn from (a positive whole
   * number, at least `sample`). Narrows the interval with the finite population
   * correction; if `sample` equals `population`, the interval collapses to p.
   * Default: no population (an infinite population).
   */
  population?: number | undefined;

  /**
   * Confidence level of the interval, strictly between 0 and 1.
   * @default 0.95
   */
  confidence?: number | undefined;

  /**
   * Apply a continuity correction (Newcombe 1998 method 4; Wallis 2019), which
   * widens the bounds. `center` is unchanged.
   * @default false
   */
  continuityCorrection?: boolean | undefined;
}

/** A Wilson score interval. Always `0 <= low <= center <= high <= 1`. */
export interface WilsonInterval {
  /** Upper bound of the interval. */
  high: number;
  /** Center of the Wilson score interval (not the observed proportion). */
  center: number;
  /** Lower bound of the interval. Often used as a ranking score. */
  low: number;
}

/**
 * Calculates the Wilson score interval for a binomial proportion.
 *
 * @param observed Count of positive outcomes, a whole number from 0 to `sample`.
 * @param sample Sample size, a positive whole number.
 * @param options Population size, confidence level and continuity correction.
 * @returns The interval's `high`, `center` and `low`.
 * @throws {Error} If an argument is out of range, an option is unknown, or the
 *   v5 positional form `wilson(observed, sample, population, confidence)` is used.
 *
 * @example
 * wilson(5, 100);
 * // { high: 0.1118, center: 0.0666, low: 0.0215 } (rounded)
 *
 * wilson(5, 100, { population: 227, confidence: 0.9 });
 */
export default function wilson(observed: number, sample: number, options?: WilsonOptions): WilsonInterval;

/**
 * Quantile (inverse CDF) of the standard normal distribution, computed with
 * Peter J. Acklam's rational approximation (relative error below 1.15e-9).
 *
 * @param p A probability from 0 to 1. Returns `-Infinity` at 0 and `Infinity` at 1.
 * @throws {Error} If `p` is outside [0, 1] or NaN.
 */
export function normalQuantile(p: number): number;
