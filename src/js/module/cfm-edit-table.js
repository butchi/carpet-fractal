export default class CfmEditTable {
  constructor(opts = {}) {
    this.initialize(opts);
  }

  initialize(opts = {}) {
    let elm = this.elm = opts.elm;

    $(elm).on('change', '[data-js-class="generator"]', (evt) => {
      $(elm).trigger('table-change', {
        generator: this.readTable(),
      });
    });
  }

  readTable() {
    var arr = new Array();
    var tblWidth = 4;
    var tblHeight = 4;
    var inputArr = this.elm.querySelectorAll('[data-js-class="generator"]');

    for(let j = 0; j < tblHeight; j++) {
      arr[j] = new Array();
      for(let i = 0; i < tblWidth; i++) {
        arr[j][i] = (inputArr[j * tblWidth + i].checked) ? 1 : 0;
      }
    }

    return arr;
  }
}
