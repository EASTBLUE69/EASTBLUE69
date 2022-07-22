"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event = /** @class */ (function () {
    function Event() {
        var _this = this;
        this.eventObject = {};
        this.$on = function (event, fn) {
            _this.eventObject[event] = {
                fn: fn,
                once: false
            };
        };
        this.$once = function (event, fn) {
            _this.eventObject[event] = {
                fn: fn,
                once: true
            };
        };
        this.$emit = function (event, params) {
            var thisEvent = _this.eventObject[event];
            if (thisEvent) {
                if (thisEvent.once) {
                    thisEvent['fn'].apply(_this, [].concat(params));
                    delete _this.eventObject[event];
                }
                else {
                    thisEvent['fn'].apply(_this, [].concat(params));
                }
            }
        };
    }
    return Event;
}());
exports.Event = Event;
//# sourceMappingURL=event.js.map