import { create, all } from 'mathjs';
import pnormaldist from 'pnormaldist';

export default function wilson(observed, sample, population = false, options = {}) {
  const {
    confidence = 0.95,
    precision = 20,
  } = options;

  const math = create(all, { number: 'BigNumber', precision });

  observed = math.bignumber(observed);
  sample = math.bignumber(sample);

  const proportion = math.evaluate('observed / sample', { observed, sample });

  if (population) {
    sample = math.evaluate('sample / (sqrt(1 - sample / population))', { sample, population });
  }

  const zScore = pnormaldist(math.evaluate('1 - (1 - confidence) / 2', { confidence }));

  const scope = {
    p: math.bignumber(proportion),
    n: math.bignumber(sample),
    z: math.bignumber(zScore),
  };

  const high = math.format(math.evaluate(
    '(p + z * z / (2 * n) + z * sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n)',
    scope,
  ));

  const low = math.format(math.evaluate(
    '(p + z * z / (2 * n) - z * sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n)',
    scope,
  ));

  const center = math.format(math.evaluate(
    '(p + z * z / (2 * n)) / (1 + z * z / n)',
    scope,
  ));

  return {
    high,
    center,
    low,
  };
}
