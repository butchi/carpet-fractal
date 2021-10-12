export default class CfmEditTable {
  constructor(opts = {}) {
    this.initialize(opts);
  }

  initialize(opts = {}) {
    let elm = this.elm = opts.elm;

    let w = this.w = opts.w || 2;
    let h = this.h = opts.h || 2;

    this.updateTable();

    $(elm).on('change', '[data-js-class="generator"]', (evt) => {
      $(elm).trigger('table-change', {
        generator: this.readTable(),
      });
    });
  }

  updateTable(opts = {}) {
    let w = this.w;
    let h = this.h;

    let tableElm = this.elm.querySelector('[data-js-class="edit-table"]');
    tableElm.innerHTML = '';

    for (let y = 0; y < h; y++) {
      let trElm = document.createElement('tr');
      for (let x = 0; x < w; x++) {
        let tdElm = document.createElement('td');
        let inputElm = document.createElement('input');
        inputElm.setAttribute('type', 'checkbox');
        inputElm.setAttribute('data-js-class', 'generator');

        tdElm.append(inputElm);
        trElm.append(tdElm)
      }

      tableElm.append(trElm);
    }
  }

  readTable() {
    var arr = new Array();
    var tblWidth = this.w;
    var tblHeight = this.h;
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
