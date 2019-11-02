import terminal from './terminal'
import Element from './element'
import { KEYS } from './keys'

export class Screen {
  _keyHandlers: { [index: number]: Array<() => void> } = {};
  rendered: boolean = false
  children: Array<Element> = []

  get width(): number {
    return this.rendered ? terminal.getWidth() : 0;
  }

  get height(): number {
    return this.rendered ? terminal.getHeight() : 0;
  }

  get left(): number {
    return 0;
  }

  get top(): number {
    return 0;
  }

  constructor(options: Object) {
    this.bindKey(KEYS.ctrl_c, () => {
      process.exit();
    });
  }

  render() {
    return this._render();
  }

  _render() {
    terminal.initialize();
    terminal.on('data', this._onData.bind(this));

    this.rendered = true;

    if (this.children.length > 0) {
      this.children.forEach(child => child._render());
    }
  }

  bindKey(key: KEYS, cb: () => void) {
    if (!this._keyHandlers[key]) {
      this._keyHandlers[key] = [];
    }

    this._keyHandlers[key].push(cb);
  }

  private _onKeyPress(data: Buffer): boolean {
    if (data.length <= 6) {
      const keyCode = data.readIntLE(0, data.length);
      if (this._keyHandlers[keyCode]) {
        this._keyHandlers[keyCode].forEach(cb => cb());
        return true;
      }
    }

    return false;
  }

  private _onData(data: Buffer) {
    if (this._onKeyPress(data)) {
      return
    }

    terminal.write(data);
  }

  appendChild(child: Element) {
    child.parent = this;
    this.children.push(child);

    if (this.rendered) {
      child._render();
    }
  }
}