import { Program } from './program';
import { ParentNode } from './node'
import { styling } from './styling'

export class Screen extends ParentNode {
  constructor(options = {}) {
    super();
    this.options = options;
  }

  get contentWidth() {
    if (this.options.style && this.options.style.border) {
      if (this.width < 2) {
        return 0;
      } else {
        return this.width - 2;
      }
    } else {
      return this.width;
    }
  }

  get contentHeight() {
    if (this.options.style && this.options.style.border) {
      if (this.height < 2) {
        return 0;
      } else {
        return this.height - 2;
      }
    } else {
      return this.height;
    }
  }

  get contentOffsetX() {
    if (this.options.style && this.options.style.border) {
      return 1;
    } else {
      return 0;
    }
  }

  get contentOffsetY() {
    if (this.options.style && this.options.style.border) {
      return 1;
    } else {
      return 0;
    }
  }

  data(data: Buffer) {
    this.propagateEvent('data', data);
  }

  mount(program: Program, parent: ParentNode) {
    this.program = program;
    this.parent = parent;

    program.fullScreen();

    program.listenResize();

    this.render(program, parent);
  }

  render(program: Program, parent: ParentNode) {
    this.x = 0;
    this.y = 0;

    program.cursorTo(this.absX, this.absY);
    program.output.clearScreenDown();

    this.width = parent.contentWidth;
    this.height = parent.contentHeight;

    styling(this.options.style, this, program);
  }

  resize() {
    if (this.program && this.parent) {
      this.render(this.program, this.parent);

      this.children.forEach(child => {
        child.emit('resize');
      });
    }
  }

  destroy() {
    if (this.program) {
      this.program.write('\u001b[?1049l');//rmcup
    }
  }
}