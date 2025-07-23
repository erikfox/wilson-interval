import wilson from './index.js';
import test from 'node:test';
import assert from 'node:assert';
import { describe } from 'node:test';

describe('wilson()', () => {
  describe('handles base args', () => {
    test('wilson(5, 100)', () => {
      const result = wilson(5, 100);
      
      assert.deepEqual(result, {
        "high": "0.11175046869375655694",
        "center": "0.066647073981204927863",
        "low": "0.021543679268653298792",
      });
    });
  });

  describe('handles population arg', () => {
    test('wilson(5, 100, 227)', () => {
      const result = wilson(5, 100, 227);
      
      assert.deepEqual(result, { 
        "center": "0.062568829500944323976",
        "high": "0.10110044321850152858",
        "low": "0.024037215783387119365",
      });
    });
  });

  describe('handles precision option', () => {
    test('wilson(5, 100, false, { precision: 6 })', () => {
      const result = wilson(5, 100, false, { precision: 6 });
      
      assert.deepEqual(result, { 
        "center": "0.0666474",
        "high": "0.111751",
        "low": "0.0215437",
      });
    });
  });

  describe('handles confidence option', () => {
    test('wilson(5, 100, 227, { confidence: 0.9 })', () => {
      const result = wilson(5, 100, 227, { confidence: 0.9 });
      
      assert.deepEqual(result, {
        "center": "0.058925960344442384957",
        "high": "0.090892465800857729375",
        "low": "0.02695945488802704054",
      });
    });
  });
});
