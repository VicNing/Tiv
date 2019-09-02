import { Node } from './node'
import { Program } from './program'

interface BorderStyle {
  color?: string
}

export interface StyleOptions {
  border?: BorderStyle
}

const drawBorder = function (borderStyle: BorderStyle, node: Node, program: Program) {
  if (program) {
    //top border
    program.cursorTo(node.absX, node.absY);
    program.write('┏');
    for (let i = 1; i < node.width - 1; i++) {
      program.write('━');
    }
    program.write('┓');

    //right border
    program.cursorTo(node.absX + node.width - 1, node.absY + 1);
    for (let i = 1; i < node.height - 1; i++) {
      program.write('┃');
      program.cursorTo(node.absX + node.width - 1, node.absY + 1 + i);
    }

    //botom border
    program.cursorTo(node.absX, node.absY + node.height - 1);
    program.write('┗');
    for (let i = 1; i < node.width - 1; i++) {
      program.write('━');
    }
    program.write('┛');

    //left border
    program.cursorTo(node.absX, node.absY + 1);
    for (let i = 1; i < node.height - 1; i++) {
      program.write('┃');
      program.cursorTo(node.absX, node.absY + 1 + i);
    }
  }
}

export const styling = function (style: StyleOptions | undefined, node: Node, program: Program) {
  if (!style) {
    return;
  }

  if (style.border) {
    drawBorder(style.border, node, program);
  }
}