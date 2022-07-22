"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAfter = function (node, newNode) {
    node && node.parentNode && node.parentNode.insertBefore(newNode, node.nextSibling);
};
exports.appendChild = function (parent, child) {
    parent && child && (parent.appendChild(child));
};
exports.createTextNode = function (text) {
    return document.createTextNode(text);
};
exports.createComment = function (text) {
    return document.createComment(text);
};
exports.replaceNode = function (oldNode, newNode) {
    oldNode.parentNode && oldNode.parentNode.replaceChild(newNode, oldNode);
};
exports.createElement = function (tagName) {
    return document.createElement(tagName);
};
exports.insertBefore = function (node, newNode) {
    node && node.parentNode && node.parentNode.insertBefore(newNode, node);
};
exports.deleteNode = function (parent, node) {
    parent && node && parent.removeChild(node);
};
exports.changeNodeValue = function (node, text) {
    node && node.firstChild && (node.firstChild.nodeValue = text);
};
exports.changeTextContent = function (textNode, text) {
    textNode && (textNode.textContent = text);
};
exports.getTextContent = function (textNode) {
    return textNode && textNode.textContent;
};
exports.removeAttribute = function (node, attr) {
    node && node.removeAttribute(attr);
};
exports.findIteratorNode = function (parentNode, key) {
    var childrens = parentNode.childNodes;
    var iteratorNodes = [];
    for (var i = 0; i < childrens.length; i++) {
        var node = childrens[i];
        if (node.forString && node.forKey && node.forKey == key) {
            iteratorNodes.push(node);
        }
        if (node.childNodes.length) {
            iteratorNodes.concat(exports.findIteratorNode(node, key));
        }
    }
    return iteratorNodes;
};
exports.hideNode = function (node) {
    node.style.display = "none";
};
exports.showNode = function (node) {
    node.style.display = "block";
};
exports.removeNode = function (node) {
    node && node.parentNode && node.parentNode.removeChild(node);
};
//# sourceMappingURL=domOp.js.map