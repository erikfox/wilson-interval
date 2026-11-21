import wilson, { normalQuantile } from './index.js';
import test from 'node:test';
import assert from 'node:assert';
import { describe } from 'node:test';
import { readFileSync } from 'node:fs';

// Expected values from an independent implementation (Python stdlib
// statistics.NormalDist); regenerate with:
//   python3 scripts/reference.py > scripts/reference.json
const reference = JSON.parse(
  readFileSync(new URL('../scripts/reference.json', import.meta.url), 'utf8')
);

// normalQuantile() has ~1e-9 relative error, so values derived from it are
// compared with a relative tolerance. A relative check stays meaningful for
// tiny bounds (e.g. 1e-10 at n = 1e9) and still requires an exact match for 0.
function assertClose(actual, expected, label, tolerance = 1e-8) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance * Math.abs(expected),
    `${label}: expected ${expected}, got ${actual}`
  );
}

// normalQuantile() has ~1e-9 relative error, so compare with a tolerance
function assertInterval(actual, expected, tolerance = 1e-9) {
  for (const key of ['low', 'center', 'high']) {
    assert.ok(
      Math.abs(actual[key] - expected[key]) < tolerance,
      `${key}: expected ${expected[key]}, got ${actual[key]}`
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
    const { observed, sample, population, confidence } = args;
    const call = `wilson(${observed}, ${sample}, ${population}, ${confidence})`;
    test(call, () => {
      const actual = wilson(observed, sample, population, confidence);
      for (const key of ['low', 'center', 'high']) {
        assertClose(actual[key], expected[key], `${call}.${key}`);
      }
    });
  }
});

describe('wilson() bounds', () => {
  test('observed = 0 gives low exactly 0', () => {
    assert.strictEqual(wilson(0, 1e6, 1000001).low, 0);
    assert.strictEqual(wilson(0, 1, 10, 0.99).low, 0);
  });

  test('observed = sample gives high exactly 1', () => {
    assert.strictEqual(wilson(100, 100, 101).high, 1);
    assert.strictEqual(wilson(1e6, 1e6).high, 1);
    assert.strictEqual(wilson(1, 1, null, 0.99).high, 1);
  });

  test('0 <= low <= p <= high <= 1 across a grid of inputs', () => {
    const confidences = [0.5, 0.8, 0.9, 0.95, 0.99, 0.999];
    for (let sample = 1; sample <= 120; sample++) {
      for (const population of [null, sample, sample + 1, sample * 2, sample * 50]) {
        for (const confidence of confidences) {
          for (let observed = 0; observed <= sample; observed++) {
            assertBounds(wilson(observed, sample, population, confidence), observed / sample);
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
      assertInterval(wilson(5, 100), {
        center: 0.06664707419314354,
        high: 0.11175046923191911,
        low: 0.02154367915436798
      }, 1e-8);
    });

    test('bad `observed` = -1 input', () => {
      assert.throws(() => wilson(-1, 100), {
        message: 'Observed must be a non-negative whole number'
      });
    });

    test('bad `sample` = 0 input', () => {
      assert.throws(() => wilson(5, 0), {
        message: 'Sample must be a positive whole number'
      });
    });

    test('bad `observed` > `sample` input', () => {
      assert.throws(() => wilson(11, 10), {
        message: 'Observed must not exceed sample'
      });
    });
  });

  describe('handles `population` arg', () => {
    // Reference values from an independent Python implementation:
    // p unchanged, effective n' = n / ν², ν² = (N − n) / (N − 1).
    test('good `population` input', () => {
      assertInterval(wilson(5, 100, 227), {
        center: 0.05950886403022134,
        high: 0.0925865290106502,
        low: 0.026431199049792478
      });
    });

    test('`population` = `sample` + 1 with one draw is unadjusted', () => {
      // Exact finite-population factor for n = 1 is 1, so n' = n
      assertInterval(wilson(1, 1, 2), wilson(1, 1));
    });

    test('`sample` = `population` collapses the interval to p', () => {
      assert.deepEqual(wilson(5, 100, 100), { high: 0.05, center: 0.05, low: 0.05 });
    });

    test('very large `population` matches no population', () => {
      assertInterval(wilson(5, 100, 1e12), wilson(5, 100));
    });

    test('bad `population` = 0 input', () => {
      assert.throws(() => wilson(5, 100, 0), {
        message: 'Population must be a positive whole number'
      });
    });

    test('bad `sample` > `population` input', () => {
      assert.throws(() => wilson(5, 100, 50), {
        message: 'Sample must not exceed population'
      });
    });
  });

  describe('handles `confidence` arg', () => {
    test('good `confidence` input', () => {
      assertInterval(wilson(5, 100, 227, 0.9), {
        center: 0.05673921186382623,
        high: 0.084248814348019,
        low: 0.02922960937963347
      });
    });

    test('`confidence` very close to 1 stays finite', () => {
      const result = wilson(5, 100, null, 1 - 1e-16);
      for (const key of ['low', 'center', 'high']) {
        assert.ok(Number.isFinite(result[key]), `${key} is ${result[key]}`);
      }
      assertBounds(result, 0.05);
    });

    test('bad `confidence` = 1 input', () => {
      assert.throws(() => wilson(5, 100, 227, 1), {
        message: 'Confidence must be a decimal between 0 and 1'
      });
    });

    test('bad `confidence` = 0 input', () => {
      assert.throws(() => wilson(5, 100, 227, 0), {
        message: 'Confidence must be a decimal between 0 and 1'
      });
    });

    test('bad `confidence` = "0.9" (string) input', () => {
      assert.throws(() => wilson(5, 100, null, '0.9'), {
        message: 'Confidence must be a decimal between 0 and 1'
      });
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
        message: 'p must be a decimal between 0 and 1'
      });
    });

    test('bad `p` > 1 input', () => {
      assert.throws(() => normalQuantile(2), {
        message: 'p must be a decimal between 0 and 1'
      });
    });
  });
});