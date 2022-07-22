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
var object_1 = require("../util/object");
var VDOM_1 = require("./VDOM");
var InputDOM = /** @class */ (function (_super) {
    __extends(InputDOM, _super);
    function InputDOM(node) {
        var _this = _super.call(this, node) || this;
        _this.childrenVdom = [];
        _this.tagName = node.tagName;
        _this.attributes = node.attributes;
        _this.nodeType = node.nodeType;
        _this.kmodel = node.getAttribute("k-model");
        _this.$dom = node;
        node.removeAttribute("k-model");
        return _this;
    }
    InputDOM.prototype.renderInit = function (data, kmv) {
        var _this = this;
        this.$dom.value = object_1.getDotVal(data, this.kmodel);
        this.$dom.oninput = function (ev) {
            object_1.setObserveDotVal(data, _this.kmodel, _this.$dom.value);
        };
        this.renderAttr(data, kmv, null);
    };
    InputDOM.prototype.reRender = function (data, kmv) {
        var text = object_1.getDotVal(data, this.kmodel);
        this.$dom.value = text;
        this.reRenderAttr(data, kmv, null);
    };
    return InputDOM;
}(VDOM_1.VDOM));
exports.InputDOM = InputDOM;
//# sourceMappingURL=InputDOM.js.map