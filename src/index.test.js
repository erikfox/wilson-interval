import wilson, { normalQuantile } from './index.js';
import test from 'node:test';
import assert from 'node:assert';
import { describe } from 'node:test';

describe('wilson()', () => {
  describe('handles base args', () => {
    test('wilson(5, 100)', () => {
      const result = wilson(5, 100);
      
      assert.deepEqual(result, {
        center: 0.06664707421899263,
        high: 0.11175046929755608,
        low: 0.02154367914042918
      });
    });

    test('wilson(-1, 100)', () => {
      assert.throws(() => wilson(-1, 100), {
        message: 'Observed must be a non-negative whole number'
      });
    });

    test('wilson(5, 0)', () => {
      assert.throws(() => wilson(5, 0), {
        message: 'Sample must be a positive whole number'
      });
    });
  });

  describe('handles population arg', () => {
    test('wilson(5, 100, 227)', () => {
      const result = wilson(5, 100, 227);
      
      assert.deepEqual(result, { 
        center: 0.050319696641804315,
        high: 0.08456089359579015,
        low: 0.016078499687818482
      });
    });

    test('wilson(5, 100, 0)', () => {
      assert.throws(() => wilson(5, 100, 0), {
        message: 'Population must be a positive whole number'
      });
    });
  });

  describe('handles confidence arg', () => {
    test('wilson(5, 100, 227, 0.9)', () => {
      const result = wilson(5, 100, 227, 0.9);
      
      assert.deepEqual(result, {
        center: 0.04657481789797846,
        high: 0.0748286439672683,
        low: 0.018320991828688626
      });
    });

    test('wilson(5, 100, 227, 1)', () => {
      assert.throws(() => wilson(5, 100, 227, 1), {
        message: 'Confidence must be a decimal between 0 and 1'
      });
    });
  });
});

describe('normalQuantile()', () => {
  describe('handles base args', () => {
    test('normalQuantile(0.95)', () => {
      const result = normalQuantile(0.95);
      assert.strictEqual(result, 1.644853625133699);
    });

    test('normalQuantile(0.01)', () => {
      const result = normalQuantile(0.01);
      assert.strictEqual(result, -2.326347874388028);
    });

    test('normalQuantile(0.99)', () => {
      const result = normalQuantile(0.99);
      assert.strictEqual(result, 2.326347874388028);
    });
  });

  describe('handles edge cases', () => {
    test('normalQuantile(0)', () => {
      const result = normalQuantile(0);
      assert.strictEqual(result, -Infinity);
    });

    test('normalQuantile(1)', () => {
      const result = normalQuantile(1);
      assert.strictEqual(result, Infinity);
    });
  });

  describe('throws on invalid args', () => {
    test('normalQuantile(-1)', () => {
      assert.throws(() => normalQuantile(-1), {
        message: 'The probability p must be between 0 and 1'
      });
    });

    test('normalQuantile(2)', () => {
      assert.throws(() => normalQuantile(2), {
        message: 'The probability p must be between 0 and 1'
      });
    });
  });
});