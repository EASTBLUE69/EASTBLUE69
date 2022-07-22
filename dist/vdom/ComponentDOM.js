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
var NormalDOM_1 = require("./NormalDOM");
var VDOM_1 = require("./VDOM");
var DomOp = require("../dom/domOp");
var constant_1 = require("../constants/constant");
var object_1 = require("../util/object");
var ForDOM_1 = require("./ForDOM");
var observer_1 = require("../core/observer");
var validator_1 = require("../util/validator");
var InputDOM_1 = require("./InputDOM");
var ComponentDOM = /** @class */ (function (_super) {
    __extends(ComponentDOM, _super);
    function ComponentDOM(node, kmv, parent) {
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this, node) || this;
        _this.childrenVdom = [];
        _this.$data = {};
        _this.isComponent = true;
        _this.isComponent = true;
        _this.tagName = node.tagName;
        var component = kmv.components[_this.tagName.toLowerCase()]; // 组件配置
        if (component) {
            _this.methods = component.methods;
            var div = document.createElement("div");
            div.innerHTML = component.template.trim(); // 转为dom
            _this.template = component.template.trim();
            _this.attributes = node.attributes;
            for (var i = 0; i < node.attributes.length; i++) {
                div.firstChild.setAttribute(node.attributes[i].nodeName, node.attributes[i].nodeValue);
            }
            _this.node = node;
            _this.$dom = div.firstChild; // 关联dom
            _this.model = node.getAttribute(":model"); // 数据键
            // console.log(parentData, this.model);
            var parentData = void 0;
            if (parent instanceof ComponentDOM) {
                parentData = parent['$data'];
            }
            else {
                parentData = kmv.data;
            }
            _this.$data = {
                model: object_1.getDotVal(parentData, _this.model)
            }; // 渲染的数据
            if (component.data) {
                _this.$data = object_1.extend(_this.$data, component.data());
            }
            observer_1.observer(_this.$data, kmv);
            if (_this.$data['model']) {
                for (var i = 0; i < _this.$dom.childNodes.length; i++) {
                    var child = _this.$dom.childNodes[i];
                    if (child.nodeType == constant_1.NodeType.ELEMENT) {
                        if (child.getAttribute("k-for")) {
                            _this.childrenVdom.push(new ForDOM_1.ForDOM(child, kmv, _this));
                        }
                        else if (child.getAttribute("k-model") && constant_1.RegexpStr.inputElement.test(child.tagName)) {
                            _this.childrenVdom.push(new InputDOM_1.InputDOM(child));
                        }
                        else if (validator_1.isUnknowElement(child.tagName)) {
                            _this.childrenVdom.push(new ComponentDOM(child, kmv, _this));
                        }
                        else {
                            _this.childrenVdom.push(new NormalDOM_1.NormalDOM(child, kmv, _this));
                        }
                    }
                    else {
                        _this.childrenVdom.push(new NormalDOM_1.NormalDOM(child, kmv, _this));
                    }
                }
            }
            _this.node = node;
        }
        else {
            console.error("无效标签" + _this.tagName);
        }
        return _this;
    }
    ComponentDOM.prototype.renderInit = function (data, kmv) {
        var _this = this;
        if (data === void 0) { data = null; }
        this.insertNewDOM();
        DomOp.removeNode(this.node);
        // 先插入后渲染
        this.childrenVdom.forEach(function (child) {
            child.renderInit(_this.$data, kmv, _this);
        });
    };
    ComponentDOM.prototype.transDOM = function (data, kmv) {
        return this.$dom;
    };
    ComponentDOM.prototype.reRender = function (data, kmv) {
        var _this = this;
        this.childrenVdom.forEach(function (child) {
            child.reRender(_this.$data, kmv, _this);
        });
    };
    ComponentDOM.prototype.getRealDOM = function () {
        var div = document.createElement("div");
        div.innerHTML = this.template; // 转为dom
        return div.firstChild;
    };
    ComponentDOM.prototype.replaceDOM = function () {
    };
    ComponentDOM.prototype.insertNewDOM = function () {
        DomOp.insertBefore(this.node, this.$dom);
        DomOp.removeNode(this.node);
    };
    return ComponentDOM;
}(VDOM_1.VDOM));
exports.ComponentDOM = ComponentDOM;
//# sourceMappingURL=ComponentDOM.js.map