import CarpetFractal from './carpet-fractal';
import FractalAudio from './fractal-audio';
import CfmEditTable from './cfm-edit-table';

export default class IndexMain {
  constructor(opts = {}) {
    this.initialize(opts);
  }

  initialize(opts) {
    this.canvasWrapper = document.querySelector('.canvas');
    this.canvasElm = this.canvasWrapper.querySelector('canvas');

    this.w = 243;
    this.h = 243;

    this.canvasElm.width = this.w;
    this.canvasElm.height = this.h;

    this.fractalAudio = new FractalAudio();

    let cfmEditTable = this.cfmEditTable = new CfmEditTable({
      elm: document.querySelector('.cfm-edit-table'),
      w: 3,
      h: 3,
    });

    $(cfmEditTable.elm).on('table-change', (evt, opts = {}) => {
      let generator = opts.generator;

      this.updateCarpet({
        generator,
      });
    });
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
