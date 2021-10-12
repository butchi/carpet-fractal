import ns from '../module/ns';
import IndexMain from '../module/index-main';

export default class Index {
  constructor(opts = {}) {
    this.initialize();
  }

  initialize() {
    console.log('index page');

    ns.indexMain = new IndexMain();
  }
}