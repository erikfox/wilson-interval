import math from 'mathjs';
import pnormaldist from 'pnormaldist';

export function isNonNegativeInteger(input) {
  if (typeof input !== 'number') return false;
  if (isNaN(input)) return false;
  if (Math.sign(input) === -1) return false;
  if (!math.isInteger(input)) return false;
  return true;
}

export function isValidOptions(options) {
  if (typeof options !== 'object') return false;
  return true;
}

export function getPopulationScaleFactor(sample, population) {
  return math.eval(
    'sqrt(1 - sample / population)',
    { sample, population },
  );
}

/*
 * credit: Sean Wallis, Survey of English Usage, University College of London
 * source: https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/
 */
export default function (observed, sample, options = {}) {
  if (!isNonNegativeInteger(observed)) throw new Error('Argument "observed" must be a non-negative whole number');
  if (!isNonNegativeInteger(sample)) throw new Error('Argument "sample" must be a non-negative whole number');
  if (observed > sample) throw new Error('Argument "observed" cannot be greater than "sample"');

  // if (options && !isValidOptions(options)) throw new Error('Options not valid');

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
  population = population ? math.bignmbuer(population) : population;

  // proportion of positive outcomes
  const proportion = math.eval(
    'observed / sample',
    { observed, sample },
  );

  // if population size given
  if (population) {
    sample /= getPopulationScaleFactor(sample, population);
  }

  // calculate z-score: http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
  const zScore = pnormaldist(1 - (1 - confidence) / 2);

  return continuity ? wilsonContinuity(proportion, sample, zScore) : wilsonStandard(proportion, sample, zScore);
}

function wilsonStandard(proportion, sample, zScore) {
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

function wilsonContinuity(proportion, sample, zScore) {
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
