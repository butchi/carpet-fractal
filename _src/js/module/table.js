export default class Table {
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
