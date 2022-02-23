<template lang="pug">
div
  canvas(ref="canvas", style="height: 512px")
</template>

<script>
import CarpetFractal from "../components/carpet-fractal";
// import CfmEditTable from '../components/cfm-edit-table';

export default {
  mounted() {
    const canvasElm = this.$refs.canvas;

    const w = 4 ** 5;
    const h = 4 ** 5;

    const generator = [
      [1, 1, 1, 1],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [1, 1, 1, 1],
    ];

    const func = (a, b) => {
      return a && b;
    };

    const colorFunc = (v) => {
      const tmp = 255 - 255 * v;
      return [tmp, tmp, tmp];
    };

    canvasElm.width = w;
    canvasElm.height = h;

    const carpetFractal = new CarpetFractal({
      canvasElm,
      generator,
      func,
      colorFunc,
      w,
      h,
    });

    canvasElm.addEventListener("click", (_evt) => {
      const carpet = carpetFractal.carpet;

      const h = carpet.length;
      const w = carpet[0].length;

      const sampleRate = 8000;

      // [AudioBuffer - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/AudioBuffer)

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate,
      });

      // ステレオ
      const channelArr = 2;

      // AudioContextのサンプルレートで2秒間の空のステレオバッファを生成する
      // const frameCount = audioCtx.sampleRate * 2.0
      const frameCount = w * h;

      const myArrayBuffer = audioCtx.createBuffer(
        2,
        frameCount,
        audioCtx.sampleRate
      );

      let t = 0;

      // 実際のデータの配列を得る
      for (let i = 0; i < frameCount; i++) {
        for (let channel = 0; channel < channelArr; channel++) {
          const nowBuffering = myArrayBuffer.getChannelData(channel);

          nowBuffering[i] = carpet[Math.floor(t / w)][t % w];
        }

        t = (t + 1) % (w * h);
      }

      // AudioBufferSourceNodeを得る
      // これはAudioBufferを再生するときに使うAudioNodeである
      const source = audioCtx.createBufferSource();
      // AudioBufferSourceNodeにバッファを設定する
      source.buffer = myArrayBuffer;
      // AudioBufferSourceNodeを出力先に接続すると音声が聞こえるようになる
      source.connect(audioCtx.destination);
      // 音源の再生を始める
      source.start();
    });
  },
};
</script>
