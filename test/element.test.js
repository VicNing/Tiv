const rewire = require('rewire');

const elementModule = rewire('../dist/element');
const calculateWidthOrHeight = elementModule.__get__('calculateWidthOrHeight');

test('function calculateWidthOrHeight should throw if property is not width or height', () => {
  expect(() => {
    calculateWidthOrHeight('top')
  }).toThrow();

  expect(() => {
    calculateWidthOrHeight(undefined)
  }).toThrow();
});

test('function calculateWidthOrHeight should throw if value is the wrong type or the wrong format', () => {
  expect(() => {
    calculateWidthOrHeight('width', undefined)
  }).toThrow();

  expect(() => {
    calculateWidthOrHeight('width', 'wrong format')
  }).toThrow();
});

test('function calculateWidthOrHeight should return valid result if value is number', () => {
  expect(calculateWidthOrHeight('width', 100)).toEqual(100);
  expect(calculateWidthOrHeight('height', 0)).toEqual(0);
});

test('function calculateWidthOrHeight should throw if value less than 0', () => {
  expect(() => {
    calculateWidthOrHeight('width', -1)
  }).toThrow();
  expect(() => {
    calculateWidthOrHeight('height', -2)
  }).toThrow();
});

test('function calculateWidthOrHeight should return 0 if value is percentage and no parent',()=>{
  expect(calculateWidthOrHeight('width','30%')).toEqual(0);
  expect(calculateWidthOrHeight('height','0.3%')).toEqual(0);
});
