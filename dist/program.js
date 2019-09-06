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
        this.bindKey(key_1.KEYS.ctrl_c);
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
        if (this._cursorPositionResolver) {
            this.readCursorPosition(data);
            this._cursorPositionResolver = undefined;
            return;
        }
        this.propagateEvent('data', data);
    }
    keypress(key) {
        if (key === key_1.KEYS.ctrl_c) {
            this.emit('destroy');
        }
    }
    async mount() {
        this.input.setRawMode(true);
        this.input.on('data', (data) => {
            this.emit('data', data);
        });
        await this.render();
    }
    async render() {
        const [x, y] = await this.getCursorPosition();
        this.x = x;
        this.y = y;
        this.width = this.columns;
        this.height = this.rows;
    }
    async resize() {
        //only triggers resize under fullscreen mode.
        this.cursorTo(0, 0);
        await this.render();
        this.children.forEach(child => {
            child.emit('resize');
        });
    }
    listenResize() {
        this.output.on('resize', async () => {
            this.emit('resize');
        });
    }
    cursorTo(x, y) {
        this.output.cursorTo(x, y);
    }
    clearLine(dir) {
        this.output.clearLine(dir);
    }
    clearArea(x, y, width, height) {
        for (let i = 0; i < height; i++) {
            this.cursorTo(x, y + i);
            for (let j = 0; j < width; j++) {
                this.write(' ');
            }
        }
    }
    write(data) {
        this.output.write(data);
    }
    appendChild(component) {
        this.children.push(component);
        component.emit('mount', this, this);
    }
    fullScreen() {
        this.write('\u001b[?1049h'); //smcup
        this.x = 0;
        this.y = 0;
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
    async getCursorPosition() {
        return new Promise((resolve, reject) => {
            this.write('\u001b[6n');
            this._cursorPositionResolver = resolve;
        });
    }
    readCursorPosition(data) {
        let row = [], col = [], split = false;
        for (let i = 2; i < data.length - 1; i++) {
            if (data[i] === 59) {
                split = true;
                continue;
            }
            if (!split) {
                row.push(data[i]);
            }
            else {
                col.push(data[i]);
            }
        }
        const y = Number.parseInt(Buffer.from(row).toString()) - 1, x = Number.parseInt(Buffer.from(col).toString()) - 1;
        if (this._cursorPositionResolver) {
            this._cursorPositionResolver([x, y]);
        }
        return;
    }
    destroy() {
        process.exit();
    }
}
exports.Program = Program;
__export(require("./screen"));
__export(require("./input"));
