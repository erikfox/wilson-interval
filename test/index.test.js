import wilson from '../index.js';

function sortEntries(result) {
  const parsed = Object.entries(result).sort((a, b) => a[0] - b[0]);
  return Object.fromEntries(parsed);
}

describe('wilson()', () => {
  describe('returns accurate results', () => {
    test('wilson(5, 100)', () => {
      const result = wilson(5, 100);
      expect(sortEntries(result)).toMatchSnapshot();
    });

    test('wilson(5, 100, 227)', () => {
      const result = wilson(5, 100, 227);
      expect(sortEntries(result)).toMatchSnapshot();
    });
  });

  describe('accepts options', () => {
    test('wilson(5, 100, false, { precision: 6 })', () => {
      const result = wilson(5, 100, false, { precision: 6 });
      expect(sortEntries(result)).toMatchSnapshot();
    });

    test('wilson(5, 100, 227, { confidence: 0.9 })', () => {
      const result = wilson(5, 100, 227, { confidence: 0.9 });
      expect(sortEntries(result)).toMatchSnapshot();
    });
  });
});
