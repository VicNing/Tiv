const { isPercentage, parsePersentage } = require('../dist/utils');

test(`"50.1%" is percentage`, () => {
  expect(isPercentage('50.1%')).toBe(true);
});

test(`"1%" is percentage`, () => {
  expect(isPercentage('1%')).toBe(true);
});

test(`"0.314%" is percentage`, () => {
  expect(isPercentage('0.314%')).toBe(true);
});

test(`"1" is not percentage`, () => {
  expect(isPercentage('1')).toBe(false);
});

test(`1 is not percentage`, () => {
  expect(isPercentage(1)).toBe(false);
});

test(`"100%" can be parsed by parsePercentage`, () => {
  expect(parsePersentage('100%')).toBe(1);
});

test(`"3.1%" can be parsed by parsePercentage`, () => {
  expect(parsePersentage('3.1%')).toBe(3.1 / 100);
});

test(`"3.1" can not be parsed by parsePercentage`, () => {
  expect(() => {
    parsePersentage('3.1')
  }).toThrow();
});

test(`3.1 can not be parsed by parsePercentage`, () => {
  expect(() => {
    parsePersentage(3.1)
  }).toThrow();
});

test(`"3..1%" can not be parsed by parsePercentage`, () => {
  expect(() => {
    parsePersentage("3..1%")
  }).toThrow();
});