import { RegexpStr } from '../constants/constant'

export let isBraceReg = (str: string) => {
    return RegexpStr.brace.test(str);
}

/**
 *  是否有包含语法
 * @param str
 */
export let isForStatement = (str: string) => {
    return RegexpStr.forStatement.test(str);
}


export let isKvmAttribute = (key) => {
    return RegexpStr.arrtibuteKey.test(key);
}

export let isUnknowElement = (tag) => {
    let el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
        return (
            el.constructor === (<any>window).HTMLUnknownElement ||
            el.constructor === (<any>window).HTMLElement
        )
    } else {
        return /HTMLUnknownElement/.test(el.toString())
    }
}