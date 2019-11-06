"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const stdin = process.stdin;
const stdout = process.stdout;
class Terminal extends events_1.EventEmitter {
    initialize() {
        if (!stdin || !stdout || !stdin.isTTY) {
            throw new Error('Not in a tty environment.');
        }
        stdin.setRawMode(true);
        this.fullscreen();
        this.clearScreen();
        stdin.on('data', (data) => {
            this.emit('data', data);
        });
    }
    cursorTo(x, y) {
        stdout.cursorTo(x, y);
    }
    clearScreen() {
        this.cursorTo(0, 0);
        stdout.clearScreenDown();
    }
    fullscreen() {
        stdin.write("\u001b[?1049h"); //smcup
    }
    write(data) {
        stdout.write(data);
    }
    getWidth() {
        return stdout.columns;
    }
    getHeight() {
        return stdout.rows;
    }
    clearArea(x, y, width, height) {
        for (let i = 0; i < height; i++) {
            this.cursorTo(x, y + i);
            for (let j = 0; j < width; j++) {
                this.write(" ");
            }
        }
    }
}
exports.Terminal = Terminal;
exports.default = new Terminal();
