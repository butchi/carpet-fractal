(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Router = require('./Router');

var _Router2 = _interopRequireDefault(_Router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
  function Main() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Main);

    console.log('Hello, world!');

    this.initialize();

    console.log('Thanks, world!');
  }

  _createClass(Main, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      $(function () {
        _this.router = new _Router2.default();
      });
    }
  }]);

  return Main;
}();

exports.default = Main;

},{"./Router":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ns = require('./ns');

var _ns2 = _interopRequireDefault(_ns);

var _Common = require('../page/Common');

var _Common2 = _interopRequireDefault(_Common);

var _Index = require('../page/Index');

var _Index2 = _interopRequireDefault(_Index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
  function Router() {
    _classCallCheck(this, Router);

    this.initialize();
  }

  _createClass(Router, [{
    key: 'initialize',
    value: function initialize() {
      var $body = $('body');

      this.pageCommon = new _Common2.default();

      if ($body.hasClass('page-index')) {
        this.pageIndex = new _Index2.default();
      }
    }
  }]);

  return Router;
}();

exports.default = Router;

},{"../page/Common":5,"../page/Index":6,"./ns":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SAMPLING_RATE = 8000;

var IndexMain = function () {
  function IndexMain() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, IndexMain);

    this.initialize(opts);
  }

  _createClass(IndexMain, [{
    key: 'initialize',
    value: function initialize(opts) {
      var _this = this;

      this.canvasWrapper = document.querySelector('.canvas');
      this.canvasElm = this.canvasWrapper.querySelector('canvas');

      this.w = 256;
      this.h = 256;

      this.canvasElm.width = this.w;
      this.canvasElm.height = this.h;

      this.fractalAudio = new FractalAudio();

      document.querySelectorAll('input.generator').forEach(function (elm) {
        elm.addEventListener('change', function (evt) {
          _this.updateCarpet({
            generator: _this.readTable()
          });
        });
      });
    }
  }, {
    key: 'readTable',
    value: function readTable() {
      var arr = new Array();
      var tblWidth = 4;
      var tblHeight = 4;
      var inputArr = document.querySelectorAll('input.generator');

      for (var j = 0; j < tblHeight; j++) {
        arr[j] = new Array();
        for (var i = 0; i < tblWidth; i++) {
          arr[j][i] = inputArr[j * tblWidth + i].checked ? 1 : 0;
        }
      }

      return arr;
    }
  }, {
    key: 'updateCarpet',
    value: function updateCarpet() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.carpetFractal = new CarpetFractal({
        canvasElm: this.canvasElm,
        generator: opts.generator,
        func: function func(a, b) {
          return a & b;
        },
        colorFunc: function colorFunc(v) {
          var tmp = 255 - 255 * v;
          return [tmp, tmp, tmp];
        },
        w: this.w,
        h: this.h
      });

      this.fractalAudio.pause();
      this.fractalAudio.play(this.carpetFractal.carpet);
    }
  }]);

  return IndexMain;
}();

exports.default = IndexMain;

var Table = function () {
  function Table() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Table);

    this.initialize(opts);
  }

  _createClass(Table, [{
    key: 'initialize',
    value: function initialize() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.arr = opts.arr || [[0]];

      this.w = this.arr.length;
      this.h = this.arr[0].length;
    }
  }, {
    key: 'getElm',
    value: function getElm() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var ret;
      var scaleX = opts.scaleX || 1;
      var scaleY = opts.scaleY || 1;
      var x = opts.x || 0;
      var y = opts.y || 0;

      ret = this.arr[Math.floor(y / scaleY % this.h)][Math.floor(x / scaleX % this.w)];

      return ret;
    }
  }]);

  return Table;
}();

var CarpetFractal = function () {
  function CarpetFractal() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CarpetFractal);

    this.initialize(opts);
  }

  _createClass(CarpetFractal, [{
    key: 'initialize',
    value: function initialize() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var canvasElm = opts.canvasElm;

      this.generator = new Table({
        arr: opts.generator
      });

      this.func = opts.func || function (a, b) {
        return a && b;
      };

      this.colorFunc = opts.colorFunc || function (v) {
        var tmp = 255 - 255 * v;
        return [tmp, tmp, tmp];
      };

      this.w = opts.w;
      this.h = opts.h;

      var ctx = canvasElm.getContext('2d');
      var imageData = ctx.createImageData(this.w, this.h);

      this.iterateNum = Math.ceil(Math.min(Math.log(this.w) / Math.log(this.generator.w), Math.log(this.h) / Math.log(this.generator.h)));

      this.initCarpet();

      this.generateCarpet();

      var i = 0;
      for (var y = 0; y < this.h; y++) {
        for (var x = 0; x < this.w; x++) {
          var rgbArr = this.colorFunc(this.carpet[y][x]);
          imageData.data[i] = rgbArr[0];
          imageData.data[i + 1] = rgbArr[1];
          imageData.data[i + 2] = rgbArr[2];
          imageData.data[i + 3] = 255;
          i += 4;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }
  }, {
    key: 'initCarpet',
    value: function initCarpet() {
      this.carpet = new Array(this.h);
      for (var y = 0; y < this.w; y++) {
        this.carpet[y] = new Array(this.w).fill(0);
      }
    }
  }, {
    key: 'generateCarpet',
    value: function generateCarpet() {
      for (var y = 0; y < this.h; y++) {
        for (var x = 0; x < this.w; x++) {
          this.carpet[y][x] = this.iterate(x, y);
        }
      }
    }
  }, {
    key: 'iterate',
    value: function iterate(x, y) {
      var tmp = 1;

      for (var i = 0; i < this.iterateNum; i++) {
        var val = this.generator.getElm({
          x: x,
          y: y,
          scaleX: Math.pow(this.generator.w, i),
          scaleY: Math.pow(this.generator.h, i)
        });

        tmp = this.func(tmp, val);
      }

      return tmp;
    }
  }]);

  return CarpetFractal;
}();

// from http://jsdo.it/butchi/carpet_fractal_music


var FractalAudio = function () {
  function FractalAudio() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, FractalAudio);

    this.initialize(opts);
  }

  _createClass(FractalAudio, [{
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.connected = false;

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.sampleRate = this.audioCtx.sampleRate;
      this.node = this.audioCtx.createScriptProcessor(1024, 1, 1);

      this.t = 0;

      this.node.addEventListener('audioprocess', function (evt) {
        _this2.process(evt);
      });
    }
  }, {
    key: 'process',
    value: function process(evt) {
      var h = this.arr.length;
      var w = this.arr[0].length;

      var data = evt.outputBuffer.getChannelData(0);

      for (var i = 0; i < data.length; ++i) {
        var t = Math.floor(this.t * SAMPLING_RATE / this.sampleRate) % (w * h);
        data[i] = this.arr[Math.floor(t / w)][t % w];

        this.t++;
      }
    }
  }, {
    key: 'play',
    value: function play(arr) {
      this.arr = arr;

      this.node.connect(this.audioCtx.destination);
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.node.disconnect();
    }
  }]);

  return FractalAudio;
}();

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * グローバル直下に変数を置かないよう、ネームスペースを切る。
 * ネームスペース以下の変数にアクセスしたいときは各クラスでこれをimportする
 */

window.App = window.App || {};
var ns = window.App;
exports.default = ns;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ns = require('../module/ns');

var _ns2 = _interopRequireDefault(_ns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Common = function () {
  function Common() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Common);

    this.initialize();
  }

  _createClass(Common, [{
    key: 'initialize',
    value: function initialize() {
      console.log('page common');

      this.setEnvClass();
    }
  }, {
    key: 'setEnvClass',
    value: function setEnvClass() {
      var $html = $('html');

      _ns2.default.isSp = false;
      _ns2.default.isPc = false;
      _ns2.default.isTab = false;

      if ($html.hasClass('is-sp')) {
        _ns2.default.isSp = true;
      }
      if ($html.hasClass('is-pc')) {
        _ns2.default.isPc = true;
      }
      if ($html.hasClass('is-tab')) {
        _ns2.default.isTab = true;
      }
    }
  }]);

  return Common;
}();

exports.default = Common;

},{"../module/ns":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ns = require('../module/ns');

var _ns2 = _interopRequireDefault(_ns);

var _indexMain = require('../module/index-main');

var _indexMain2 = _interopRequireDefault(_indexMain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Index = function () {
  function Index() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Index);

    this.initialize();
  }

  _createClass(Index, [{
    key: 'initialize',
    value: function initialize() {
      console.log('index page');

      _ns2.default.indexMain = new _indexMain2.default();
    }
  }]);

  return Index;
}();

exports.default = Index;

},{"../module/index-main":3,"../module/ns":4}],7:[function(require,module,exports){
'use strict';

var _ns = require('./module/ns');

var _ns2 = _interopRequireDefault(_ns);

var _Main = require('./module/Main');

var _Main2 = _interopRequireDefault(_Main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// エントリーポイント。indexからはライブラリとこれしか呼ばない

_ns2.default.main = new _Main2.default();

},{"./module/Main":1,"./module/ns":4}]},{},[7]);
