import * as tty from 'tty'
import { EventEmitter } from 'events';

const stdin = process.stdin as tty.ReadStream;
const stdout = process.stdout as tty.WriteStream;

export class Terminal extends EventEmitter {
  initialize() {
    if (!stdin || !stdout || !stdin.isTTY) {
      throw new Error('Not in a tty environment.');
    }

    stdin.setRawMode(true);
    this.fullscreen();
    this.clearScreen();

    stdin.on('data', (data: Buffer) => {
      this.emit('data', data);
    });
  }

  cursorTo(x: number, y: number) {
    stdout.cursorTo(x, y);
  }

  clearScreen() {
    this.cursorTo(0, 0);
    stdout.clearScreenDown();
  }

  fullscreen() {
    stdin.write("\u001b[?1049h"); //smcup
  }

  write(data: Buffer | string) {
    stdout.write(data);
  }

  getWidth(): number {
    return stdout.columns;
  }

  getHeight(): number {
    return stdout.rows;
  }

  clearArea(x: number, y: number, width: number, height: number) {
    for (let i = 0; i < height; i++) {
      this.cursorTo(x, y + i);
      for (let j = 0; j < width; j++) {
        this.write(" ");
      }
    }
  }
}

export default new Terminal()