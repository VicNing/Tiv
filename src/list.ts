import { Node, ParentNode, NodeOptions } from './node'
import { Program } from './program';

interface ListOptions extends NodeOptions { }

export default class List extends ParentNode {
  constructor(options: ListOptions) {
    super();
  }

  get contentHeight() {
    return this.height;
  }

  get contentWidth() {
    return this.width;
  }

  get contentOffsetX() {
    return 0;
  }

  get contentOffsetY() {
    return 0;
  }

  mount(program: Program, parent: ParentNode) {
    this.program = program;
    this.parent = parent;

    this.render(parent);
  }

  render(parent: ParentNode) {
    this.width = parent.contentWidth;
  }

  resize() { }

  destroy() { }
}