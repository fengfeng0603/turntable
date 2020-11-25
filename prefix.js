// 添加兼容性前缀等（transition相关）
let cssPrefix
let eventPrefix
let vendors = {
  '': '',
  Webkit: 'webkit',
  Moz: '',
  O: 'o',
  ms: 'ms'
}
let testEle = document.createElement('p')
console.log(testEle.style, 'ddddd')

Object.keys(vendors).some(function (vendor) {
  // transition
  if (
    testEle.style[vendor + (vendor ? 'T' : 't') + 'ransitionProperty'] !==
    undefined
  ) {
    cssPrefix = vendor ? '-' + vendor.toLowerCase() + '-' : ''
    eventPrefix = vendors[vendor]
    return true
  }
})

/**
 * [兼容css前缀] transition
 */
export function normalizeCss (property) {
  //  css  可以使用 -webkit-transform 方式获取，设置 dom属性
  let str = property.toLowerCase()
  return cssPrefix ? cssPrefix + str : str
}

/**
 * [兼容事件前缀]
 */
export function normalizeEvent (name) {
  //  name 首字母请大写
  return eventPrefix ? eventPrefix + name : name.toLowerCase()
}

// ios 存在问题 style中有clip-path,但不支持此写法，强制多写个-webkit-clip-path
let clipPathPrefix
Object.keys(vendors).some(function (vendor) {
  // clip-path相关 clipPath
  if (testEle.style[vendor + (vendor ? 'C' : 'c') + 'lipPath'] !== undefined) {
    clipPathPrefix = vendor ? '-' + vendor.toLowerCase() + '-clip-path' : 'clip-path'
    return true
  }
})
/**
 * [兼容clipPath前缀]
 */
export const clipPath = clipPathPrefix
