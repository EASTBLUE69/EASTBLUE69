import * as ObjectUtil from '../util/object'
import { ArrayMethod } from '../constants/constant'
import { getDotVal } from "../util/object";
import { setObserveDotVal } from "../util/object";
import {depCopy} from "../util/object";

/**
 *   URL:
 *   说明:
 *   负责人: Jason　Woo
 *   日期:  2022 07 13.
 */
export let observer = (obj, kmv, key = '') => {
    let srcData = depCopy(obj);
    for (let i in obj) {
        let bigKey = key ? key + "." + i : i;
        let defVal = obj[i];
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
            get: function() {
                return this['__' + i + '__'] == undefined ? defVal : this['__' + i + '__'];
            }
        })
        if (typeof obj[i] == 'object') {
            if (Array.isArray(obj[i])) {
                arrayObserve(obj[i], kmv, bigKey);
            } else {
                observer(obj[i], kmv, bigKey);
            }
        }
    }
    return srcData;
}

function arrayObserve(arr, kmv, bigKey) {
    // 监听array操作
    ArrayMethod.forEach((method) => {
        Object.defineProperty(arr, method, {
            configurable: true,
            enumerable: false, // hide from for...in
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

