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
        this.input.resume();
        this.input.on('data', (data) => {
            this.emit('data', data);
        });
    }
    cursorTo(x, y) {
        this.output.cursorTo(x, y);
        if (this.screen) {
            this.screen.cursorX = x;
            this.screen.cursorY = y;
        }
    }
    clearLine(dir) {
        this.output.clearLine(dir);
    }
    write(data) {
        this.output.write(data);
    }
    appendChild(component) {
        component.emit('render', this);
        this.children.push(component);
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
