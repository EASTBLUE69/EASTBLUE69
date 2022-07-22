"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../constants/constant");
var object_1 = require("./object");
var function_1 = require("./function");
/**
 *  转换逻辑操作运算结果
 *
 */
exports.transArithmeticOp = function (tpl, obj) {
    var opReg = constant_1.RegexpStr.arithmeticOp;
    var arr = tpl.split(opReg); // 符号切分
    var opRegArr = tpl.match(opReg);
    var isParamReg = constant_1.RegexpStr.isParams;
    var tmp;
    var newStr = '';
    for (var i = 0; i < arr.length; i++) {
        tmp = arr[i].trim();
        if (isParamReg.test(tmp)) {
            // 如果是变量
            var val = object_1.getDotVal(obj, tmp);
            if (isNaN(val)) { // 字符串
                newStr += '"' + val + '"';
            }
            else {
                if (!val)
                    val = 0;
                newStr += val;
            }
        }
        else {
            newStr += tmp;
        }
        if (i < arr.length - 1) {
            newStr += opRegArr[i];
        }
    }
    var res = eval(newStr);
    return res;
};
exports.transTernaryOperator = function (tpl, obj) {
    var arr = tpl.split(/\?|:|\(|\)|\+|-|\*|\/|!/);
    var match = tpl.match(/\?|:|\(|\)|\+|-|\*|\/|!/g);
    var newStr = '';
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i].trim();
        if (item && constant_1.RegexpStr.isParams.test(item)) {
            newStr += '_data.' + item;
        }
        else {
            newStr += item;
        }
        if (match[i])
            newStr += match[i];
    }
    return (function (str, _data) {
        return eval(str);
    })(newStr, obj);
};
exports.compileTpl = function (tpl, obj) {
    var braceReg = constant_1.RegexpStr.brace;
    var regRes;
    while (regRes = braceReg.exec(tpl)) {
        var key = regRes ? regRes[1].trim() : ''; // 获取括号的键
        if (key) {
            var text = function_1.evalJs(key, obj);
            tpl = tpl.replace(braceReg, text);
        }
        else {
            return '';
        }
    }
    return tpl;
};
//# sourceMappingURL=template.js.map