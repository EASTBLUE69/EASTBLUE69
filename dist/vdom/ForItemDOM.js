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
var DomOp = require("../dom/domOp");
var ForNormalDOM_1 = require("./ForNormalDOM");
var VDOM_1 = require("./VDOM");
var ForDOM_1 = require("./ForDOM");
var InputDOM_1 = require("./InputDOM");
var constant_1 = require("../constants/constant");
var validator_1 = require("../util/validator");
var ComponentDOM_1 = require("./ComponentDOM");
var object_1 = require("../util/object");
var ForItemDOM = /** @class */ (function (_super) {
    __extends(ForItemDOM, _super);
    function ForItemDOM(node, kmv, parentData) {
        if (parentData === void 0) { parentData = {}; }
        var _this = _super.call(this, node) || this;
        _this.childrenVdom = [];
        _this.componentInstance = null;
        if (node.nodeType == constant_1.NodeType.ELEMENT) {
            if (validator_1.isUnknowElement(node.tagName)) {
                // 组件转换
                _this.componentInstance = new ComponentDOM_1.ComponentDOM(node, kmv, parentData);
                node = new ComponentDOM_1.ComponentDOM(node, kmv, parentData).getRealDOM();
                node.$data = parentData;
                _this.isComponent = true;
            }
        }
        _this.tagName = node.tagName;
        _this.attributes = node.attributes;
        _this.nodeType = node.nodeType;
        _this.templateNode = node;
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            if (child.nodeType === constant_1.NodeType.ELEMENT) {
                if (validator_1.isUnknowElement(child.tagName)) {
                    _this.childrenVdom.push(new ComponentDOM_1.ComponentDOM(child, kmv, parentData));
                }
                else {
                    if (child.getAttribute("k-for")) {
                        _this.childrenVdom.push(new ForDOM_1.ForDOM(child, kmv, parentData));
                    }
                    else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
                        _this.childrenVdom.push(new InputDOM_1.InputDOM(child));
                    }
                    else {
                        _this.childrenVdom.push(new ForNormalDOM_1.ForNormalDOM(child, kmv, parentData));
                    }
                }
            }
            else if (child.nodeType === constant_1.NodeType.TEXT) {
                _this.childrenVdom.push(new ForNormalDOM_1.ForNormalDOM(child, kmv, kmv.$data));
            }
        }
        node.removeAttribute("k-for");
        return _this;
    }
    ForItemDOM.prototype.transDOM = function (iteratorObj, kmv) {
        var newElem = DomOp.createElement(this.tagName);
        for (var i = 0, len = this.childrenVdom.length; i < len; i++) {
            var childVdom = this.childrenVdom[i];
            var newDom = childVdom.transDOM(iteratorObj, kmv, this.componentInstance);
            newDom && newElem.appendChild(newDom);
        }
        this.$dom = newElem;
        if (this.kshow) {
            var isShow = object_1.getDotVal(iteratorObj, this.kshow);
            this.$dom.style.display = !!isShow ? "block" : "none";
        }
        if (this.kif) {
            var isIf = object_1.getDotVal(iteratorObj, this.kif);
            if (!isIf) {
                // 不显示
                return this.$emptyComment;
            }
        }
        return this.$dom;
    };
    // 重新渲染
    ForItemDOM.prototype.reRender = function (iteratorObj, kmv, component) {
        if (component === void 0) { component = null; }
        if (this.isComponent) {
            // 需要子组件去渲染子元素
            component = this.componentInstance;
        }
        this.childrenVdom.forEach(function (child) {
            child.reRender(iteratorObj, kmv, component);
        });
    };
    ForItemDOM.prototype.insertNewDOM = function (newDom) {
        if (this.nextSibling) {
            DomOp.insertBefore(this.nextSibling, newDom);
        }
        else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, newDom);
        }
    };
    return ForItemDOM;
}(VDOM_1.VDOM));
exports.ForItemDOM = ForItemDOM;
//# sourceMappingURL=ForItemDOM.js.map