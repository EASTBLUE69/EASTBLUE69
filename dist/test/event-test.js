"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("../util/event");
var event = new event_1.Event();
event.$on("change", function (msg) {
    console.log(msg);
});
event.$once("once", function (msg) {
    console.log(msg);
});
event.$emit("change", "what's your name");
event.$emit("change", "what's your name2");
event.$emit("once", "hello once");
event.$emit("once", "hello once");
//# sourceMappingURL=event-test.js.map