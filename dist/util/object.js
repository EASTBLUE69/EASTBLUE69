"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../constants/constant");
var array_1 = require("./array");
var getDotVal = function (obj, key) {
    var val, k;
    if (key) {
        key = key.replace(constant_1.RegexpStr.bracket, ".$1"); // 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0
        val = obj;
        // 获取对应的dot值
        var arr = key.split(".") || [key];
        while (k = arr.shift()) {
            if (!val) {
                val = undefined;
                break;
            }
            val = val[k];
        }
    }
    return val;
};
exports.getDotVal = getDotVal;
var depCopy = function (obj) {
    var newObj = {};
    for (var i in obj) {
        if (typeof obj[i] === 'object') {
            if (Array.isArray(obj[i])) {
                newObj[i] = array_1.depCopyArray(obj[i]);
            }
            else {
                newObj[i] = depCopy(obj[i]);
            }
        }
        else {
            newObj[i] = obj[i];
        }
    }
    return newObj;
};
exports.depCopy = depCopy;
var setObserveDotVal = function (observeData, key, val) {
    key = key.replace(constant_1.RegexpStr.bracket, ".$1"); // 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0
    var tmp = observeData;
    var arr = key.split(".");
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        tmp = tmp[arr[i]];
    }
    tmp[arr[len - 1]] = val;
};
exports.setObserveDotVal = setObserveDotVal;
var extend = function (srcObj, extObj) {
    if (srcObj === void 0) { srcObj = {}; }
    for (var i in extObj) {
        srcObj[i] = extObj[i];
    }
    return srcObj;
};
exports.extend = extend;
var isNull = function (obj) {
    var res;
    for (var i in obj) {
        if (obj.hasOwnProperty(i) && !obj[i]) {
            res = true;
        }
    }
    return !res || obj == null || Object.keys(obj).length === 0;
};
exports.isNull = isNull;
//# sourceMappingURL=object.js.map