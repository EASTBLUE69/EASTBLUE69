"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../constants/constant");
exports.isBraceReg = function (str) {
    return constant_1.RegexpStr.brace.test(str);
};
/**
 *  是否有包含语法
 * @param str
 */
exports.isForStatement = function (str) {
    return constant_1.RegexpStr.forStatement.test(str);
};
exports.isKvmAttribute = function (key) {
    return constant_1.RegexpStr.arrtibuteKey.test(key);
};
exports.isUnknowElement = function (tag) {
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
        return (el.constructor === window.HTMLUnknownElement ||
            el.constructor === window.HTMLElement);
    }
    else {
        return /HTMLUnknownElement/.test(el.toString());
    }
};
//# sourceMappingURL=validator.js.map