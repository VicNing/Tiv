import { layoutAndRender } from './renderer'
import Element, { ElementOptions } from './element'

export class Container extends Element {
  children: Array<Element> = []
  rendered: boolean = false

  constructor(options: ElementOptions) {
    super(options);
    this._options = options;
  }

  appendChild(child: Element) {
    child.parent = this;
    this.children.push(child);

    if (this.rendered) {
      child._render();
    }
  }

  _render() {
    layoutAndRender(this);

    if (this.children.length > 0) {
      this.children.forEach(child => child._render());
    }
  }
}