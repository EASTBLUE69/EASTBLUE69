"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalJs = function (content, obj) {
    // console.dir(obj);
    // return (function() { return eval(content) }).call(obj);
    var res;
    try {
        return new Function("with(this){ return " + content + " }").call(obj);
    }
    catch (err) {
        return '';
    }
};
exports.evalFunc = function (code) {
    return new Function("with(this){ console.log(this); return " + code + " }");
};
//# sourceMappingURL=function.js.map