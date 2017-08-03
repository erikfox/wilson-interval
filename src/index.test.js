import wilson from '.';

test('wilson(40,100)', () => {
  const result = wilson(40, 100);
  expect(result).toMatchSnapshot();
});

test('wilson(40, 100, undefined, false, true)', () => {
  const result = wilson(40, 100, undefined, false, true);
  expect(result).toMatchSnapshot();
});
