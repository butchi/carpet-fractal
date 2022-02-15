export default class CfmEditTable {
  constructor (optLi = {}) {
    this.initialize(optLi)
  }

  initialize (optLi) {
    const elm = this.elm = optLi.elm

    this.w = this.w = optLi.w || 2
    this.h = this.h = optLi.h || 2

    this.updateTable()

    $(elm).on('change', '[data-js-class="generator"]', (_evt) => {
      $(elm).trigger('table-change', {
        generator: this.readTable(),
      })
    })
  }

  updateTable (_optLi = {}) {
    const w = this.w
    const h = this.h

    const tableElm = this.elm.querySelector('[data-js-class="edit-table"]')
    tableElm.innerHTML = ''

    for (let y = 0; y < h; y++) {
      const trElm = document.createElement('tr')

      for (let x = 0; x < w; x++) {
        const tdElm = document.createElement('td')
        const inputElm = document.createElement('input')
        inputElm.setAttribute('type', 'checkbox')
        inputElm.setAttribute('data-js-class', 'generator')

        tdElm.append(inputElm)
        trElm.append(tdElm)
      }

      tableElm.append(trElm)
    }
  }

  readTable () {
    const arr = []
    const tblWidth = this.w
    const tblHeight = this.h
    const inputArr = this.elm.querySelectorAll('[data-js-class="generator"]')

    for (let j = 0; j < tblHeight; j++) {
      arr[j] = []
      for (let i = 0; i < tblWidth; i++) {
        arr[j][i] = (inputArr[j * tblWidth + i].checked) ? 1 : 0
      }
    }

    return arr
  }
}
