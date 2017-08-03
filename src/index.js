import math from 'mathjs';
import pnormaldist from 'pnormaldist';

// Standard Wilson score interval
export function wilsonStandard(proportion, sample, zScore) {
  const scope = {
    p: math.bignumber(proportion),
    n: math.bignumber(sample),
    z: math.bignumber(zScore),
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
export function wilsonContinuity(proportion, sample, zScore) {
  const scope = {
    p: math.bignumber(proportion),
    n: math.bignumber(sample),
    z: math.bignumber(zScore),
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
export default function (observed, sample, options = {}) {
  const {
    precision = 20,
    continuity = false,
  } = options;

  math.config({
    number: 'BigNumber',
    precision,
  });

  let {
    confidence = 0.95,
    population = false,
  } = options;

  observed = math.bignumber(observed);
  sample = math.bignumber(sample);
  confidence = math.bignumber(confidence);
  population = population ? math.bignumber(population) : population;

  // proportion of positive outcomes
  const proportion = math.eval(
    'observed / sample',
    { observed, sample },
  );

  // if population size given
  if (population) {
    // determine scale factor
    const factor = math.eval(
      'sqrt(1 - sample / population)',
      { sample, population },
    );

    // and adjust sample size
    sample = math.eval(
      'sample / factor',
      { sample, factor },
    );
  }

  // calculate z-score: http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
  const zScore = pnormaldist(1 - (1 - confidence) / 2);

  return continuity ? wilsonContinuity(proportion, sample, zScore) : wilsonStandard(proportion, sample, zScore);
}
