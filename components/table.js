export default class Table {
  constructor (optLi = {}) {
    this.initialize(optLi)
  }

  initialize (optLi) {
    this.arr = optLi.arr || [[0]]

    this.w = this.arr.length
    this.h = this.arr[0].length
  }

  getElm (optLi) {
    const scaleX = optLi.scaleX || 1
    const scaleY = optLi.scaleY || 1
    const x = optLi.x || 0
    const y = optLi.y || 0

    const ret = this.arr[Math.floor((y / scaleY) % this.h)][Math.floor((x / scaleX) % this.w)]

    return ret
  }
}
