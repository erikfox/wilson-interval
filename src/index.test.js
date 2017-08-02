import wilson from '.';

test('wilson(40,100)', () => {
  const result = wilson(40, 100);
  expect(result).toMatchSnapshot();
});
