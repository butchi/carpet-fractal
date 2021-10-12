import Table from './table';

export default class CarpetFractal {
  constructor(opts = {}) {
    this.initialize(opts);
  }

  initialize(opts = {}) {
    var canvasElm = opts.canvasElm;

    this.generator = new Table({
      arr: opts.generator,
    });

    this.func = opts.func || ((a, b) => {
      return a && b;
    });

    this.colorFunc = opts.colorFunc || ((v) => {
      var tmp = 255 - 255 * v;
      return [tmp, tmp, tmp];
    });

    this.w = opts.w;
    this.h = opts.h;

    var ctx = canvasElm.getContext('2d');
    var imageData = ctx.createImageData(this.w, this.h);

    this.iterateNum = Math.ceil(Math.min(Math.log(this.w) / Math.log(this.generator.w), Math.log(this.h) / Math.log(this.generator.h)));

    this.initCarpet();

    this.generateCarpet();

    let i = 0;
    for(let y = 0; y < this.h; y++) {
      for(let x = 0; x < this.w; x++) {
        let rgbArr = this.colorFunc(this.carpet[y][x]);
        imageData.data[i]     = rgbArr[0];
        imageData.data[i + 1] = rgbArr[1];
        imageData.data[i + 2] = rgbArr[2];
        imageData.data[i + 3] = 255;
        i += 4;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  initCarpet() {
    this.carpet = new Array(this.h);
    for(let y = 0; y < this.w; y++) {
      this.carpet[y] = new Array(this.w).fill(0);
    }
  }

  generateCarpet() {
    for(let y = 0; y < this.h; y++) {
      for(let x = 0; x < this.w; x++) {
        this.carpet[y][x] = this.iterate(x, y);
      }
    }
  }

  iterate(x, y) {
    var tmp = 1;

    for(let i = 0; i < this.iterateNum; i++) {
      let val = this.generator.getElm({
        x: x,
        y: y,
        scaleX: Math.pow(this.generator.w, i),
        scaleY: Math.pow(this.generator.h, i),
      });

      tmp = this.func(tmp, val);
    }

    return tmp;
  }
}
