import { compileTpl } from '../util/template'
import { createComment } from '../dom/domOp'
import { NodeType, RegexpStr } from "../constants/constant"
import { isKvmAttribute } from '../util/validator'
import { bindEvent } from "../dom/event"
import { getDotVal } from "../util/object"
import * as DomOp from '../dom/domOp'
import {isNull} from "../util/object";

export class VDOM {
    nodeType;
    $dom;
    attributes;
    nextSibling;
    parentNode;
    childrenVdom = [];
    kshow;
    kif;
    isComponent = false;
    $emptyComment = createComment('');   // 空白注释, 替换kif dom
    constructor (node, kmv = {}) {
        // @ts-ignore
        node.attributes && (this.attributes = [].slice.call(node.attributes).slice(0));
        if (node.nodeType === NodeType.ELEMENT) {
            this.kshow = node.getAttribute("k-show");
            this.kif = node.getAttribute("k-if");
        }
        this.nextSibling = node.nextSibling;
        this.parentNode = node.parentNode;
    }
    // 传递组件对象, 组件私有方法
    renderAttr (data, kmv, component: any = {}) {
        if (this.nodeType === NodeType.ELEMENT) {
            let node = this.$dom;
            let attrs = this.attributes;
            for (let i = 0; i < attrs.length; i++) {
                let attr = attrs[i];
                let attrName = attr.nodeName, attrVal = attr.nodeValue;
                // @ts-ignore
                if (RegexpStr.kAttribute.test(attrName)) {
                    let key = attr.nodeName.replace(RegexpStr.kAttribute, '$1');
                    if (key === 'class') {
                        // 类 a:'class2', b:'class2'
                        let arr = attrVal.split(",");
                        let valRes = "";
                        for (var n = 0; n < arr.length; n++) {
                            var ak = arr[n].split(":")[0];
                            if (getDotVal(data, ak.trim())) {
                                valRes += arr[n].split(":")[1].trim() + " ";
                            }
                        }
                        // @ts-ignore
                        node.setAttribute(key, valRes.trim());
                    } else {
                        let val = compileTpl(attrVal, data);
                        node.setAttribute(key, val);
                    }
                } else { // @ts-ignore
                    // @ts-ignore
                    if (RegexpStr.kOnAttribute.test(attrName)) {
                                        let event = attrName.replace(RegexpStr.kOnAttribute, '$1');
                                        let func = compileTpl(attrVal, data);
                                        let match = func.match(RegexpStr.methodAndParam);
                                        let method = match[1];
                                        let params = match[2];
                                        let paramsArr = params.split(",")
                                        for (var n = 0; n < paramsArr.length; n++) {
                                            if (paramsArr[n] === 'this') {
                                                paramsArr[n] = this.$dom;
                                            } else {
                                                // @ts-ignore
                                                paramsArr[n] = String(paramsArr[n]).trim();
                                            }
                                        }
                                        if (!isNull(component)) {
                                            bindEvent(node, event, method, paramsArr, component.methods, component.$data);
                                        } else {
                                            bindEvent(node, event, method, paramsArr, kmv.methods, kmv.data);
                                        }
                                        node.removeAttribute(attrName);
                                    } else {
                                        node.setAttribute(attrName, attrVal);
                                    }
                }
                if (this.kshow) {
                    let isShow = getDotVal(data, this.kshow);
                    this.$dom.style.display = !!isShow ? "block" : "none";
                }
                if (this.kif) {
                    let isIf = getDotVal(data, this.kif);
                    if (!isIf) DomOp.replaceNode(this.$dom, this.$emptyComment);
                    else DomOp.replaceNode(this.$emptyComment, this.$dom)
                }
            }
        }
    }
    reRenderAttr (data, kmv, component: any = {}) {
        let node = this.$dom;
        for (let i = 0; i < this.attributes.length; i++) {
            let attr = this.attributes[i];
            let attrName = attr.nodeName, attrVal = attr.nodeValue;
            if (isKvmAttribute(attrName)) {
                // @ts-ignore
                if (RegexpStr.kAttribute.test(attrName)) {
                    let key = attr.nodeName.replace(RegexpStr.kAttribute, '$1');
                    if (key === 'class') {
                        // 类 a:'class2', b:'class2'
                        let arr = attrVal.split(",");
                        let valRes = "";
                        for (var n = 0; n < arr.length; n++) {
                            var ak = arr[n].split(":")[0];
                            if (getDotVal(data, ak.trim())) {
                                valRes += arr[n].split(":")[1].trim() + " ";
                            }
                        }
                        // @ts-ignore
                        node.setAttribute(key, valRes.trim());
                        node.removeAttribute(attrName);
                    } else {
                        let newVal = compileTpl(attrVal, data);
                        let oldVal = node.getAttribute(key);
                        newVal !== oldVal && node.setAttribute(key, newVal);
                        node.removeAttribute(attrName);
                    }
                } else {
                    let newVal = compileTpl(attrVal, data);
                    let oldVal = node.getAttribute(attrName);
                    newVal !== oldVal && node.setAttribute(attrName, newVal);
                }
            } else { // @ts-ignore
                // @ts-ignore
                if (RegexpStr.kOnAttribute.test(attrName)) {
                                node.removeAttribute(attrName);
                            } else {
                                node.setAttribute(attrName, attrVal);
                            }
            }
        }
        if (!isNull(component)) {
            if (this.kshow) {
                let isShow = getDotVal(component.$data, this.kshow);
                this.$dom.style.display = !!isShow ? "block" : "none";
            }
            if (this.kif) {
                let isIf = getDotVal(component.$data, this.kif);
                if (!isIf) DomOp.replaceNode(this.$dom, this.$emptyComment);
            }
        } else {
            if (this.kshow) {
                let isShow = getDotVal(data, this.kshow);
                this.$dom.style.display = !!isShow ? "block" : "none";
            }
            if (this.kif) {
                let isIf = getDotVal(data, this.kif);
                if (!isIf) DomOp.replaceNode(this.$dom, this.$emptyComment);
                else DomOp.replaceNode(this.$emptyComment, this.$dom);
            }
        }
    }
}