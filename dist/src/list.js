"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
class List extends node_1.ParentNode {
    constructor(options) {
        super();
    }
    get contentHeight() {
        return this.height;
    }
    get contentWidth() {
        return this.width;
    }
    get contentOffsetX() {
        return 0;
    }
    get contentOffsetY() {
        return 0;
    }
    mount(program, parent) {
        this.program = program;
        this.parent = parent;
        this.render(parent);
    }
    render(parent) {
        this.width = parent.contentWidth;
    }
    resize() { }
    destroy() { }
}
exports.default = List;
