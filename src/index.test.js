import wilson, { normalQuantile } from './index.js';
import test from 'node:test';
import assert from 'node:assert';
import { describe } from 'node:test';

describe('wilson()', () => {
  describe('handles required args', () => {
    test('good `observed` and `sample` input', () => {
      const result = wilson(5, 100);
      
      assert.deepEqual(result, {
        center: 0.06664707421899263,
        high: 0.11175046929755608,
        low: 0.02154367914042918
      });
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
  });

  describe('handles `population` arg', () => {
    test('good `population` input', () => {
      const result = wilson(5, 100, 227);
      
      assert.deepEqual(result, { 
        center: 0.050319696641804315,
        high: 0.08456089359579015,
        low: 0.016078499687818482
      });
    });

    test('bad `population` = 0 input', () => {
      assert.throws(() => wilson(5, 100, 0), {
        message: 'Population must be a positive whole number'
      });
    });
  });

  describe('handles `confidence` arg', () => {
    test('good `confidence` input', () => {
      const result = wilson(5, 100, 227, 0.9);
      
      assert.deepEqual(result, {
        center: 0.04657481789797846,
        high: 0.0748286439672683,
        low: 0.018320991828688626
      });
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
  });
});

describe('normalQuantile()', () => {
  describe('handles basic usage', () => {
    test('good `p` input', () => {
      const result = normalQuantile(0.95);
      assert.strictEqual(result, 1.644853625133699);
    });

    test('low `p` input', () => {
      const result = normalQuantile(0.01);
      assert.strictEqual(result, -2.326347874388028);
    });

    test('high `p` input', () => {
      const result = normalQuantile(0.99);
      assert.strictEqual(result, 2.326347874388028);
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