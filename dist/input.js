"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const key_1 = require("./key");
const node_1 = require("./node");
const styling_1 = require("./styling");
class Input extends node_1.Node {
    constructor(options = {}) {
        super();
        this.inputValue = '';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.options = options;
        this.bindKey(key_1.KEYS.return);
        this.bindKey(key_1.KEYS.del);
    }
    get contentWidth() {
        if (this.options.style && this.options.style.border) {
            if (this.width < 2) {
                return 0;
            }
            else {
                return this.width - 2;
            }
        }
        else {
            return this.width;
        }
    }
    get contentHeight() {
        if (this.options.style && this.options.style.border) {
            if (this.height < 2) {
                return 0;
            }
            else {
                return this.height - 2;
            }
        }
        else {
            return this.height;
        }
    }
    get contentOffsetX() {
        if (this.options.style && this.options.style.border) {
            return 1;
        }
        else {
            return 0;
        }
    }
    get contentOffsetY() {
        if (this.options.style && this.options.style.border) {
            return 1;
        }
        else {
            return 0;
        }
    }
    data(data) {
        if (this.program) {
            this.program.write(data);
            this.inputValue += data.toString();
        }
    }
    keypress(key) {
        if (key === key_1.KEYS.return) {
            this.emit('change', this.inputValue);
            this.reset();
            return;
        }
        if (key === key_1.KEYS.del) {
            if (this.program && this.inputValue.length > 0) {
                this.program.write('\u0008'); //backspace
                this.program.write('\x1b[X'); //erase
                this.inputValue = this.inputValue.slice(0, this.inputValue.length - 1);
            }
        }
    }
    reset() {
        this.inputValue = '';
        if (this.program) {
            this.program.cursorTo(this.absX() + this.contentOffsetX, this.absY() + this.contentOffsetY);
            if (this.options.prompt) {
                this.program.write(this.options.prompt);
            }
        }
    }
    render(program, parent) {
        this.program = program;
        this.parent = parent;
        this.width = parent.contentWidth - 20;
        this.height = 10; //todo
        const parentContentX = parent.x + parent.contentOffsetX, parentContentY = parent.y + parent.contentOffsetY;
        this.x = this.options.x ? this.options.x + parentContentX : parentContentX;
        this.y = this.options.y ? this.options.y + parentContentX : parentContentY;
        this.program.clearArea(this.absX(), this.absY(), this.width, this.height);
        if (this.options.style) {
            styling_1.styling(this.options.style, this, program);
        }
        this.bindKey(key_1.KEYS.return);
        this.reset();
    }
    destroy() { }
}
exports.Input = Input;
