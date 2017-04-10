import CarpetFractal from './carpet-fractal';
import FractalAudio from './fractal-audio';

export default class IndexMain {
  constructor(opts = {}) {
    this.initialize(opts);
  }

  initialize(opts) {
    this.canvasWrapper = document.querySelector('.canvas');
    this.canvasElm = this.canvasWrapper.querySelector('canvas');

    this.w = 256;
    this.h = 256;

    this.canvasElm.width = this.w;
    this.canvasElm.height = this.h;

    this.fractalAudio = new FractalAudio();

    document.querySelectorAll('input.generator').forEach((elm) => {
      elm.addEventListener('change', (evt) => {
        this.updateCarpet({
          generator: this.readTable(),
        });
      });
    });
  }

  readTable() {
    var arr = new Array();
    var tblWidth = 4;
    var tblHeight = 4;
    var inputArr = document.querySelectorAll('input.generator');

    for(let j = 0; j < tblHeight; j++) {
      arr[j] = new Array();
      for(let i = 0; i < tblWidth; i++) {
        arr[j][i] = (inputArr[j * tblWidth + i].checked) ? 1 : 0;
      }
    }

    return arr;
  }

  updateCarpet(opts = {}) {
    this.carpetFractal = new CarpetFractal({
      canvasElm: this.canvasElm,
      generator: opts.generator,
      func: (a, b) => {
        return a & b;
      },
      colorFunc: (v) => {
        var tmp = 255 - 255 * v;
        return [tmp, tmp, tmp];
      },
      w: this.w,
      h: this.h,
    });

    this.fractalAudio.pause();
    this.fractalAudio.play(this.carpetFractal.carpet);
  }
}
