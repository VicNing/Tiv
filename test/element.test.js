const rewire = require('rewire');

const elementModule = rewire('../dist/element');
const calculateWidthOrHeight = elementModule.__get__('calculateWidthOrHeight');
const calculateLeftOrTop = elementModule.__get__('calculateLeftOrTop');
const Element = elementModule.__get__('Element');

describe('calculateWidthOrHeight and calculateLeftOrTop', () => {
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

  test('function calculateWidthOrHeight should return 0 if value is percentage and no parent', () => {
    expect(calculateWidthOrHeight('width', '30%')).toEqual(0);
    expect(calculateWidthOrHeight('height', '0.3%')).toEqual(0);
  });

  test('function calculateWidthOrHeight should return correct calculated value if value is percentage and parent provided', () => {
    const parentOptions = {
      width: 100,
      height: 100,
      left: 0,
      top: 0
    };
    const parent = new Element(parentOptions);
    parent._options = parentOptions;

    expect(calculateWidthOrHeight('width', '50%', parent)).toEqual(50);
    expect(calculateWidthOrHeight('height', '33%', parent)).toEqual(33);
  });

  test('function calculateWidthOrHeight should return correct calculated value if value is percentage and parent provided', () => {
    const parentOptions = {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    };
    const parent = new Element(parentOptions);
    parent._options = parentOptions;

    expect(calculateWidthOrHeight('width', '50%', parent)).toEqual(0);
    expect(calculateWidthOrHeight('height', '33%', parent)).toEqual(0);
  });

  test('function calculateLeftOrTop should throw if property is not left or top', () => {
    expect(() => {
      calculateLeftOrTop('sth');
    }).toThrow();
  });

  test('function calculateLeftOrTop should throw if value is the wrong type', () => {
    expect(() => {
      calculateLeftOrTop('left', undefined);
    }).toThrow();

    expect(() => {
      calculateLeftOrTop('left', 'sth');
    }).toThrow();
  });

  test('function calculateLeftOrTop should return correct result if value is number', () => {
    expect(calculateLeftOrTop('left', 123)).toEqual(123);
    expect(calculateLeftOrTop('left', 3.14)).toEqual(3);
  });

  test('function calculateLeftOrTop should throw if value less than 0', () => {
    expect(() => {
      calculateLeftOrTop('left', -1);
    }).toThrow();

    expect(() => {
      calculateLeftOrTop('top', -3.14);
    }).toThrow();
  });

  test('function calculateLeftOrTop should return 0 if value is percentage or center and parent not provided', () => {
    const options = {
      width: 0,
      height: 0,
      top: '30%',
      left: 'center'
    };
    const element = new Element(options);
    element._options = options;

    expect(calculateLeftOrTop('left', '30%', element)).toEqual(0);
    expect(calculateLeftOrTop('top', 'center', element)).toEqual(0);
  });

  test('function calculateLeftOrTop should return correct result if value is percentage or center and parent provided', () => {
    const parentOptions = {
      width: 200,
      height: 300,
      top: 1000,
      left: 300
    };
    const parent = new Element(parentOptions);
    parent._options = parentOptions;

    const options = {
      width: 100,
      height: 0,
      top: '30%',
      left: 'center'
    };
    const element = new Element(options);
    element._options = options;
    element.parent = parent;

    expect(element.left).toEqual(150);
    expect(element.top).toEqual(90);
  });
});

descirbe('element options validator', () => {
   
});