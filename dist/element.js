"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function validateElementOptions(options) {
    //todo
    if (options.border) {
        validateBorderOptions(options.border);
    }
    if (options.background) {
        validateBackgroundOptions(options.background);
    }
}
function validateBorderOptions(options) {
    //todo
}
function validateBackgroundOptions(options) {
    //todo
}
function calculateWidthOrHeight(property, value, parent) {
    if (property !== 'width' && property !== 'height') {
        throw new Error(`Function "calculateWidthOrHeight" must have either 'width' or 'height' as it's property argument.`);
    }
    if (typeof value === 'number') {
        if (value < 0) {
            throw new Error('Value should not less than 0.');
        }
        return value;
    }
    else if (typeof value === 'string' && utils_1.isPercentage(value)) {
        if (!parent) {
            return 0;
        }
        else {
            return parent[property] * utils_1.parsePersentage(value);
        }
    }
    else {
        throw new Error('Value should be a valid number or percentage string');
    }
}
function calculateLeftOrTop(property, value, element) {
    if (property !== 'left' && property !== 'top') {
        throw new Error(`Function "calculateLeftOrTop" must have either 'left' or 'top' as it's property argument.`);
    }
    if (typeof value === 'number') {
        return value;
    }
    else {
        if (!element.parent) {
            return 0;
        }
        if (utils_1.isPercentage(value)) {
            if (property === 'left') {
                return element.parent.width * utils_1.parsePersentage(value);
            }
            if (property === 'top') {
                return element.parent.height * utils_1.parsePersentage(value);
            }
        }
        if (value === 'center') {
            if (property === 'left') {
                return element.parent.width / 2 + element.width / 2;
            }
            if (property === 'top') {
                return element.parent.height / 2 + element.height / 2;
            }
        }
    }
    throw new Error(`Could not calculate left or top because of invalid combination of arguments.`);
}
class Element {
    constructor(options) {
        validateElementOptions(options);
    }
    get width() {
        if (!this._options) {
            return 0;
        }
        return calculateWidthOrHeight('width', this._options.width, this.parent);
    }
    get height() {
        if (!this._options) {
            return 0;
        }
        return calculateWidthOrHeight('height', this._options.height, this.parent);
    }
    get left() {
        if (!this._options) {
            return 0;
        }
        return calculateLeftOrTop('left', this._options.left, this);
    }
    get top() {
        if (!this._options) {
            return 0;
        }
        return calculateLeftOrTop('top', this._options.top, this);
    }
}
exports.Element = Element;
