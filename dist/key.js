"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KEYS;
(function (KEYS) {
    KEYS[KEYS["ctrl_c"] = 3] = "ctrl_c";
    KEYS[KEYS["return"] = 13] = "return";
})(KEYS = exports.KEYS || (exports.KEYS = {}));
exports.keyRegistry = {};
exports.bindKey = function (key, component) {
    if (!exports.keyRegistry[key]) {
        exports.keyRegistry[key] = [];
    }
    exports.keyRegistry[key].push(component);
};
exports.key = (key) => (action) => (chunk) => {
    const charcode = chunk.readIntLE(0, chunk.length);
    if (charcode === key) {
        return action();
    }
};
