"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terminal_1 = require("./terminal");
function getElementAbsolute(element, property) {
    if (property === 'top' || property === 'left') {
        if (element.parent) {
            return element[property] + getElementAbsolute(element.parent, property);
        }
        else {
            return element[property];
        }
    }
    else {
        throw new Error(`Can't get element absolute value on property ${property}.`);
    }
}
function calculateLayout(element) {
    const width = element.width, height = element.height, absTop = getElementAbsolute(element, 'top'), absLeft = getElementAbsolute(element, 'left');
    let contentOffsetX = 0, contentOffsetY = 0;
    if (element._options && element._options.border) {
        contentOffsetX += 1;
        contentOffsetY += 1;
    }
    //todo style properties
    return {
        width,
        height,
        absTop,
        absLeft,
        contentOffsetX,
        contentOffsetY
    };
}
function calculateStyle(element) {
    //border
    //background color
    //...
}
function paint(layout) {
    const { width, height, absTop, absLeft, contentOffsetX, contentOffsetY } = layout;
    terminal_1.default.clearArea(absLeft, absTop, width, height);
    terminal_1.default.cursorTo(absLeft, absTop);
}
function layoutAndRender(element) {
    const layout = calculateLayout(element);
    const style = calculateStyle(element);
    //const customPainters = element.constructor.customPainters;
    //paint(layout, style, element, customPainters);
}
exports.layoutAndRender = layoutAndRender;
