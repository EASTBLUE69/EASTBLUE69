"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = function (url, opts, cb) {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for all new browsers
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { // code for IE5 and IE6
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var res = eval('(' + xmlhttp.responseText + ')');
                    cb(null, res);
                }
                else {
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }
    else {
        alert("Your browser does not support XMLHTTP.");
    }
};
//# sourceMappingURL=kajax.js.map