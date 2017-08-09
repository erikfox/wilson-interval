// @flow
import math from 'mathjs';
import pnormaldist from 'pnormaldist';

export default function wilson(
  observed: number,
  sample: number,
  population: ?boolean = false,
  options: { confidence?: number, precision?: number } = {}
) {
  const { confidence = 0.95, precision = 20 } = options;

  math.config({ number: 'BigNumber', precision });

  observed = math.bignumber(observed);
  sample = math.bignumber(sample);

  const proportion = math.eval('observed / sample', { observed, sample });

  if (population) {
    sample = math.eval('sample / (sqrt(1 - sample / population))', {
      sample,
      population,
    });
  }

  const zScore = pnormaldist(
    math.eval('1 - (1 - confidence) / 2', { confidence })
  );

  return wilsonInterval(proportion, sample, zScore);
}

function wilsonInterval(proportion: number, sample: number, zScore: number) {
  const scope = {
    p: math.bignumber(proportion),
    n: math.bignumber(sample),
    z: math.bignumber(zScore),
  };

  const high = math.format(
    math.eval(
      '(p + z * z / (2 * n) + z * sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n)',
      scope
    )
  );

  const low = math.format(
    math.eval(
      '(p + z * z / (2 * n) - z * sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n)',
      scope
    )
  );

  const center = math.format(
    math.eval('(p + z * z / (2 * n)) / (1 + z * z / n)', scope)
  );

  return {
    high,
    center,
    low,
  };
}
