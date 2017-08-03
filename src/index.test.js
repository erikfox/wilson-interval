import wilson from '.';

describe('wilson()', () => {
  describe('returns accurate results', () => {
    test('wilson(5, 100)', () => {
      const result = wilson(5, 100);
      expect(result).toMatchSnapshot();
    });

    test('wilson(5, 100, 227)', () => {
      const result = wilson(5, 100, 227);
      expect(result).toMatchSnapshot();
    });
  });

  describe('accepts options', () => {
    test('wilson(5, 100, false, { precision: 6 })', () => {
      const result = wilson(5, 100, false, { precision: 6 });
      expect(result).toMatchSnapshot();
    });

    test('wilson(5, 100, 227, { confidence: 0.9 })', () => {
      const result = wilson(5, 100, 227, { confidence: 0.9 });
      expect(result).toMatchSnapshot();
    });
  });
});
