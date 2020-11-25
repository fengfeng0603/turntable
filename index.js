import { normalizeCss, normalizeEvent, clipPath } from './prefix'

let transform = normalizeCss('transform')
let transition = normalizeCss('transition')
let transitionEnd = normalizeEvent('TransitionEnd')
let transformOrigin = normalizeCss('transform-origin')
class TurnTable {
  constructor (options) {
    let opt = {
      el: '',
      id: 'id', // 奖券的唯一标识key
      type: 'image', // 背景是一张图片，不需要渲染prize中数据
      prize: [] // 必传
    }
    this._color = [
      '#F8C131',
      'tomato',
      '#2B80F8',
      '#75D535',
      '#B6CCD2',
      '#E7EDF4'
    ]
    this._option = Object.assign(opt, options)
    this._$dom =
      typeof this._option.el === 'string'
        ? document.querySelector(this._option.el)
        : this._option.el
    this._ids2deg = {} // 根据Id，转盘
    this._deg = 0
    this._prize = this._option.prize
    this._lot = this._prize.length
    this._isBombing = false
  }

  _initIds2deg () {
    if (this._lot < 2) {
      throw new Error('奖项最少两个')
    }
    // 计算id,及对应的需要旋转的角度
    this._ids2deg = this._option.prize.reduce((result, item, index) => {
      // 计算相应deg
      let deg = 360 - index * (360 / this._lot)

      if (typeof item === 'string' || typeof item === 'number') {
        result[item] = deg
      } else {
        result[item[this._option.id]] = deg
      }
      return result
    }, {})
  }

  _countDeg (id) {
    // 随即的正负误差，使转盘逼真
    let randomDeg = (Math.random() - 0.5) * (360 / this._lot - 30)
    return (
      this._deg +
      (360 - (this._deg % 360)) +
      360 * 10 +
      this._ids2deg[id] +
      randomDeg
    )
  }
  _initDisc () {
    // 非image情况下，执行 仅支持文字和图片,
    // 计算出矩形长和宽,百分百方式计算

    let d = 360 / this._lot / 2 // 要转换成弧度
    let hd = (d * Math.PI) / 180
    let w = Math.sin(hd) * 100 + '%'
    let h = (Math.cos(hd) * 100) / 2 + '%'
    let top = ((1 - Math.cos(hd)) / 2) * 100 + '%'
    for (let i = 0; i < this._lot; i++) {
      let $div = this._drawSector(w, h, top, i)
      $div.style[transform] = 'rotate(' + (i * 360) / this._lot + 'deg)'
      $div.style['-webkit-transform'] = 'rotate(' + (i * 360) / this._lot + 'deg)'
      //  因dom 的数量很少，忽略documentFragment
      this._$dom.appendChild($div)
    }
  }

  _drawSector (w, h, top, index) {
    let color = this._prize[index].color || this._color[index]
    let $div = document.createElement('div')
    $div.className = 'tt-sector'
    $div.style.cssText =
      transformOrigin +
      ':50% 100%;-webkit-transform-origin:50% 100%;position:absolute;width:' +
      w +
      ';height:' +
      h +
      ';top:' +
      top +
      ';left:0;right:0;margin:auto;background-color:' +
      color +
      ';' +
      clipPath +
      ':polygon(0 0, 100% 0, 50% 100%);-webkit-clip-path:polygon(0 0, 100% 0, 50% 100%); text-align:center;'
    let str =
      '<span class="tt-sector-text">' + this._prize[index].text + '</span>'
    str += '<div class="tt-sector-custom"></div>'
    $div.innerHTML = str

    return $div
  }

  _initStyle () {
    // $dom 添加transiition属性
    this._$dom.style[transition] = 'all 6s ease'
  }

  init () {
    this._hasInit = true
    this._initIds2deg()
    this._initStyle()
    if (this._option.type === 'auto') {
      this._initDisc()
    }
  }

  goBomb (id, cb) {
    if (!this._hasInit) {
      this.init()
    }
    if (this._isBombing) {
      console.error('请开奖后再点击')
      return
    }
    this._isBombing = true
    let deg = this._countDeg(id)
    this._deg = deg
    this._$dom.style[transform] = 'rotate(' + deg + 'deg)' // 此处用 字符串模板有问题 todo
    this._$dom.style['-webkit-transform'] = 'rotate(' + deg + 'deg)'
    let _callBack = () => {
      this._isBombing = false
      cb && cb()
      this._$dom.removeEventListener(transitionEnd, _callBack, false)
    }
    this._$dom.addEventListener(transitionEnd, _callBack, false)
  }
}

export default TurnTable
