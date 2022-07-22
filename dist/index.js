"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var render_1 = require("./util/render");
var observer_1 = require("./core/observer");
var RenderQueue_1 = require("./core/RenderQueue");
var event_1 = require("./util/event");
var object_1 = require("./util/object");
function Kmv(opts) {
    var elSelector = opts['el'];
    var elem = document.querySelector(elSelector);
    if (!elem) {
        console.error("元素" + elSelector + "不存在!");
        return;
    }
    this.data = opts.data;
    // 原始数据
    this.watch = opts.watch || {};
    this.pendingValue = false;
    this.changeQueue = []; // 每次循环改变队列
    this.methods = opts.methods; // 自定义事件
    this.components = object_1.extend(this.components, opts.components);
    this.mounted = typeof opts.mounted === 'function' ? opts.mounted : null;
    var that = this;
    if (opts.beforeInit) {
        var event_2 = new event_1.Event();
        // 初始化数据事件
        event_2.$once("initData", function (data) {
            var allData = object_1.extend(opts.data, data);
            observer_1.observer(allData, that);
            // 获取需要渲染的dom列表
            that.renderQueue = new RenderQueue_1.RenderQueue(elem, this);
            render_1.renderInit(that);
        });
        opts.beforeInit.call(that, event_2);
    }
    else {
        observer_1.observer(opts.data, this);
        // 获取需要渲染的dom列表
        this.renderQueue = new RenderQueue_1.RenderQueue(elem, this);
        render_1.renderInit(this);
    }
    this.mounted && this.mounted.call(this);
    return this;
}
Kmv.components = function (name, config) {
    if (!Kmv.prototype.components) {
        Kmv.prototype.components = {};
    }
    Kmv.prototype.components[name] = config;
};
window.Kmv = Kmv;
//# sourceMappingURL=index.js.map