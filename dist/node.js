"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Node extends events_1.EventEmitter {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.keyBindings = {};
        this.on('data', this._data);
        this.on('render', this.render);
        this.on('destroy', this._destroy);
    }
    bindKey(key) {
        this.keyBindings[key] = true;
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
    render(program) { }
    _destroy() {
        this.destroy();
    }
    destroy() { }
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
    appendChild(component) {
        component.parent = this;
        component.emit('render', this.program);
        this.children.push(component);
    }
    _destroy() {
        this.propagateEvent('destroy');
        this.destroy();
    }
}
exports.ParentNode = ParentNode;
