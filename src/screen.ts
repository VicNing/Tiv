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

  render(program: Program, parent: ParentNode) {
    this.program = program;

    this.x = 0;
    this.y = 0;

    this.width = parent.contentWidth;
    this.height = parent.contentHeight;

    program.write('\u001b[?1049h');//smcup
    program.cursorTo(this.absX(), this.absY());
    program.output.clearScreenDown();

    styling(this.options.style, this, program);

  }

  destroy() {
    if (this.program) {
      this.program.write('\u001b[?1049l');//rmcup
    }
  }
}