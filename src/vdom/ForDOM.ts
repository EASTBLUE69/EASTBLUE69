import { ForItemDOM } from './ForItemDOM'
import { RegexpStr, ArrayOp } from '../constants/constant'
import { getDotVal, depCopy, isNull } from "../util/object"
import * as DomOp from "../dom/domOp"
import {diff, depCopyArray} from "../util/array";
import {isUnknowElement} from "../util/validator";
import {ComponentDOM} from "./ComponentDOM";
import { VDOM } from "./VDOM";

export class ForDOM extends VDOM {
    nextSibling;        // 后一个元素
    templateNode;       // 模板节点, 共列表元素使用
    parentNode;         // 父节点
    childrenVdom = [];
    forObjectKey;   // arr
    forKey;         // i
    tagName;
    $data;          // 存放遍历的数据，下次比较
    $dom;           // 对应的真实dom
    isList;
    node;
    isComponent;
    // 第三个参数组件用的
    constructor (node, kmv, parentComponent = {}) {
        super(node, kmv);
        this.nextSibling = node.nextSibling;
        this.parentNode = node.parentNode;
        this.tagName = node.tagName;
        this.templateNode = node;
        this.isList = true;
        let forString = node.getAttribute("k-for");
        let match = RegexpStr.forStatement.exec(forString);
        this.forObjectKey = match[2].trim();        // 循环的键 item in arr 的 arr
        this.forKey = match[1].trim();              // 循环的key值 item in arr 的 item
        this.node = node;
        // 组件用组件的数据，否则用原始数据
        let srcData = isNull(parentComponent) ? kmv.data: parentComponent['$data'];
        let iteratorData = getDotVal(srcData, this.forObjectKey);
        if (Array.isArray(iteratorData)) {
            this.$data = depCopyArray(iteratorData);
        } else {
            this.$data  = depCopy(iteratorData);
        }
        this.isComponent = true;
    }
    renderInit(data, kmv) {
        let docFrag = this.transDOM(data, kmv);
        this.$dom = docFrag.firstChild;
        this.insertNewDOM(docFrag);
        DomOp.removeNode(this.node);
    }
    transDOM (data, kmv) {
        let iteratorData = getDotVal(data, this.forObjectKey);
        let docFrag = document.createDocumentFragment();
        // 组件的话拼接
        if (Array.isArray(this.$data)) {
            // 数组循环
            // this.$data = iteratorData.slice(0);
            for (let i = 0; i < this.$data.length; i++) {
                let iteratorObj = Object.create(data);     // 构造遍历的对象
                iteratorObj[this.forKey] = this.$data[i];
                // 第三个参数传递给组件的对象
                let forItem = new ForItemDOM(this.templateNode.cloneNode(true), kmv, iteratorObj);
                this.childrenVdom.push(forItem);
                let forItemDom = forItem.transDOM(iteratorObj, kmv);
                docFrag.appendChild(forItemDom);
            }
        } else if (typeof iteratorData === 'object') {
            // 对象循环
            this.$data = iteratorData;
            for (let i in iteratorData) {
                let forItem = new ForItemDOM(this.templateNode, kmv, data);
                this.childrenVdom.push(forItem);
                let iteratorObj = Object.create(data);     // 构造遍历的对象
                iteratorObj[this.forKey] = this.$data[i];
                let forItemDom = forItem.transDOM(iteratorObj, kmv);
                docFrag.appendChild(forItemDom);
            }
        }
        return docFrag;
    }
    insertNewDOM (docFrag) {
        if (this.nextSibling) {
            DomOp.insertBefore(this.nextSibling, docFrag);
        } else if (this.parentNode) {
            DomOp.appendChild(this.parentNode, docFrag);
        }
    }
    reRender (data, kmv, component: ComponentDOM = null) {
        let arrKey = this.forObjectKey;
        let newDatas = getDotVal(data, arrKey); // 获取新的数据集合
        if (Array.isArray(this.$data)) {
            let change = diff(this.$data, newDatas);
            if (change.length) {
                this.notifyDataChange(change, kmv, newDatas, component);
                this.$data = depCopyArray(newDatas);
            } else {
                for (let i = 0, len = this.$data.length; i < len; i++) {
                    let iteratorObj = Object.create(data);  // data
                    iteratorObj[this.forKey] = this.$data[i];
                    this.childrenVdom[i] && this.childrenVdom[i].reRender(iteratorObj, kmv, component);
                }
            }
        } else if (typeof newDatas === 'object'){
            // 渲染对象
            let idx = 0;
            for (let key in this.$data) {
                let iteratorObj = Object.create(data);
                iteratorObj[this.forKey] = this.$data[key];
                this.childrenVdom[idx].reRender(iteratorObj, kmv);
                idx++;
            }
        }
    }
    notifyDataChange (change, kmv, newDatas, component) {
        if (Array.isArray(this.$data)) {
            for (let i = 0; i < change.length; i++) {
                let op = change[i].op;
                if (change[i].batch) {
                    switch (op) {
                        case ArrayOp.PUSH:
                            this.batchAdd(change[i].array, kmv, component);
                            break;
                    }
                } else {
                    switch (op) {
                        case ArrayOp.PUSH:
                            this.addNewItem(change[i].text, kmv);
                            break;
                        case ArrayOp.POP:
                            this.popItem();
                            break;
                        case ArrayOp.CHANGE:
                            this.changeItem (change[i].index, kmv, newDatas, component)
                            break
                        case ArrayOp.SHIFT:
                            this.shiftItem();
                            break;
                    }
                }
            }
        }
    }
    batchAdd (arr = [], kmv, component: ComponentDOM = null) {
        let docFrag = document.createDocumentFragment();
        for (let i = 0, len = arr.length; i < len; i++) {
            let iteratorObj;     // 构造遍历的对象
            if (component) {
                iteratorObj = Object.create(component.$data);
            } else {
                iteratorObj = Object.create(kmv.data);
            }
            iteratorObj[this.forKey] = arr[i];
            let newItem = new ForItemDOM(this.templateNode, kmv, iteratorObj);
            this.childrenVdom.push(newItem);
            let newDom = newItem.transDOM(iteratorObj, kmv);
            docFrag.appendChild(newDom);
        }
        this.insertNewDOM(docFrag)
    }
    addNewItem (val, kmv) {
        let newItem = new ForItemDOM(this.templateNode, kmv);
        let iteratorObj = Object.create(kmv.data);     // 构造遍历的对象
        iteratorObj[this.forKey] = val;
        let newDom = newItem.transDOM(iteratorObj, kmv);
        this.childrenVdom.push(newItem);
        this.insertNewDOM(newDom);
    }
    popItem () {
        let popVdom = this.childrenVdom.pop();
        popVdom.$dom && DomOp.removeNode(popVdom.$dom);
    }
    changeItem (i, kmv, newArray, component) {
        let iteratorObj;
        if (!isNull(component)) {
            iteratorObj = Object.create(component.$data);
        } else {
            iteratorObj = Object.create(kmv.data);
        }
        iteratorObj[this.forKey] = newArray[i];
        this.childrenVdom[i].reRender(iteratorObj, kmv);
    }
    shiftItem () {
        let shiftVdom = this.childrenVdom.shift();
        this.childrenVdom.shift();
        DomOp.removeNode(shiftVdom.$dom);
    }
}