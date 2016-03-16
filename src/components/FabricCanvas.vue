<template>
  <div id="FabricCanvas">
    <canvas id="c"></canvas>
    <div id="canvas-funtion">
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" id="mode" v-on:click="changeMode(canvas)">Change Mode</button>
      <input type="file" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" id="upload" v-on:change="upload(canvas)">
    </div>
  </div>
</template>

<script>
import fabric from 'fabric'

export default {
  data() {
    return {
      canvas: null,
    }
  },
  methods: {
    changeMode: (canvas) => {
      canvas.isDrawingMode = !canvas.isDrawingMode;
    },
    upload: (canvas) => {
      const reader = new FileReader();
      const file = document.getElementById('upload').files[0];
      reader.onload = (e) => {
        fabric.Image.fromURL(reader.result, (img) => {
          canvas.add(img);
          canvas.renderAll();
        });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  },
  ready() {
    this.canvas = new fabric.Canvas('c', {isDrawingMode: true});
    this.canvas.setDimensions({width: window.innerWidth, height:window.innerHeight});
    this.canvas.setBackgroundColor('grey');
    this.canvas.renderAll();
  }
}
</script>
<style>
canvas {
  display: block;
}
#canvas-funtion {
  position: fixed;
  top: 0;
  right: 0;
}
</style>
