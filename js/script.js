window.licker = window.licker || {};
((ns) => {
  const SAMPLING_RATE = 8000;

  class Main {
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

  class Table {
    constructor(opts = {}) {
      this.initialize(opts);
    }

    initialize(opts = {}) {
      this.arr = opts.arr || [[0]];

      this.w = this.arr.length;
      this.h = this.arr[0].length;
    }

    getElm(opts = {}) {
      var ret;
      var scaleX = opts.scaleX || 1;
      var scaleY = opts.scaleY || 1;
      var x = opts.x || 0;
      var y = opts.y || 0;

      ret = this.arr[Math.floor((y / scaleY) % this.h)][Math.floor((x / scaleX) % this.w)];

      return ret;
    }
  }

  class CarpetFractal {
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

  // from http://jsdo.it/butchi/carpet_fractal_music
  class FractalAudio {
    constructor(opts = {}) {
      this.initialize(opts);
    }

    initialize(opts = {}) {
      this.connected = false;

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.sampleRate = this.audioCtx.sampleRate
      this.node = this.audioCtx.createScriptProcessor(1024, 1, 1);

      this.t = 0;

      this.node.addEventListener('audioprocess', (evt) => {
        this.process(evt);
      });
    }

    process(evt) {
      var h = this.arr.length;
      var w = this.arr[0].length;

      var data = evt.outputBuffer.getChannelData(0);

      for (var i = 0; i < data.length; ++i) {
        let t = Math.floor(this.t * SAMPLING_RATE / this.sampleRate) % (w * h);
        data[i] = this.arr[Math.floor(t / w)][t % w];

        this.t++;
      }
    }

    play(arr){
      this.arr = arr;

      this.node.connect(this.audioCtx.destination);
    }

    pause() {
      this.node.disconnect();
    }
  }

  ns.main = new Main();
})(licker);
