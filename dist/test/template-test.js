"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TemplateUtil = require("../util/template");
// 模板功能测试
var obj = {
    a: 222,
    name: "Jason",
};
var res = TemplateUtil.transArithmeticOp("a + name + 20", obj);
console.log(res);
res = TemplateUtil.compileTpl("hello world my name is {{ a * a }}", obj);
console.log(res);
res = TemplateUtil.compileTpl("{{ a + name }} {{ name }}", obj);
console.log(res);
//# sourceMappingURL=template-test.js.map