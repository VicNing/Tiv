"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Node extends events_1.EventEmitter {
    constructor() {
        super();
        /**
         * x, y: position relative to parent node's top left content area.
         */
        this.x = 0;
        this.y = 0;
        /**
         * width, height: total width/height. Similar to "box-sizing: border-box" in CSS.
         */
        this.width = 0;
        this.height = 0;
        /**
         * keyBindings: key binding regsitry.
         */
        this.keyBindings = {};
        /**
         * options: construction options.
         */
        this.options = {};
        this.on("data", this._data);
        this.on("mount", this.mount);
        this.on("resize", this.resize);
        this.on("destroy", this._destroy);
    }
    /**
     * absX, absY: absolute position at terminal.
     */
    get absX() {
        if (!this.parent) {
            return this.x;
        }
        else {
            return this.x + this.parent.absX;
        }
    }
    get absY() {
        if (!this.parent) {
            return this.y;
        }
        else {
            return this.y + this.parent.absY;
        }
    }
    bindKey(key) {
        if (Array.isArray(key)) {
            key.forEach(k => (this.keyBindings[k] = true));
        }
        else {
            this.keyBindings[key] = true;
        }
    }
    _data(data) {
        if (data.length <= 6) {
            const keyCode = data.readIntLE(0, data.length);
            if (this.keyBindings[keyCode]) {
                this.keypress(keyCode);
            }
            else {
                this.data(data);
            }
        }
        else {
            this.data(data);
        }
    }
    data(data) { }
    keypress(key) { }
    _destroy() {
        this.destroy();
    }
}
exports.Node = Node;
class ParentNode extends Node {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    propagateEvent(eventName, data) {
        this.children.forEach(child => {
            child.emit(eventName, data);
        });
    }
    appendChild(child) {
        this.children.push(child);
        child.parent = this;
        child.emit("mount", this.program, this);
    }
    _destroy() {
        this.propagateEvent("destroy");
        this.removeAllListeners("data");
        this.removeAllListeners("renden");
        this.removeAllListeners("destroy");
        this.destroy();
    }
}
exports.ParentNode = ParentNode;
