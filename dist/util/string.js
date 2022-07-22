"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeObject = function (objStr) {
    if (objStr) {
        objStr = objStr.replace(/"(\w+)"/g, "\\\"$1\\\"");
    }
    return objStr;
};
//# sourceMappingURL=string.js.map