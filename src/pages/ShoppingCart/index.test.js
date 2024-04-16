/** @format */

// main.js

const { sum, difference } = require('./one');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
test('adds 1 + 2 to equal 3', () => {
  expect(difference(1, 2)).toBe(-1);
});
