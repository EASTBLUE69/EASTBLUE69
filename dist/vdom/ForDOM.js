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
var ForItemDOM_1 = require("./ForItemDOM");
var constant_1 = require("../constants/constant");
var object_1 = require("../util/object");
var DomOp = require("../dom/domOp");
var array_1 = require("../util/array");
var VDOM_1 = require("./VDOM");
var ForDOM = /** @class */ (function (_super) {
    __extends(ForDOM, _super);
    // 第三个参数组件用的
    function ForDOM(node, kmv, parentComponent) {
        if (parentComponent === void 0) { parentComponent = {}; }
        var _this = _super.call(this, node, kmv) || this;
        _this.childrenVdom = [];
        _this.nextSibling = node.nextSibling;
        _this.parentNode = node.parentNode;
        _this.tagName = node.tagName;
        _this.templateNode = node;
        _this.isList = true;
        var forString = node.getAttribute("k-for");
        var match = constant_1.RegexpStr.forStatement.exec(forString);
        _this.forObjectKey = match[2].trim(); // 循环的键 item in arr 的 arr
        _this.forKey = match[1].trim(); // 循环的key值 item in arr 的 item
        _this.node = node;
        // 组件用组件的数据，否则用原始数据
        var srcData = object_1.isNull(parentComponent) ? kmv.data : parentComponent['$data'];
        var iteratorData = object_1.getDotVal(srcData, _this.forObjectKey);
        if (Array.isArray(iteratorData)) {
            _this.$data = array_1.depCopyArray(iteratorData);
        }
        else {
            _this.$data = object_1.depCopy(iteratorData);
        }
        _this.isComponent = true;
        return _this;
    }
    ForDOM.prototype.renderInit = function (data, kmv) {
        var docFrag = this.transDOM(data, kmv);
        this.$dom = docFrag.firstChild;
        this.insertNewDOM(docFrag);
        DomOp.removeNode(this.node);
    };
    ForDOM.prototype.transDOM = function (data, kmv) {
        var iteratorData = object_1.getDotVal(data, this.forObjectKey);
        var docFrag = document.createDocumentFragment();
        // 组件的话拼接
        if (Array.isArray(this.$data)) {
            // 数组循环
            // this.$data = iteratorData.slice(0);
            for (var i = 0; i < this.$data.length; i++) {
                var iteratorObj = Object.create(data); // 构造遍历的对象
                iteratorObj[this.forKey] = this.$data[i];
                // 第三个参数传递给组件的对象
                var forItem = new ForItemDOM_1.ForItemDOM(this.templateNode.cloneNode(true), kmv, iteratorObj);
                this.childrenVdom.push(forItem);
                var forItemDom = forItem.transDOM(iteratorObj, kmv);
                docFrag.appendChild(forItemDom);
            }
        }
        else if (typeof iteratorData === 'object') {
            // 对象循环
            this.$data = iteratorData;
            for (var i in iteratorData) {
                var forItem = new ForItemDOM_1.ForItemDOM(this.templateNode, kmv, data);
                this.childrenVdom.push(forItem);
                var iteratorObj = Object.create(data); // 构造遍历的对象
                iteratorObj[this.forKey] = this.$data[i];
                var forItemDom = forItem.transDOM(iteratorObj, kmv);
                docFrag.appendChild(forItemDom);
            }
        }
        return docFrag;
    };
    ForDOM.prototype.insertNewDOM = function (docFrag) {
        if (this.nextSibling) {
            DomOp.insertBefore(this.nextSibling, docFrag);
        }
        else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, docFrag);
        }
    };
    ForDOM.prototype.reRender = function (data, kmv, component) {
        if (component === void 0) { component = null; }
        var arrKey = this.forObjectKey;
        var newDatas = object_1.getDotVal(data, arrKey); // 获取新的数据集合
        if (Array.isArray(this.$data)) {
            var change = array_1.diff(this.$data, newDatas);
            if (change.length) {
                this.notifyDataChange(change, kmv, newDatas, component);
                this.$data = array_1.depCopyArray(newDatas);
            }
            else {
                for (var i = 0, len = this.$data.length; i < len; i++) {
                    var iteratorObj = Object.create(data); // data
                    iteratorObj[this.forKey] = this.$data[i];
                    this.childrenVdom[i] && this.childrenVdom[i].reRender(iteratorObj, kmv, component);
                }
            }
        }
        else if (typeof newDatas === 'object') {
            // 渲染对象
            var idx = 0;
            for (var key in this.$data) {
                var iteratorObj = Object.create(data);
                iteratorObj[this.forKey] = this.$data[key];
                this.childrenVdom[idx].reRender(iteratorObj, kmv);
                idx++;
            }
        }
    };
    ForDOM.prototype.notifyDataChange = function (change, kmv, newDatas, component) {
        if (Array.isArray(this.$data)) {
            for (var i = 0; i < change.length; i++) {
                var op = change[i].op;
                if (change[i].batch) {
                    switch (op) {
                        case constant_1.ArrayOp.PUSH:
                            this.batchAdd(change[i].array, kmv, component);
                            break;
                    }
                }
                else {
                    switch (op) {
                        case constant_1.ArrayOp.PUSH:
                            this.addNewItem(change[i].text, kmv);
                            break;
                        case constant_1.ArrayOp.POP:
                            this.popItem();
                            break;
                        case constant_1.ArrayOp.CHANGE:
                            this.changeItem(change[i].index, kmv, newDatas, component);
                            break;
                        case constant_1.ArrayOp.SHIFT:
                            this.shiftItem();
                            break;
                    }
                }
            }
        }
    };
    ForDOM.prototype.batchAdd = function (arr, kmv, component) {
        if (arr === void 0) { arr = []; }
        if (component === void 0) { component = null; }
        var docFrag = document.createDocumentFragment();
        for (var i = 0, len = arr.length; i < len; i++) {
            var iteratorObj = // 构造遍历的对象
             void 0; // 构造遍历的对象
            if (component) {
                iteratorObj = Object.create(component.$data);
            }
            else {
                iteratorObj = Object.create(kmv.data);
            }
            iteratorObj[this.forKey] = arr[i];
            var newItem = new ForItemDOM_1.ForItemDOM(this.templateNode, kmv, iteratorObj);
            this.childrenVdom.push(newItem);
            var newDom = newItem.transDOM(iteratorObj, kmv);
            docFrag.appendChild(newDom);
        }
        this.insertNewDOM(docFrag);
    };
    ForDOM.prototype.addNewItem = function (val, kmv) {
        var newItem = new ForItemDOM_1.ForItemDOM(this.templateNode, kmv);
        var iteratorObj = Object.create(kmv.data); // 构造遍历的对象
        iteratorObj[this.forKey] = val;
        var newDom = newItem.transDOM(iteratorObj, kmv);
        this.childrenVdom.push(newItem);
        this.insertNewDOM(newDom);
    };
    ForDOM.prototype.popItem = function () {
        var popVdom = this.childrenVdom.pop();
        popVdom.$dom && DomOp.removeNode(popVdom.$dom);
    };
    ForDOM.prototype.changeItem = function (i, kmv, newArray, component) {
        var iteratorObj;
        if (!object_1.isNull(component)) {
            iteratorObj = Object.create(component.$data);
        }
        else {
            iteratorObj = Object.create(kmv.data);
        }
        iteratorObj[this.forKey] = newArray[i];
        this.childrenVdom[i].reRender(iteratorObj, kmv);
    };
    ForDOM.prototype.shiftItem = function () {
        var shiftVdom = this.childrenVdom.shift();
        this.childrenVdom.shift();
        DomOp.removeNode(shiftVdom.$dom);
    };
    return ForDOM;
}(VDOM_1.VDOM));
exports.ForDOM = ForDOM;
//# sourceMappingURL=ForDOM.js.map