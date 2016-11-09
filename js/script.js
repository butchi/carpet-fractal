window.licker = window.licker || {};
((ns) => {
  const SAMPLING_RATE = 8000;

  const generator = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
  ];

  class Main {
    constructor(opts = {}) {
      this.initialize(opts);
    }

    initialize(opts) {
      var canvasWrapper = document.querySelector('.canvas');
      var canvasElm = canvasWrapper.querySelector('canvas');

      this.w = 243;
      this.h = 243;

      canvasElm.width = this.w;
      canvasElm.height = this.h;

      this.carpetFractal = new CarpetFractal({
        canvasElm: canvasElm,
        generator: generator,
        func: (a, b) => {
          return a + b;
        },
        w: this.w,
        h: this.h,
      });

      this.fractalAudio = new FractalAudio({
        arr: this.carpetFractal.carpet,
      });

      this.fractalAudio.play();
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
          let v = 256 - 32 * this.carpet[y][x];
          imageData.data[i]     = v;
          imageData.data[i + 1] = v;
          imageData.data[i + 2] = v;
          imageData.data[i + 3] = 255;
          i += 4;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    initCarpet() {
      // // method 1: failed
      // this.carpet = (new Array(this.h)).fill((new Array(this.w)).fill(0));

      // // method 2
      // this.carpet = (new Array(this.h)).fill(0);
      // this.carpet.forEach((_, i) => {
      //   this.carpet[i] =  (new Array(this.w)).fill(0);
      // });

      // // method 3
      // this.carpet = JSON.parse(JSON.stringify((new Array(this.h)).fill((new Array(this.w)).fill(0))));

      // method 4
      this.carpet = new Array(this.h);
      for(let y = 0; y < this.w; y++) {
        this.carpet[y] = new Array(this.w).fill(0);
      }
    }

    generateCarpet() {
      for(let y = 0; y < this.h - 5; y++) {
        for(let x = 0; x < this.w - 5; x++) {
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

      this.arr = opts.arr;

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

    play(){
      this.node.connect(this.audioCtx.destination);
    }

    pause() {
      this.node.disconnect();
    }
  }

  ns.main = new Main();
})(licker);
