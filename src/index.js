import pnormaldist from 'pnormaldist';

// Standard Wilson score interval
export function wilsonStandard(p, n, z) {
  const high = ((p + ((z * z) / (2 * n))) + (z * Math.sqrt(((p * (1 - p)) / n) + ((z * z) / (4 * (n * n)))))) / (1 + ((z * z) / n));
  const low = ((p + ((z * z) / (2 * n))) - (z * Math.sqrt(((p * (1 - p)) / n) + ((z * z) / (4 * (n * n)))))) / (1 + ((z * z) / n));
  const center = ((p + ((z * z) / (2 * n))) / (1 + ((z * z) / n)));

  return {
    high,
    center,
    low,
  };
}

// Wilson score interval with continuity correction
export function wilsonContinuity(p, n, z) {
  const high = (((2 * n * p) + (z * z) + (z * Math.sqrt((z * z) - (1 / n) + (4 * n * p * (1 - p)) - (4 * p - 2)) + 1)) / (2 * (n + (z * z))));
  const low = (((2 * n * p) + (z * z) - (z * Math.sqrt((z * z) - (1 / n) + (4 * n * p * (1 - p)) + (4 * p - 2)) + 1)) / (2 * (n + (z * z))));
  const center = (((2 * n * p) + (z * z)) / (2 * (n + (z * z))));

  return {
    high,
    center,
    low,
  };
}

/*
 * credit: Sean Wallis, Survey of English Usage, University College of London
 * source: https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/
 */
export default function (f, n, c = 0.95, N = false, continuity = false) {
  const p = f / n;                    // proportion of positive outcomes

  if (N) {                            // if population size given
    const v = Math.sqrt(1 - n / N);   // determine scale factor
    n /= v;                           // and adjust sample size
  }

  const z = pnormaldist(1 - (1 - c) / 2); // calculate z-score: http://www.evanmiller.org/how-not-to-sort-by-average-rating.html

  return continuity ? wilsonContinuity(p, n, z) : wilsonStandard(p, n, z);
};
