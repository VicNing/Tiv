import { Program } from "./program";
import { KEYS } from "./key";
import { Node, NodeOptions, ParentNode } from "./node";
import { styling } from "./styling";

interface InputOptions extends NodeOptions {
  x?: number;
  y?: number;
  prompt?: string;
}

export class Input extends Node {
  inputValue: string = "";
  options: InputOptions;

  constructor(options: InputOptions = {}) {
    super();
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.options = options;

    this.bindKey([
      KEYS.return,
      KEYS.del,
      KEYS.up_arrow,
      KEYS.down_arrow,
      KEYS.right_arrow,
      KEYS.left_arrow
    ]);
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
      this.emit("change", this.inputValue);
      this.reset();
      return;
    }

    if (key === KEYS.del) {
      if (this.program && this.inputValue.length > 0) {
        this.program.write("\u0008"); //backspace
        this.program.write("\x1b[X"); //erase
        this.inputValue = this.inputValue.slice(0, this.inputValue.length - 1);
      }
    }
  }

  reset() {
    this.inputValue = "";

    if (this.program) {
      this.clearContent();

      this.program.cursorTo(
        this.absX + this.contentOffsetX,
        this.absY + this.contentOffsetY
      );

      if (this.options.prompt) {
        this.program.write(this.options.prompt);
      }
    }
  }

  clearContent() {
    if (this.program) {
      this.program.clearArea(
        this.absX + this.contentOffsetX,
        this.absY + this.contentOffsetY,
        this.contentWidth,
        this.contentHeight
      );
    }
  }

  mount(program: Program, parent: ParentNode) {
    this.program = program;
    this.parent = parent;

    this.render(program, parent);
  }

  render(program: Program, parent: ParentNode) {
    this.width = parent.contentWidth;
    this.height = 3; //todo

    this.x = this.options.x
      ? this.options.x + parent.contentOffsetX
      : parent.contentOffsetX;
    this.y = this.options.y
      ? this.options.y + parent.contentOffsetY
      : parent.contentOffsetY;

    program.clearArea(this.absX, this.absY, this.width, this.height);

    if (this.options.style) {
      styling(this.options.style, this, program);
    }

    this.reset();
  }

  resize() {
    if (this.program && this.parent) {
      this.render(this.program, this.parent);

      if (this.inputValue) {
        this.program.write(this.inputValue);
      }
    }
  }

  destroy() {}
}
