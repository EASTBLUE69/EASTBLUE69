/**
 * Created by Jason Woo on 2022/7/13.
 */
import { RegexpStr } from '../constants/constant'
import { compileTpl } from '../util/template'
import { isKvmAttribute } from '../util/validator'
import { bindEvent } from "./event";

export let insertAfter = (node, newNode) => {
    node && node.parentNode && node.parentNode.insertBefore(newNode, node.nextSibling);
}

export let appendChild = (parent, child) => {
    parent && child && (parent.appendChild(child));
}

export let createTextNode = (text) => {
    return document.createTextNode(text);
}

export let createComment = (text) => {
    return document.createComment(text);
}

export let replaceNode = (oldNode, newNode) => {
    oldNode.parentNode && oldNode.parentNode.replaceChild(newNode, oldNode);
}

export let createElement = (tagName) => {
    return document.createElement(tagName);
}

export let insertBefore = (node, newNode) => {
    node && node.parentNode && node.parentNode.insertBefore(newNode, node);
}

export let deleteNode = (parent, node) => {
    parent && node && parent.removeChild(node);
}

export let changeNodeValue = (node, text) => {
    node && node.firstChild && (node.firstChild.nodeValue = text);
}

export let changeTextContent = (textNode, text) => {
    textNode && (textNode.textContent = text);
}

export let getTextContent = (textNode) => {
    return textNode && textNode.textContent;
}

export let removeAttribute = (node, attr) => {
    node && node.removeAttribute(attr);
}

export let findIteratorNode = (parentNode, key) => {
    let childrens = parentNode.childNodes;
    let iteratorNodes = [];
    for (let i = 0; i < childrens.length; i++) {
        let node = childrens[i];
        if (node.forString && node.forKey && node.forKey == key) {
            iteratorNodes.push(node);
        }
        if (node.childNodes.length) {
            iteratorNodes.concat(findIteratorNode(node, key));
        }
    }
    return iteratorNodes;
}

export let hideNode = (node) => {
    node.style.display = "none";
}

export let showNode = (node) => {
    node.style.display = "block";
}

export let removeNode = (node) => {
    node && node.parentNode && node.parentNode.removeChild(node);
}

