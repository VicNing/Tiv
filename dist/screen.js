"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terminal_1 = require("./terminal");
const element_1 = require("./element");
const keys_1 = require("./keys");
class Screen extends element_1.Element {
    constructor(options) {
        super();
        this._keyHandlers = {};
        this.rendered = false;
        this.children = [];
        this.bindKey(keys_1.KEYS.ctrl_c, () => {
            process.exit();
        });
    }
    get width() {
        return this.rendered ? terminal_1.default.getWidth() : 0;
    }
    get height() {
        return this.rendered ? terminal_1.default.getHeight() : 0;
    }
    get left() {
        return 0;
    }
    get top() {
        return 0;
    }
    render() {
        return this._render();
    }
    _render() {
        terminal_1.default.initialize();
        terminal_1.default.on('data', this._onData.bind(this));
        this.rendered = true;
        if (this.children.length > 0) {
            this.children.forEach(child => child._render());
        }
    }
    bindKey(key, cb) {
        if (!this._keyHandlers[key]) {
            this._keyHandlers[key] = [];
        }
        this._keyHandlers[key].push(cb);
    }
    _onKeyPress(data) {
        if (data.length <= 6) {
            const keyCode = data.readIntLE(0, data.length);
            if (this._keyHandlers[keyCode]) {
                this._keyHandlers[keyCode].forEach(cb => cb());
                return true;
            }
        }
        return false;
    }
    _onData(data) {
        if (this._onKeyPress(data)) {
            return;
        }
        terminal_1.default.write(data);
    }
    appendChild(child) {
        child.parent = this;
        this.children.push(child);
        if (this.rendered) {
            child._render();
        }
    }
}
exports.Screen = Screen;
