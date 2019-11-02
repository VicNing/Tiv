"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPercentage(value) {
    return /^.+%$/.test(value);
}
exports.isPercentage = isPercentage;
function parsePersentage(percentage) {
    const result = parseFloat(percentage) / 100;
    if (!/^[0-9]+\.?[0-9]+%$/.test(percentage) || Number.isNaN(result)) {
        throw new Error(`The input value ${percentage} may not be a valid percentage string.`);
    }
    return result;
}
exports.parsePersentage = parsePersentage;
