"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const key_1 = require("./key");
const screen_1 = require("./screen");
const node_1 = require("./node");
class Program extends node_1.ParentNode {
    constructor(options = {}) {
        super();
        this.input = options.input || process.stdin;
        this.output = options.output || process.stdout;
        if (!this.input.isTTY) {
            throw Error('Not in a terminal emulator.');
        }
        //todo updateWindowSize
        this.bindKey(key_1.KEYS.ctrl_c);
        this.emit('render');
    }
    get rows() {
        return this.output.rows;
    }
    get columns() {
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
    data(data) {
        this.propagateEvent('data', data);
    }
    keypress(key) {
        if (key === key_1.KEYS.ctrl_c) {
            this.emit('destroy');
        }
    }
    render() {
        this.input.setRawMode(true);
        this.input.on('data', (data) => {
            this.emit('data', data);
        });
    }
    cursorTo(x, y) {
        this.output.cursorTo(x, y);
    }
    clearLine(dir) {
        this.output.clearLine(dir);
    }
    clearArea(x, y, width, height) {
        this.cursorTo(x, y);
        for (let i = 0; i < height - 1; i++) {
            for (let j = 0; j < width - 1; j++) {
                this.write(' ');
            }
            this.cursorTo(x + 1, y);
        }
    }
    write(data) {
        this.output.write(data);
    }
    appendChild(component) {
        this.children.push(component);
        component.emit('render', this, this);
    }
    get screen() {
        if (this._screen) {
            return this._screen;
        }
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child instanceof screen_1.Screen) {
                this._screen = (this.children[i]);
                return this.screen;
            }
        }
        return null;
    }
    destroy() {
        process.exit();
    }
}
exports.Program = Program;
__export(require("./screen"));
__export(require("./input"));
