"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const key_1 = require("./key");
const node_1 = require("./node");
class Input extends node_1.Node {
    constructor(options = {}) {
        super();
        this.inputValue = '';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.options = options;
        this.bindKey(key_1.KEYS.return);
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
        }
    }
    reset() {
        this.inputValue = '';
        if (this.program) {
            this.program.cursorTo(this.x, this.y);
            this.program.clearLine(0);
            if (this.options.prompt) {
                this.program.write(this.options.prompt);
            }
            if (this.options.underLine) {
                this.program.write('\u001b[0m\u001b[4m');
            }
        }
    }
    render(program) {
        this.program = program;
        this.width = program.rows;
        this.height = 1; //todo
        key_1.bindKey(key_1.KEYS.return, this);
        this.reset();
    }
}
exports.Input = Input;
