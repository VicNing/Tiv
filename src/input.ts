import { Program } from './program'
import { KEYS, bindKey } from './key';
import { Node } from './node'

interface InputOptions {
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
      this.program.cursorTo(this.x, this.y);
      this.program.clearLine(0);

      if (this.options.prompt) {
        this.program.write(this.options.prompt);
      }

      if (this.options.underLine) {
        this.program.write('\u001b[0m\u001b[4m');
      }
    }
  }

  render(program: Program) {
    this.program = program;

    this.width = program.rows;
    this.height = 1;//todo

    bindKey(KEYS.return, this);
    this.reset();

  }
}