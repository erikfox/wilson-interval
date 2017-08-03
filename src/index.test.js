import wilson, {
  isNonNegativeInteger,
  isValidOptions,
  getPopulationScaleFactor,
} from '.';

describe('getPopulationScaleFactor()', () => {
  test('getPopulationScaleFactor(100, 227)', () => {
    expect(getPopulationScaleFactor(100, 227)).toMatchSnapshot();
  });
});

describe('isNonNegativeInteger()', () => {
  describe('returns false', () => {
    test('undefined', () => {
      expect(isNonNegativeInteger(undefined)).toEqual(false);
    });

    test('false', () => {
      expect(isNonNegativeInteger(false)).toEqual(false);
    });

    test('null', () => {
      expect(isNonNegativeInteger(null)).toEqual(false);
    });

    test('""', () => {
      expect(isNonNegativeInteger('')).toEqual(false);
    });

    test('"1"', () => {
      expect(isNonNegativeInteger('1')).toEqual(false);
    });

    test('-1', () => {
      expect(isNonNegativeInteger(-1)).toEqual(false);
    });

    test('1.0', () => {
      expect(isNonNegativeInteger(1.1)).toEqual(false);
    });
  });

  describe('returns true', () => {
    test('0', () => {
      expect(isNonNegativeInteger(0)).toEqual(true);
    });

    test('1', () => {
      expect(isNonNegativeInteger(1)).toEqual(true);
    });
  });
});

describe('isValidOptions()', () => {
  describe('returns false', () => {
    describe('when isValidOptions(options)', () => {
      test('false', () => {
        expect(isValidOptions(false)).toEqual(false);
      });
    });
  });

  describe('returns true', () => {
    test('{ continuity: true }', () => {
      expect(isValidOptions({ continuity: true })).toEqual(true);
    });
  });
});

describe('wilson()', () => {
  describe('throws Error', () => {
    describe('when wilson(observed, ...) is invalid', () => {
      test('= undefined', () => {
        expect(() => wilson(undefined, 100))
          .toThrowErrorMatchingSnapshot();
      });

      test('greater than wilson(..., sample)', () => {
        expect(() => wilson(2, 1))
          .toThrowErrorMatchingSnapshot();
      });
    });

    describe('when wilson(..., sample) is invalid', () => {
      test('= undefined', () => {
        expect(() => wilson(1, undefined))
          .toThrowErrorMatchingSnapshot();
      });
    });

    describe('when wilson(..., options) is invalid', () => {}); // TODO
  });
});

describe('Accurate results', () => {
  test('wilson(1, 1)', () => {
    const result = wilson(1, 1);
    expect(result).toMatchSnapshot();
  });

  test('wilson(40, 100)', () => {
    const result = wilson(40, 100);
    expect(result).toMatchSnapshot();
  });

  test('wilson(40, 100, { continuity: true })', () => {
    const result = wilson(40, 100, { continuity: true });
    expect(result).toMatchSnapshot();
  });

  test('wilson(1, 1, { continuity: true })', () => {
    const result = wilson(1, 1, { continuity: true });
    expect(result).toMatchSnapshot();
  });
});
