// Type-checked, never run: npm run test:types
// Imports by package name so the "types" condition in package.json exports is exercised.
import wilson, { normalQuantile } from 'wilson-interval';
import type { WilsonInterval, WilsonOptions } from 'wilson-interval';

// Valid calls
const plain: WilsonInterval = wilson(5, 100);
const withOptions: WilsonInterval = wilson(5, 100, {
  population: 227,
  confidence: 0.9,
  continuityCorrection: true,
});
wilson(5, 100, {});
wilson(5, 100, undefined);
// undefined is accepted at runtime, so it type-checks even with exactOptionalPropertyTypes
wilson(5, 100, { population: undefined, confidence: undefined, continuityCorrection: undefined });

const options: WilsonOptions = { confidence: 0.99 };
wilson(5, 100, options);

// Result shape
const low: number = plain.low;
const center: number = withOptions.center;
const high: number = plain.high;
const z: number = normalQuantile(0.975);
void [low, center, high, z];

// Invalid calls
// @ts-expect-error v5 positional population was removed in v6
wilson(5, 100, 227);
// @ts-expect-error v5 positional confidence was removed in v6
wilson(5, 100, undefined, 0.9);
// @ts-expect-error null is rejected at runtime
wilson(5, 100, null);
// @ts-expect-error null population is rejected at runtime
wilson(5, 100, { population: null });
// @ts-expect-error unknown option
wilson(5, 100, { confidnce: 0.9 });
// @ts-expect-error continuityCorrection must be a boolean
wilson(5, 100, { continuityCorrection: 1 });
// @ts-expect-error confidence must be a number
wilson(5, 100, { confidence: '0.9' });
// @ts-expect-error observed and sample are required
wilson(5);
// @ts-expect-error no such property on the result
plain.mid;
