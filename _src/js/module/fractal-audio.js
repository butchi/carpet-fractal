import * as Settings from '../config';

// from http://jsdo.it/butchi/carpet_fractal_music
export default class FractalAudio {
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
      let t = Math.floor(this.t * Settings.SAMPLING_RATE / this.sampleRate) % (w * h);
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
