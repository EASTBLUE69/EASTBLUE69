"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../constants/constant");
exports.diff = function (arr1, arr2) {
    if (arr1 === void 0) { arr1 = []; }
    if (arr2 === void 0) { arr2 = []; }
    var change = [];
    var cp = arr1.slice(0), cp2 = arr2.slice(0); // 拷贝一份
    var len1 = arr1.length, len2 = arr2.length;
    var len = Math.min(len1, len2);
    for (var i = 0; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
            change.push({
                op: constant_1.ArrayOp.CHANGE,
                index: i,
                text: arr2[i]
            });
        }
    }
    if (len1 > len2) {
        var deleteArr = arr1.slice(len2);
        // 删除dom
        for (var i = 0; i < deleteArr.length; i++) {
            change.push({
                op: constant_1.ArrayOp.POP,
                index: i + len2,
                text: deleteArr[i]
            });
        }
    }
    else if (len2 > len1) {
        var addArr = arr2.slice(len1);
        change.push({
            batch: true,
            op: constant_1.ArrayOp.PUSH,
            array: addArr
        });
    }
    return change;
};
exports.depCopyArray = function (arr) {
    if (typeof arr === 'object')
        return JSON.parse(JSON.stringify(arr));
    else {
        return [];
    }
};
//# sourceMappingURL=array.js.map