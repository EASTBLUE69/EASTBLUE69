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
var constant_1 = require("../constants/constant");
var VDOM_1 = require("./VDOM");
var ForDOM_1 = require("./ForDOM");
var InputDOM_1 = require("./InputDOM");
var validator_1 = require("../util/validator");
var ComponentDOM_1 = require("./ComponentDOM");
var NormalDOM = /** @class */ (function (_super) {
    __extends(NormalDOM, _super);
    // 第三个参数传递给子组件的数据
    function NormalDOM(node, kmv, parentData) {
        if (parentData === void 0) { parentData = {}; }
        var _this = _super.call(this, node) || this;
        _this.childrenVdom = [];
        switch (node.nodeType) {
            case constant_1.NodeType.TEXT:
                _this.template = node.textContent;
                node.textContent = '';
                break;
            case constant_1.NodeType.ELEMENT:
                break;
        }
        _this.tagName = node.tagName,
            _this.attributes = node.attributes && ([].slice.call(node.attributes).slice(0)),
            _this.nodeType = node.nodeType;
        _this.$dom = node;
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
                    else if (validator_1.isUnknowElement(child.tagName)) {
                        _this.childrenVdom.push(new ComponentDOM_1.ComponentDOM(child, kmv, parentData));
                    }
                    else {
                        _this.childrenVdom.push(new NormalDOM(child, kmv, parentData));
                    }
                }
                else {
                    _this.childrenVdom.push(new NormalDOM(child, kmv, parentData));
                }
            }
        }
        return _this;
    }
    NormalDOM.prototype.renderInit = function (data, kmv, component) {
        if (component === void 0) { component = null; }
        switch (this.nodeType) {
            case constant_1.NodeType.TEXT:
                var text = void 0;
                if (component) {
                    text = template_1.compileTpl(this.template, component.$data);
                }
                else {
                    text = template_1.compileTpl(this.template, data);
                }
                DomOp.changeTextContent(this.$dom, text);
                break;
            case constant_1.NodeType.ELEMENT:
                this.childrenVdom.forEach(function (child) {
                    child.renderInit(data, kmv, component);
                });
                this.renderAttr(data, kmv, component);
                break;
        }
    };
    NormalDOM.prototype.reRender = function (data, kmv, component) {
        switch (this.nodeType) {
            case constant_1.NodeType.TEXT:
                var text = void 0;
                if (component) {
                    text = template_1.compileTpl(this.template, component.$data);
                }
                else {
                    text = template_1.compileTpl(this.template, data);
                }
                text && DomOp.changeTextContent(this.$dom, text);
                break;
            case constant_1.NodeType.ELEMENT:
                this.childrenVdom.forEach(function (child) {
                    child.reRender(data, kmv, component);
                });
                this.reRenderAttr(data, kmv, component);
                break;
        }
    };
    NormalDOM.prototype.insertNewDOM = function (newDom) {
        if (this.nextSibling) {
            DomOp.insertBefore(this.nextSibling, newDom);
        }
        else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, newDom);
        }
    };
    NormalDOM.prototype.transDOM = function (data, kmv) {
        var _this = this;
        this.renderInit(data, kmv);
        this.childrenVdom.forEach(function (child) {
            _this.$dom.appendChild(child.transDOM(data, kmv));
        });
        return this.$dom;
    };
    return NormalDOM;
}(VDOM_1.VDOM));
exports.NormalDOM = NormalDOM;
//# sourceMappingURL=NormalDOM.js.map