"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../constants/constant");
var ForDOM_1 = require("../vdom/ForDOM");
var NormalDOM_1 = require("../vdom/NormalDOM");
var InputDOM_1 = require("../vdom/InputDOM");
var validator_1 = require("../util/validator");
var ComponentDOM_1 = require("../vdom/ComponentDOM");
var RenderQueue = /** @class */ (function () {
    function RenderQueue(node, kmv) {
        this.queue = [];
        this.kmv = kmv;
        this.queue = this.queueInit(node);
    }
    RenderQueue.prototype.getQueue = function () {
        return this.queue;
    };
    RenderQueue.prototype.queueInit = function (parentNode) {
        var childNodes = parentNode.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var child = childNodes[i];
            switch (child.nodeType) {
                case constant_1.NodeType.TEXT:
                    this.queue.push(new NormalDOM_1.NormalDOM(child, this.kmv));
                    break;
                case constant_1.NodeType.ELEMENT:
                    if (validator_1.isUnknowElement(child.tagName)) {
                        // 组件
                        this.queue.push(new ComponentDOM_1.ComponentDOM(child, this.kmv, null));
                    }
                    else {
                        if (child.getAttribute("k-for")) {
                            this.queue.push(new ForDOM_1.ForDOM(child, this.kmv, this.kmv.data));
                        }
                        else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
                            this.queue.push(new InputDOM_1.InputDOM(child));
                        }
                        else {
                            // 常规dom不需要传第三个参数
                            this.queue.push(new NormalDOM_1.NormalDOM(child, this.kmv));
                        }
                    }
                    break;
            }
        }
        return this.queue;
    };
    return RenderQueue;
}());
exports.RenderQueue = RenderQueue;
//# sourceMappingURL=RenderQueue.js.map