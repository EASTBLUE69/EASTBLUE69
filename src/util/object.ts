
import { RegexpStr } from '../constants/constant';
import { depCopyArray } from "./array";

let getDotVal = (obj, key) => {
    let val, k;
    if (key) {
        key = key.replace(RegexpStr.bracket, ".$1");		// 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0
        val = obj;
        // 获取对应的dot值
        let arr = key.split(".") || [key];
        while (k = arr.shift()) {
            if (!val) {
                val = undefined;
                break;
            }
            val = val[k];
        }
    }
    return val;
}

let depCopy = (obj) => {
    let newObj = {};
    for (let i in obj) {
        if (typeof obj[i] === 'object') {
            if (Array.isArray(obj[i])) {
                newObj[i] = depCopyArray(obj[i]);
            } else {
                newObj[i] = depCopy(obj[i]);
            }
        } else {
            newObj[i] = obj[i];
        }
    }
    return newObj;
}


let setObserveDotVal = (observeData, key, val) => {
    key = key.replace(RegexpStr.bracket, ".$1");		// 把arr['name']/arr["name"]/arr[0] 转为 arr.name/arr.0
    let tmp = observeData;
    let arr = key.split(".");
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        tmp = tmp[arr[i]];
    }
    tmp[arr[len - 1]] = val;
}

let extend = (srcObj = {}, extObj) => {
    for (let i in extObj) {
        srcObj[i] = extObj[i];
    }
    return srcObj;
}

let isNull = (obj) => {
    let res;
    for (let i in obj) {
        if (obj.hasOwnProperty(i) && !obj[i]) {
            res = true;
        }
    }
    return !res || obj == null || Object.keys(obj).length === 0;
}

export { extend, isNull, setObserveDotVal, depCopy, getDotVal }