"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../constants/constant");
var object_1 = require("../util/object");
/**
 *   URL:
 *   说明:
 *   负责人: Jason　Woo
 *   日期:  2022 07 13.
 */
exports.observer = function (obj, kmv, key) {
    if (key === void 0) { key = ''; }
    var srcData = object_1.depCopy(obj);
    var _loop_1 = function (i) {
        var bigKey = key ? key + "." + i : i;
        var defVal = obj[i];
        Object.defineProperty(obj, i, {
            configurable: true,
            set: function (newVal) {
                kmv.pendingValue = true;
                kmv.changeQueue.push({
                    kmv: kmv,
                    bigKey: bigKey
                });
                kmv.watch[bigKey] && kmv.watch[bigKey].call(kmv.data, newVal);
                this['__' + i + '__'] = newVal;
            },
            get: function () {
                return this['__' + i + '__'] == undefined ? defVal : this['__' + i + '__'];
            }
        });
        if (typeof obj[i] == 'object') {
            if (Array.isArray(obj[i])) {
                arrayObserve(obj[i], kmv, bigKey);
            }
            else {
                exports.observer(obj[i], kmv, bigKey);
            }
        }
    };
    for (var i in obj) {
        _loop_1(i);
    }
    return srcData;
};
function arrayObserve(arr, kmv, bigKey) {
    // 监听array操作
    constant_1.ArrayMethod.forEach(function (method) {
        Object.defineProperty(arr, method, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: function () {
                // 有可能操作的不是数组
                Array.prototype[method].apply(arr, arguments);
                kmv.changeQueue.push({
                    kmv: kmv,
                    bigKey: bigKey
                });
                kmv.pendingValue = true;
            }
        });
    });
}
//# sourceMappingURL=observer.js.map