import { KEYS } from './key'
import { Screen } from './screen'
import * as tty from 'tty'
import { ParentNode } from './node'

export class Program extends ParentNode {
  input: tty.ReadStream;
  output: tty.WriteStream;
  _screen: Screen | undefined;

  constructor(options: any = {}) {
    super();

    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;


    if (!this.input.isTTY) {
      throw Error('Not in a terminal emulator.');
    }

    //todo updateWindowSize

    this.bindKey(KEYS.ctrl_c);
    this.emit('render');
  }

  get rows(): number {
    return this.output.rows;
  }

  get columns(): number {
    return this.output.columns;
  }

  get contentOffsetX() {
    return 0;
  }

  get contentOffsetY() {
    return 0;
  }

  get contentWidth() {
    return this.columns;
  }

  get contentHeight() {
    return this.rows;
  }

  data(data: Buffer) {
    this.propagateEvent('data', data);
  }

  keypress(key: number) {
    if (key === KEYS.ctrl_c) {
      this.emit('destroy');
    }
  }

  render() {
    this.input.setRawMode(true);
    this.input.on('data', (data: Buffer) => {
      this.emit('data', data);
    });
  }

  cursorTo(x: number, y: number) {
    this.output.cursorTo(x, y);
  }

  clearLine(dir: tty.Direction) {
    this.output.clearLine(dir);
  }

  clearArea(x: number, y: number, width: number, height: number) {
    this.cursorTo(x, y);
    for (let i = 0; i < height - 1; i++) {
      for (let j = 0; j < width - 1; j++) {
        this.write(' ');
      }
      this.cursorTo(x + 1, y);
    }
  }

  write(data: Buffer | string) {
    this.output.write(data);
  }

  appendChild(component: any) {
    this.children.push(component);
    component.emit('render', this, this);
  }

  get screen(): Screen | null {
    if (this._screen) {
      return this._screen;
    }

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];

      if (child instanceof Screen) {
        this._screen = (this.children[i]) as Screen;
        return this.screen;
      }
    }
    return null;
  }

  destroy() {
    process.exit();
  }
}

export * from './screen'
export * from './input'