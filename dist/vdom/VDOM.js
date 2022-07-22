"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var template_1 = require("../util/template");
var domOp_1 = require("../dom/domOp");
var constant_1 = require("../constants/constant");
var validator_1 = require("../util/validator");
var event_1 = require("../dom/event");
var object_1 = require("../util/object");
var DomOp = require("../dom/domOp");
var object_2 = require("../util/object");
var VDOM = /** @class */ (function () {
    function VDOM(node, kmv) {
        if (kmv === void 0) { kmv = {}; }
        this.childrenVdom = [];
        this.isComponent = false;
        this.$emptyComment = domOp_1.createComment(''); // 空白注释, 替换kif dom
        // @ts-ignore
        node.attributes && (this.attributes = [].slice.call(node.attributes).slice(0));
        if (node.nodeType === constant_1.NodeType.ELEMENT) {
            this.kshow = node.getAttribute("k-show");
            this.kif = node.getAttribute("k-if");
        }
        this.nextSibling = node.nextSibling;
        this.parentNode = node.parentNode;
    }
    // 传递组件对象, 组件私有方法
    VDOM.prototype.renderAttr = function (data, kmv, component) {
        if (component === void 0) { component = {}; }
        if (this.nodeType === constant_1.NodeType.ELEMENT) {
            var node = this.$dom;
            var attrs = this.attributes;
            for (var i = 0; i < attrs.length; i++) {
                var attr = attrs[i];
                var attrName = attr.nodeName, attrVal = attr.nodeValue;
                // @ts-ignore
                if (constant_1.RegexpStr.kAttribute.test(attrName)) {
                    var key = attr.nodeName.replace(constant_1.RegexpStr.kAttribute, '$1');
                    if (key === 'class') {
                        // 类 a:'class2', b:'class2'
                        var arr = attrVal.split(",");
                        var valRes = "";
                        for (var n = 0; n < arr.length; n++) {
                            var ak = arr[n].split(":")[0];
                            if (object_1.getDotVal(data, ak.trim())) {
                                valRes += arr[n].split(":")[1].trim() + " ";
                            }
                        }
                        // @ts-ignore
                        node.setAttribute(key, valRes.trim());
                    }
                    else {
                        var val = template_1.compileTpl(attrVal, data);
                        node.setAttribute(key, val);
                    }
                }
                else { // @ts-ignore
                    // @ts-ignore
                    if (constant_1.RegexpStr.kOnAttribute.test(attrName)) {
                        var event_2 = attrName.replace(constant_1.RegexpStr.kOnAttribute, '$1');
                        var func = template_1.compileTpl(attrVal, data);
                        var match = func.match(constant_1.RegexpStr.methodAndParam);
                        var method = match[1];
                        var params = match[2];
                        var paramsArr = params.split(",");
                        for (var n = 0; n < paramsArr.length; n++) {
                            if (paramsArr[n] === 'this') {
                                paramsArr[n] = this.$dom;
                            }
                            else {
                                // @ts-ignore
                                paramsArr[n] = String(paramsArr[n]).trim();
                            }
                        }
                        if (!object_2.isNull(component)) {
                            event_1.bindEvent(node, event_2, method, paramsArr, component.methods, component.$data);
                        }
                        else {
                            event_1.bindEvent(node, event_2, method, paramsArr, kmv.methods, kmv.data);
                        }
                        node.removeAttribute(attrName);
                    }
                    else {
                        node.setAttribute(attrName, attrVal);
                    }
                }
                if (this.kshow) {
                    var isShow = object_1.getDotVal(data, this.kshow);
                    this.$dom.style.display = !!isShow ? "block" : "none";
                }
                if (this.kif) {
                    var isIf = object_1.getDotVal(data, this.kif);
                    if (!isIf)
                        DomOp.replaceNode(this.$dom, this.$emptyComment);
                    else
                        DomOp.replaceNode(this.$emptyComment, this.$dom);
                }
            }
        }
    };
    VDOM.prototype.reRenderAttr = function (data, kmv, component) {
        if (component === void 0) { component = {}; }
        var node = this.$dom;
        for (var i = 0; i < this.attributes.length; i++) {
            var attr = this.attributes[i];
            var attrName = attr.nodeName, attrVal = attr.nodeValue;
            if (validator_1.isKvmAttribute(attrName)) {
                // @ts-ignore
                if (constant_1.RegexpStr.kAttribute.test(attrName)) {
                    var key = attr.nodeName.replace(constant_1.RegexpStr.kAttribute, '$1');
                    if (key === 'class') {
                        // 类 a:'class2', b:'class2'
                        var arr = attrVal.split(",");
                        var valRes = "";
                        for (var n = 0; n < arr.length; n++) {
                            var ak = arr[n].split(":")[0];
                            if (object_1.getDotVal(data, ak.trim())) {
                                valRes += arr[n].split(":")[1].trim() + " ";
                            }
                        }
                        // @ts-ignore
                        node.setAttribute(key, valRes.trim());
                        node.removeAttribute(attrName);
                    }
                    else {
                        var newVal = template_1.compileTpl(attrVal, data);
                        var oldVal = node.getAttribute(key);
                        newVal !== oldVal && node.setAttribute(key, newVal);
                        node.removeAttribute(attrName);
                    }
                }
                else {
                    var newVal = template_1.compileTpl(attrVal, data);
                    var oldVal = node.getAttribute(attrName);
                    newVal !== oldVal && node.setAttribute(attrName, newVal);
                }
            }
            else { // @ts-ignore
                // @ts-ignore
                if (constant_1.RegexpStr.kOnAttribute.test(attrName)) {
                    node.removeAttribute(attrName);
                }
                else {
                    node.setAttribute(attrName, attrVal);
                }
            }
        }
        if (!object_2.isNull(component)) {
            if (this.kshow) {
                var isShow = object_1.getDotVal(component.$data, this.kshow);
                this.$dom.style.display = !!isShow ? "block" : "none";
            }
            if (this.kif) {
                var isIf = object_1.getDotVal(component.$data, this.kif);
                if (!isIf)
                    DomOp.replaceNode(this.$dom, this.$emptyComment);
            }
        }
        else {
            if (this.kshow) {
                var isShow = object_1.getDotVal(data, this.kshow);
                this.$dom.style.display = !!isShow ? "block" : "none";
            }
            if (this.kif) {
                var isIf = object_1.getDotVal(data, this.kif);
                if (!isIf)
                    DomOp.replaceNode(this.$dom, this.$emptyComment);
                else
                    DomOp.replaceNode(this.$emptyComment, this.$dom);
            }
        }
    };
    return VDOM;
}());
exports.VDOM = VDOM;
//# sourceMappingURL=VDOM.js.map