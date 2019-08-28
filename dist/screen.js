"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
class Screen extends node_1.ParentNode {
    constructor(options = {}) {
        super();
        this.cursorX = 0;
        this.cursorY = 0;
    }
    data(data) {
        this.propagateEvent('data', data);
    }
    render(program) {
        this.program = program;
        this.height = program.rows;
        this.width = program.columns;
        program.write('\u001b[?1049h'); //smcup
        program.cursorTo(0, 0);
        program.output.clearScreenDown();
        //todo border drawing
        for (let i = 0; i < this.width; i++) {
            if (i === 0 || i === this.width - 1) {
                program.write('+');
            }
            else {
                program.write('-');
            }
        }
        program.cursorTo(0, 1);
        for (let i = 1; i < this.height; i++) {
            program.write('¦');
            program.cursorTo(0, i);
        }
        program.cursorTo(this.width - 1, 1);
        for (let i = 1; i < this.height; i++) {
            program.write('¦');
            program.cursorTo(this.width - 1, i);
        }
        program.cursorTo(0, program.rows);
        for (let i = 0; i < this.width; i++) {
            if (i === 0 || i === this.width - 1) {
                program.write('+');
            }
            else {
                program.write('-');
            }
        }
    }
    destroy() {
        if (this.program) {
            this.program.write('\u001b[?1049l'); //rmcup
        }
    }
}
exports.Screen = Screen;
