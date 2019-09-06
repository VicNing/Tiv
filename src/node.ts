import { EventEmitter } from "events";
import { Program } from './program'
import { KEYS } from "./key";
import { StyleOptions } from './styling'

export interface NodeOptions {
  style?: StyleOptions
};

export abstract class Node extends EventEmitter {
  /**
   * x, y: position relative to parent node's top left content area.
   */
  x: number = 0;
  y: number = 0;

  /**
   * width, height: total width/height. Similar to "box-sizing: border-box" in CSS.
   */
  width: number = 0;
  height: number = 0;

  /**
   * program: Program instance. Usually Intialized at render callback.
   */
  program: Program | undefined;

  /**
   * parent: parent node attatched to. Usually Intialized at render callback.
   */
  parent: ParentNode | undefined;

  /**
   * keyBindings: key binding regsitry.
   */
  keyBindings: { [index: number]: boolean } = {};

  /**
   * options: construction options.
   */
  options: NodeOptions = {}

  constructor() {
    super();

    this.on('data', this._data);
    this.on('mount', this.mount);
    this.on('resize', this.resize);
    this.on('destroy', this._destroy);
  }

  /**
   * contentWidth, contentHeight: getter, return content width/height.
   */
  abstract get contentWidth(): number;
  abstract get contentHeight(): number;

  /**
   * contentOffsetX, contentOffsetY: content top left position offset relative to 
   * this.x, this.y.
   */
  abstract get contentOffsetX(): number;
  abstract get contentOffsetY(): number;

  /**
   * absX, absY: absolute position at terminal.
   */
  get absX(): number {
    if (!this.parent) {
      return this.x;
    } else {
      return this.x + this.parent.absX;
    }
  }
  get absY(): number {
    if (!this.parent) {
      return this.y;
    } else {
      return this.y + this.parent.absY;
    }
  }

  bindKey(key: KEYS | KEYS[]): void {
    if (Array.isArray(key)) {
      key.forEach(k => this.keyBindings[k] = true);
    } else {
      this.keyBindings[key] = true;
    }
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

  abstract resize(): void;

  abstract mount(program: Program, parent: ParentNode): void;

  abstract render(program: Program, parent: ParentNode): void;

  _destroy() {
    this.destroy();
  }

  abstract destroy(): void;
}

export abstract class ParentNode extends Node {
  children: Node[] = [];

  propagateEvent(eventName: string, data?: any) {
    this.children.forEach(child => {
      child.emit(eventName, data);
    });
  }

  appendChild(child: any) {
    this.children.push(child);
    child.parent = this;
    child.emit('mount', this.program, this);
  }

  _destroy() {
    this.propagateEvent('destroy');

    this.removeAllListeners('data');
    this.removeAllListeners('renden');
    this.removeAllListeners('destroy');

    this.destroy();
  }
}