import { isPercentage, parsePersentage } from './utils'

export interface ElementOptions {
  width: number | string, //absolute value or percentage
  height: number | string, //absolute value or percentage
  left: number | string, //absolute value, percentage, or 'center'
  top: number | string, //absolute value, percentage, or 'center'
  padding?: number,
  border?: BorderOptions,
  background?: BackgroundOptions
}

export interface BorderOptions {
  weight?: string,
  color?: string
}

export interface BackgroundOptions {
  color?: string
}

function validateElementOptions(options: ElementOptions) {
  //todo

  if (options.border) {
    validateBorderOptions(options.border);
  }

  if (options.background) {
    validateBackgroundOptions(options.background);
  }
}

function validateBorderOptions(options: BorderOptions) {
  //todo
}

function validateBackgroundOptions(options: BackgroundOptions) {
  //todo
}

function calculateWidthOrHeight(property: string, value: number | string, parent?: Element) {
  if (property !== 'width' && property !== 'height') {
    throw new Error(`Function "calculateWidthOrHeight" must have either 'width' or 'height' as it's property argument.`);
  }

  if (typeof value === 'number') {
    if(value < 0){
      throw new Error('Value should not less than 0.');
    }
    return value;
  } else if (typeof value === 'string' && isPercentage(value)) {
    if (!parent) {
      return 0;
    } else {
      return parent[property] * parsePersentage(value);
    }
  } else {
    throw new Error('Value should be a valid number or percentage string');
  }
}

function calculateLeftOrTop(property: string, value: number | string, element: Element): number {
  if (property !== 'left' && property !== 'top') {
    throw new Error(`Function "calculateLeftOrTop" must have either 'left' or 'top' as it's property argument.`);
  }

  if (typeof value === 'number') {
    return value;
  } else {
    if (!element.parent) {
      return 0;
    }

    if (isPercentage(value)) {
      if (property === 'left') {
        return element.parent.width * parsePersentage(value);
      }

      if (property === 'top') {
        return element.parent.height * parsePersentage(value);
      }
    }

    if (value === 'center') {
      if (property === 'left') {
        return element.parent.width / 2 + element.width / 2;
      }

      if (property === 'top') {
        return element.parent.height / 2 + element.height / 2;
      }
    }
  }

  throw new Error(`Could not calculate left or top because of invalid combination of arguments.`);
}

export abstract class Element {
  parent?: Element
  _options?: ElementOptions

  constructor(options: ElementOptions) {
    validateElementOptions(options);
  }

  get width(): number {
    if (!this._options) {
      return 0;
    }

    return calculateWidthOrHeight('width', this._options.width, this.parent);
  }

  get height(): number {
    if (!this._options) {
      return 0;
    }

    return calculateWidthOrHeight('height', this._options.height, this.parent);
  }

  get left(): number {
    if (!this._options) {
      return 0;
    }

    return calculateLeftOrTop('left', this._options.left, this);
  }

  get top(): number {
    if (!this._options) {
      return 0;
    }

    return calculateLeftOrTop('top', this._options.top, this);
  }

  abstract _render(): any
}