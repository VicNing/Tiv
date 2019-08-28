import { EventEmitter } from "events";
import { Program } from './program'
import { KEYS } from "./key";

export class Node extends EventEmitter {
  x: number = 0;
  y: number = 0;
  width: number | undefined;
  height: number | undefined;
  program: Program | undefined;
  parent: Node | undefined;
  keyBindings: { [index: number]: boolean } = {};

  constructor() {
    super();

    this.on('data', this._data);
    this.on('render', this.render);
    this.on('destroy', this._destroy);
  }

  bindKey(key: KEYS) {
    this.keyBindings[key] = true;
  }

  _data(data: Buffer) {
    if (data.length <= 6) {
      const keyCode = data.readIntLE(0, data.length);

      if (this.keyBindings[keyCode]) {
        this.keypress(keyCode);
      }
      else {
        this.data(data);
      }
    } else {
      this.data(data);
    }

  }

  data(data: Buffer) { }

  keypress(key: number) { }

  render(program: Program | undefined) { }

  _destroy() {
    this.destroy();
  }

  destroy() { }
}

export class ParentNode extends Node {
  children: Node[] = [];

  propagateEvent(eventName: string, data?: any) {
    this.children.forEach(child => {
      child.emit(eventName, data);
    });
  }

  appendChild(component: any) {
    component.parent = this;
    component.emit('render', this.program);
    this.children.push(component);
  }

  _destroy() {
    this.propagateEvent('destroy');
    this.destroy();
  }
}