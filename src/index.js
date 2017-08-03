import math from 'mathjs';
import pnormaldist from 'pnormaldist';

// Standard Wilson score interval
export function wilsonStandard(p, n, z) {
  const scope = {
    p: math.bignumber(p),
    n: math.bignumber(n),
    z: math.bignumber(z),
  };

  const high = math.format(math.eval(
    '(p + z * z / (2 * n) + z * sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n)',
    scope,
  ));

  const low = math.format(math.eval(
    '(p + z * z / (2 * n) - z * sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n)',
    scope,
  ));

  const center = math.format(math.eval(
    '(p + z * z / (2 * n)) / (1 + z * z / n)',
    scope,
  ));

  return {
    high,
    center,
    low,
  };
}

// Wilson score interval with continuity correction
export function wilsonContinuity(p, n, z) {
  const scope = {
    p: math.bignumber(p),
    n: math.bignumber(n),
    z: math.bignumber(z),
  };

  const high = math.format(math.eval(
    '(2 * n * p + z * z + (z * sqrt(z * z - 1 / n + 4 * n * p * (1 - p) - (4 * p - 2)) + 1)) / (2 * (n + z * z))',
    scope,
  ));

  const low = math.format(math.eval(
    '(2 * n * p + z * z - (z * sqrt(z * z - 1 / n + 4 * n * p * (1 - p) + (4 * p - 2)) + 1)) / (2 * (n + z * z))',
    scope,
  ));

  const center = math.format(math.eval(
    '(2 * n * p + z * z) / (2 * (n + z * z))',
    scope,
  ));

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
  math.config({
    number: 'BigNumber',  // Default type of number:
    precision: 20,        // Number of significant digits for BigNumbers
  });

  f = math.bignumber(f);
  n = math.bignumber(n);
  c = math.bignumber(c);
  N = N ? math.bignumber(N) : N;

  // proportion of positive outcomes
  const p = math.eval(
    'f / n',
    { f, n },
  );

  // if population size given
  if (N) {
    // determine scale factor
    const v = math.eval(
      'sqrt(1 - n / N)',
      { n, N },
    );

    // and adjust sample size
    n = math.eval(
      'n / v',
      { n, v },
    );
  }

  // calculate z-score: http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
  const z = pnormaldist(1 - (1 - c) / 2);

  return continuity ? wilsonContinuity(p, n, z) : wilsonStandard(p, n, z);
}
