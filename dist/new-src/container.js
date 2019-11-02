"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderer_1 = require("./renderer");
const element_1 = require("./element");
class Container extends element_1.default {
    constructor(options) {
        super(options);
        this.children = [];
        this.rendered = false;
        this._options = options;
    }
    appendChild(child) {
        child.parent = this;
        this.children.push(child);
        if (this.rendered) {
            child._render();
        }
    }
    _render() {
        renderer_1.layoutAndRender(this);
        if (this.children.length > 0) {
            this.children.forEach(child => child._render());
        }
    }
}
exports.Container = Container;
