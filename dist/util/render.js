"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderInit = function (kmv) {
    var watcher = kmv.renderQueue;
    var renderQueue = watcher.getQueue();
    for (var i = 0; i < renderQueue.length; i++) {
        var node = renderQueue[i];
        node.renderInit(kmv.data, kmv);
    }
    exports.nextTick(kmv);
};
var nextTickHandler = function (kmv) {
    if (kmv.pendingValue) {
        kmv.pendingValue = false;
        var lastOne = kmv.changeQueue.pop();
        lastOne && exports.reRender(lastOne.kmv, lastOne.bigKey);
        kmv.changeQueue.length = 0;
    }
    exports.nextTick(kmv);
};
exports.nextTick = function (kmv) {
    setTimeout(function () {
        // 下一次事件循环
        nextTickHandler(kmv);
    }, 0);
};
exports.reRender = function (kmv, key) {
    var renderQueue = kmv.renderQueue.getQueue();
    for (var i = 0; i < renderQueue.length; i++) {
        var node = renderQueue[i];
        node.reRender(kmv.data, kmv);
    }
};
//# sourceMappingURL=render.js.map