import { Program } from './program'
import { KEYS } from './key';
import { Node, NodeOptions, ParentNode } from './node'
import { styling } from './styling';

interface InputOptions extends NodeOptions {
  x?: number,
  y?: number,
  prompt?: string,
  underLine?: boolean
}

export class Input extends Node {
  inputValue: string = '';
  options: InputOptions;

  constructor(options: InputOptions = {}) {
    super();
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.options = options;

    this.bindKey(KEYS.return);
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
    if (this.program) {
      this.program.write(data);
      this.inputValue += data.toString();
    }
  }

  keypress(key: number) {
    if (key === KEYS.return) {
      this.emit('change', this.inputValue);
      this.reset();
    }

  }

  reset() {
    this.inputValue = '';

    if (this.program) {
      this.program.cursorTo(this.absX() + this.contentOffsetX, this.absY() + this.contentOffsetY);

      if (this.options.prompt) {
        this.program.write(this.options.prompt);
      }

      //todo underline
      // if (this.options.underLine) {
      //   this.program.write('\u001b[0m\u001b[4m');
      // }
    }
  }

  render(program: Program, parent: ParentNode) {
    this.program = program;
    this.parent = parent;

    this.width = parent.contentWidth;
    this.height = 3;//todo

    const parentContentX = parent.x + parent.contentOffsetX,
      parentContentY = parent.y + parent.contentOffsetY;

    this.x = this.options.x ? this.options.x + parentContentX : parentContentX;
    this.y = this.options.y ? this.options.y + parentContentX : parentContentY;

    this.program.clearArea(this.absX(), this.absY(), this.width, this.height);

    if (this.options.style) {
      styling(this.options.style, this, program);
    }

    this.bindKey(KEYS.return);
    this.reset();
  }

  destroy() { }
}