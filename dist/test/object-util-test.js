"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectUtil = require("../util/object");
var obj = { name: "Jason", age: 22, arr: [1, 2, 3], sub: { a: 1 } };
var res = ObjectUtil.depCopy(obj);
console.log(res);
res.arr[1] = 3;
console.log(obj);
var StringUtil = require("../util/string");
var a = { a: 1 };
StringUtil.escapeObject(JSON.stringify(a));
//# sourceMappingURL=object-util-test.js.map