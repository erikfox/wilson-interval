import { create, all, ConfigOptions, BigNumber } from 'mathjs';
import pnormaldist from 'pnormaldist';

type UserOptions = {
  confidence?: number,
  precision?: number,
} | undefined;

export default function wilson(
  observed: BigNumber,
  sample: BigNumber,
  population: boolean = false,
  options: UserOptions
) {
  const confidence = options?.confidence ?? 0.95;
  const precision = options?.precision ?? 20;

  const config: ConfigOptions = {
    number: 'BigNumber',
    precision,
  };

  const math = create(all, config);

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
    center,
    high,
    low,
  };
}
