import Table from './table'

export default class CarpetFractal {
  constructor(optLi = {}) {
    this.initialize(optLi)
  }

  initialize(optLi) {
    const canvasElm = optLi.canvasElm

    this.generator = new Table({
      arr: optLi.generator,
    })

    this.func = optLi.func || ((a, b) => {
      return a && b
    })

    this.colorFunc = optLi.colorFunc || ((v) => {
      const tmp = 255 - 255 * v
      return [tmp, tmp, tmp]
    })

    this.w = optLi.w
    this.h = optLi.h

    this.iterateNum = Math.ceil(Math.min(Math.log(this.w) / Math.log(this.generator.w), Math.log(this.h) / Math.log(this.generator.h)))

    const ctx = canvasElm.getContext('2d')
    const imageData = ctx.createImageData(this.w, this.h)

    this.initCarpet()

    this.generateCarpet()

    let i = 0
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const rgbArr = this.colorFunc(this.carpet[y][x])
        imageData.data[i + 0] = rgbArr[0]
        imageData.data[i + 1] = rgbArr[1]
        imageData.data[i + 2] = rgbArr[2]
        imageData.data[i + 3] = 255
        i += 4
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  initCarpet() {
    this.carpet = new Array(this.h)
    for (let y = 0; y < this.w; y++) {
      this.carpet[y] = new Array(this.w).fill(0)
    }
  }

  generateCarpet() {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        this.carpet[y][x] = this.iterate(x, y)
      }
    }
  }

  iterate(x, y) {
    let tmp = 1

    for (let i = 0; i < this.iterateNum; i++) {
      const val = this.generator.getElm({
        x,
        y,
        scaleX: Math.pow(this.generator.w, i),
        scaleY: Math.pow(this.generator.h, i),
      })

      tmp = this.func(tmp, val)
    }

    return tmp
  }
}
