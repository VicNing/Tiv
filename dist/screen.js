"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const styling_1 = require("./styling");
class Screen extends node_1.ParentNode {
    constructor(options = {}) {
        super();
        this.options = options;
    }
    data(data) {
        this.propagateEvent('data', data);
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
    render(program, parent) {
        this.program = program;
        this.x = 0;
        this.y = 0;
        this.width = parent.contentWidth;
        this.height = parent.contentHeight;
        program.write('\u001b[?1049h'); //smcup
        program.cursorTo(this.absX(), this.absY());
        program.output.clearScreenDown();
        styling_1.styling(this.options.style, this, program);
    }
    destroy() {
        if (this.program) {
            this.program.write('\u001b[?1049l'); //rmcup
        }
    }
}
exports.Screen = Screen;
