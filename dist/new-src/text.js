"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_1 = require("./element");
const renderer_1 = require("./renderer");
class Text extends element_1.default {
    constructor(options) {
        super(options);
        this._options = options;
    }
    _render() {
        renderer_1.layoutAndRender(this);
    }
}
exports.Text = Text;
