import wilson, { normalQuantile } from './index.js';
import test from 'node:test';
import assert from 'node:assert';
import { describe } from 'node:test';
import { readFileSync } from 'node:fs';

// Expected values from an independent implementation (Python stdlib
// statistics.NormalDist); regenerate with:
//   python3 scripts/reference.py > scripts/reference.json
const reference = JSON.parse(readFileSync(new URL('../scripts/reference.json', import.meta.url), 'utf8'));

// normalQuantile() has ~1e-9 relative error, so values derived from it are
// compared with a relative tolerance. A relative check stays meaningful for
// tiny bounds (e.g. 1e-10 at n = 1e9) and still requires an exact match for 0.
function assertClose(actual, expected, label, tolerance = 1e-8) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance * Math.abs(expected),
    `${label}: expected ${expected}, got ${actual}`,
  );
}

// normalQuantile() has ~1e-9 relative error, so compare with a tolerance
function assertInterval(actual, expected, tolerance = 1e-9) {
  for (const key of ['low', 'center', 'high']) {
    assert.ok(
      Math.abs(actual[key] - expected[key]) < tolerance,
      `${key}: expected ${expected[key]}, got ${actual[key]}`,
    );
  }
  assert.ok(actual.low <= actual.center && actual.center <= actual.high, 'low <= center <= high');
}

function assertBounds({ low, center, high }, p) {
  assert.ok(0 <= low, `low ${low} < 0`);
  assert.ok(low <= p && p <= high, `p ${p} not within [${low}, ${high}]`);
  assert.ok(low <= center && center <= high, `center ${center} not within [${low}, ${high}]`);
  assert.ok(high <= 1, `high ${high} > 1`);
}

describe('wilson() reference values', () => {
  for (const { args, expected } of reference.wilson) {
    const { observed, sample, population, confidence, continuityCorrection } = args;
    const options = { confidence };
    if (population !== null) options.population = population;
    if (continuityCorrection) options.continuityCorrection = true;
    const call = `wilson(${observed}, ${sample}, ${JSON.stringify(options)})`;
    test(call, () => {
      const actual = wilson(observed, sample, options);
      for (const key of ['low', 'center', 'high']) {
        assertClose(actual[key], expected[key], `${call}.${key}`);
      }
    });
  }
});

describe('wilson() bounds', () => {
  test('observed = 0 gives low exactly 0', () => {
    assert.strictEqual(wilson(0, 1e6, { population: 1000001 }).low, 0);
    assert.strictEqual(wilson(0, 1, { population: 10, confidence: 0.99 }).low, 0);
  });

  test('observed = sample gives high exactly 1', () => {
    assert.strictEqual(wilson(100, 100, { population: 101 }).high, 1);
    assert.strictEqual(wilson(1e6, 1e6).high, 1);
    assert.strictEqual(wilson(1, 1, { confidence: 0.99 }).high, 1);
  });

  test('0 <= low <= p <= high <= 1 across a grid of inputs', () => {
    const confidences = [0.5, 0.8, 0.9, 0.95, 0.99, 0.999];
    for (let sample = 1; sample <= 120; sample++) {
      for (const population of [undefined, sample, sample + 1, sample * 2, sample * 50]) {
        for (const confidence of confidences) {
          for (let observed = 0; observed <= sample; observed++) {
            assertBounds(wilson(observed, sample, { population, confidence }), observed / sample);
          }
        }
      }
    }
  });

  test('very large sample stays within bounds', () => {
    const sample = 2 ** 53 - 1;
    assertBounds(wilson(sample - 1, sample), (sample - 1) / sample);
  });
});

describe('wilson()', () => {
  describe('handles required args', () => {
    test('good `observed` and `sample` input', () => {
      assertInterval(
        wilson(5, 100),
        {
          center: 0.06664707419314354,
          high: 0.11175046923191911,
          low: 0.02154367915436798,
        },
        1e-8,
      );
    });

    test('bad `observed` = -1 input', () => {
      assert.throws(() => wilson(-1, 100), {
        message: 'Observed must be a non-negative whole number',
      });
    });

    test('bad `sample` = 0 input', () => {
      assert.throws(() => wilson(5, 0), {
        message: 'Sample must be a positive whole number',
      });
    });

    test('bad `observed` > `sample` input', () => {
      assert.throws(() => wilson(11, 10), {
        message: 'Observed must not exceed sample',
      });
    });
  });

  describe('handles `population` option', () => {
    // Reference values from an independent Python implementation:
    // p unchanged, effective n' = n / ν², ν² = (N − n) / (N − 1).
    test('good `population` input', () => {
      assertInterval(wilson(5, 100, { population: 227 }), {
        center: 0.05950886403022134,
        high: 0.0925865290106502,
        low: 0.026431199049792478,
      });
    });

    test('`population` = `sample` + 1 with one draw is unadjusted', () => {
      // Exact finite-population factor for n = 1 is 1, so n' = n
      assertInterval(wilson(1, 1, { population: 2 }), wilson(1, 1));
    });

    test('`sample` = `population` collapses the interval to p', () => {
      assert.deepEqual(wilson(5, 100, { population: 100 }), { high: 0.05, center: 0.05, low: 0.05 });
    });

    test('very large `population` matches no population', () => {
      assertInterval(wilson(5, 100, { population: 1e12 }), wilson(5, 100));
    });

    test('bad `population` = 0 input', () => {
      assert.throws(() => wilson(5, 100, { population: 0 }), {
        message: 'Population must be a positive whole number',
      });
    });

    test('bad `sample` > `population` input', () => {
      assert.throws(() => wilson(5, 100, { population: 50 }), {
        message: 'Sample must not exceed population',
      });
    });
  });

  describe('handles `confidence` option', () => {
    test('good `confidence` input', () => {
      assertInterval(wilson(5, 100, { population: 227, confidence: 0.9 }), {
        center: 0.05673921186382623,
        high: 0.084248814348019,
        low: 0.02922960937963347,
      });
    });

    test('`confidence` very close to 1 stays finite', () => {
      const result = wilson(5, 100, { confidence: 1 - 1e-16 });
      for (const key of ['low', 'center', 'high']) {
        assert.ok(Number.isFinite(result[key]), `${key} is ${result[key]}`);
      }
      assertBounds(result, 0.05);
    });

    test('bad `confidence` = 1 input', () => {
      assert.throws(() => wilson(5, 100, { population: 227, confidence: 1 }), {
        message: 'Confidence must be a decimal between 0 and 1',
      });
    });

    test('bad `confidence` = 0 input', () => {
      assert.throws(() => wilson(5, 100, { population: 227, confidence: 0 }), {
        message: 'Confidence must be a decimal between 0 and 1',
      });
    });

    test('bad `confidence` = "0.9" (string) input', () => {
      assert.throws(() => wilson(5, 100, { confidence: '0.9' }), {
        message: 'Confidence must be a decimal between 0 and 1',
      });
    });
  });
});

describe('wilson() continuity correction', () => {
  const confidences = [0.5, 0.9, 0.95, 0.99, 0.999];

  test('contains the uncorrected interval, within bounds, across a grid', () => {
    for (let sample = 1; sample <= 80; sample++) {
      for (const population of [undefined, sample, sample + 1, sample * 2, sample * 50]) {
        for (const confidence of confidences) {
          for (let observed = 0; observed <= sample; observed++) {
            const plain = wilson(observed, sample, { population, confidence });
            const cc = wilson(observed, sample, { population, confidence, continuityCorrection: true });
            const label = `wilson(${observed}, ${sample}, ${population}, ${confidence})`;
            assert.ok(cc.low <= plain.low && plain.high <= cc.high, `${label}: CC does not contain plain`);
            assertBounds(cc, observed / sample);
          }
        }
      }
    }
  });

  test('is strictly wider than the uncorrected interval away from the bounds', () => {
    const plain = wilson(5, 100);
    const cc = wilson(5, 100, { continuityCorrection: true });
    assert.ok(cc.low < plain.low && plain.high < cc.high);
  });

  test('does not change center', () => {
    for (const options of [{}, { population: 227 }, { confidence: 0.99 }]) {
      assert.strictEqual(
        wilson(5, 100, { ...options, continuityCorrection: true }).center,
        wilson(5, 100, options).center,
      );
    }
  });

  test('keeps exact bounds at observed = 0 and observed = sample', () => {
    assert.strictEqual(wilson(0, 20, { continuityCorrection: true }).low, 0);
    assert.strictEqual(wilson(20, 20, { continuityCorrection: true }).high, 1);
  });

  test('`sample` = `population` still collapses the interval to p', () => {
    assert.deepEqual(wilson(5, 100, { population: 100, continuityCorrection: true }), {
      high: 0.05,
      center: 0.05,
      low: 0.05,
    });
  });

  test('false is the same as omitting it', () => {
    assert.deepEqual(wilson(5, 100, { continuityCorrection: false }), wilson(5, 100));
  });

  test('non-boolean values throw', () => {
    for (const continuityCorrection of [1, 'true', null]) {
      assert.throws(
        () => wilson(5, 100, { continuityCorrection }),
        {
          message: 'Continuity correction must be true or false',
        },
        `continuityCorrection = ${continuityCorrection}`,
      );
    }
  });
});

describe('wilson() options', () => {
  const MIGRATION = /^wilson\(\) takes an options object as its third argument/;

  test('omitted, undefined and empty options all use the defaults', () => {
    const expected = wilson(5, 100, { confidence: 0.95 });
    assert.deepEqual(wilson(5, 100), expected);
    assert.deepEqual(wilson(5, 100, undefined), expected);
    assert.deepEqual(wilson(5, 100, {}), expected);
    assert.deepEqual(wilson(5, 100, { population: undefined, confidence: undefined }), expected);
  });

  test('accepts an object without a prototype', () => {
    const options = Object.assign(Object.create(null), { population: 227 });
    assert.deepEqual(wilson(5, 100, options), wilson(5, 100, { population: 227 }));
  });

  test('v5 positional population (number) throws a migration error', () => {
    assert.throws(() => wilson(5, 100, 227), {
      message:
        'wilson() takes an options object as its third argument since v6. ' +
        'Replace wilson(observed, sample, population, confidence) with ' +
        'wilson(observed, sample, { population, confidence }).',
    });
  });

  test('v5 positional null population throws a migration error', () => {
    assert.throws(() => wilson(5, 100, null, 0.9), { message: MIGRATION });
    assert.throws(() => wilson(5, 100, null), { message: MIGRATION });
  });

  test('a fourth argument throws a migration error', () => {
    assert.throws(() => wilson(5, 100, undefined, 0.9), { message: MIGRATION });
    assert.throws(() => wilson(5, 100, {}, 0.9), { message: MIGRATION });
  });

  test('non-object options throw', () => {
    for (const options of ['0.9', true, [], () => {}, 0n]) {
      assert.throws(
        () => wilson(5, 100, options),
        {
          message: 'Options must be an object',
        },
        `options = ${String(options)}`,
      );
    }
  });

  test('unknown option keys throw', () => {
    assert.throws(() => wilson(5, 100, { confidnce: 0.9 }), {
      message: 'Unknown option "confidnce" (expected one of: population, confidence, continuityCorrection)',
    });
  });

  test('null population or confidence throws', () => {
    assert.throws(() => wilson(5, 100, { population: null }), {
      message: 'Population must be a positive whole number',
    });
    assert.throws(() => wilson(5, 100, { confidence: null }), {
      message: 'Confidence must be a decimal between 0 and 1',
    });
  });
});

describe('normalQuantile()', () => {
  describe('matches reference quantiles', () => {
    for (const { p, expected } of reference.normalQuantile) {
      test(`normalQuantile(${p}) ≈ ${expected}`, () => {
        assertClose(normalQuantile(p), expected, `p = ${p}`);
      });
    }

    test('is antisymmetric about 0.5', () => {
      for (const p of [1e-10, 0.001, 0.02425, 0.1, 0.3]) {
        assertClose(normalQuantile(1 - p), -normalQuantile(p), `p = ${p}`);
      }
    });
  });

  describe('handles edge cases', () => {
    test('`p` = 0 input', () => {
      const result = normalQuantile(0);
      assert.strictEqual(result, -Infinity);
    });

    test('`p` = 1 input', () => {
      const result = normalQuantile(1);
      assert.strictEqual(result, Infinity);
    });
  });

  describe('throws on invalid args', () => {
    test('bad `p` < 0 input', () => {
      assert.throws(() => normalQuantile(-1), {
        message: 'p must be a decimal between 0 and 1',
      });
    });

    test('bad `p` > 1 input', () => {
      assert.throws(() => normalQuantile(2), {
        message: 'p must be a decimal between 0 and 1',
      });
    });
  });
});
