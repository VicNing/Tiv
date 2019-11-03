import { Element, ElementOptions } from './element'
import { layoutAndRender } from './renderer'

export interface TextOptions extends ElementOptions {
  text?: string
}

export class Text extends Element {
  constructor(options: TextOptions) {
    super(options);
    this._options = options;
  }

  _render() {
    layoutAndRender(this);
  }
}