"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var template_1 = require("../util/template");
var DomOp = require("../dom/domOp");
var VDOM_1 = require("./VDOM");
var ForDOM_1 = require("./ForDOM");
var InputDOM_1 = require("./InputDOM");
var constant_1 = require("../constants/constant");
var ForNormalDOM = /** @class */ (function (_super) {
    __extends(ForNormalDOM, _super);
    function ForNormalDOM(node, kmv, parentData) {
        if (parentData === void 0) { parentData = {}; }
        var _this = 
        // h3
        _super.call(this, node) || this;
        _this.childrenVdom = [];
        _this.tagName = node.tagName;
        _this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0));
        _this.nodeType = node.nodeType;
        switch (node.nodeType) {
            case constant_1.NodeType.TEXT:
                _this.template = node.textContent;
                break;
            case constant_1.NodeType.ELEMENT:
                _this.kshow = node.getAttribute("k-show");
                if (node.childNodes) {
                    for (var i = 0; i < node.childNodes.length; i++) {
                        var child = node.childNodes[i];
                        if (child.nodeType === constant_1.NodeType.ELEMENT) {
                            if (child.getAttribute("k-for")) {
                                _this.childrenVdom.push(new ForDOM_1.ForDOM(child, kmv, parentData));
                            }
                            else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
                                _this.childrenVdom.push(new InputDOM_1.InputDOM(child));
                            }
                            else {
                                _this.childrenVdom.push(new ForNormalDOM(child, kmv, parentData));
                            }
                        }
                        else {
                            _this.childrenVdom.push(new ForNormalDOM(child, kmv, parentData));
                        }
                    }
                }
                break;
        }
        return _this;
    }
    // iteratorObj 为遍历的数据，需要构造, 第三个组件实例
    ForNormalDOM.prototype.transDOM = function (data, kmv, component) {
        if (component === void 0) { component = null; }
        var newEle = document.createElement(this.tagName);
        switch (this.nodeType) {
            case constant_1.NodeType.TEXT:
                newEle = DomOp.createTextNode(this.tagName);
                var text = void 0;
                if (component) {
                    text = template_1.compileTpl(this.template, component.$data);
                }
                else {
                    text = template_1.compileTpl(this.template, data);
                }
                newEle.textContent = text;
                this.$dom = newEle;
                break;
            case constant_1.NodeType.ELEMENT:
                newEle = document.createElement(this.tagName);
                this.$dom = newEle;
                this.childrenVdom
                    &&
                        this.childrenVdom.forEach(function (child) {
                            if (child instanceof ForDOM_1.ForDOM) {
                                // 嵌套for
                                child.parentNode = newEle; // 嵌套父节点必须重新更新
                                child.nextSibling = newEle.previousSibling;
                                child.renderInit(data, kmv);
                            }
                            else {
                                newEle.appendChild(child.transDOM(data, kmv, component));
                            }
                        });
                this.renderAttr(data, kmv, component);
                break;
        }
        return newEle;
    };
    /**
     * @param data      渲染的数据
     * @param kmv       kmv
     */
    ForNormalDOM.prototype.reRender = function (data, kmv, component) {
        var _this = this;
        switch (this.nodeType) {
            case constant_1.NodeType.TEXT:
                // 组件存在就用组件的数据去渲染
                // component && (data = component.$data);
                var text = template_1.compileTpl(this.template, data);
                DomOp.changeTextContent(this.$dom, text);
                break;
            case constant_1.NodeType.ELEMENT:
                this.childrenVdom.forEach(function (child) {
                    if (child instanceof ForDOM_1.ForDOM) {
                        // 嵌套for
                        child.reRender(data, kmv, component);
                    }
                    else {
                        child.reRender(data, kmv, component);
                        _this.reRenderAttr(data, kmv, component);
                    }
                });
                break;
        }
    };
    return ForNormalDOM;
}(VDOM_1.VDOM));
exports.ForNormalDOM = ForNormalDOM;
//# sourceMappingURL=ForNormalDOM.js.map