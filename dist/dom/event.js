"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindEvent = function (node, event, method, params, methodsObj, observeData) {
    if (node.addEventListener) {
        node.addEventListener(event, function () {
            if (methodsObj && methodsObj[method]) {
                methodsObj[method].apply(observeData, params);
            }
            else {
                console.error("未声明" + method + "方法");
            }
        });
    }
    else {
        node.attachEvent("on" + event, function () {
            if (methodsObj && methodsObj[method]) {
                methodsObj[method].apply(observeData, params);
            }
            else {
                console.error("未声明" + method + "方法");
            }
        });
    }
};
//# sourceMappingURL=event.js.map