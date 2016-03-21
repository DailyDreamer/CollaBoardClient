<template>
  <div id="FabricCanvas">
    <canvas id="c"></canvas>
    <div id="canvas-funtion">
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored icon material-icons" id="mode" v-on:click="changeMode(canvas)">mode_edit</button>
      <div class="mdl-tooltip mdl-tooltip--right" for="mode">Select or write</div><br/>
      <div class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored icon mdl-button--file">
        <i class="material-icons">attach_file</i>
        <input type="file" id="upload" v-on:change="upload(canvas)">
      </div>
      <div class="mdl-tooltip mdl-tooltip--right" for="upload">Write a note</div><br/>
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
    changeMode: function() {
      this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
    },
    upload: function() {
      const reader = new FileReader();
      const file = document.getElementById('upload').files[0];
      reader.onload = (e) => {
        fabric.Image.fromURL(reader.result, (img) => {
          this.canvas.add(img);
          this.canvas.renderAll();
        });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    resize: function() {
      console.log('resize');
      this.canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    },
  },
  ready() {
    this.canvas = new fabric.Canvas('c', {isDrawingMode: true});
    this.canvas.setDimensions({width: window.innerWidth, height:window.innerHeight});
    this.canvas.setBackgroundColor('grey');
    this.canvas.renderAll();

    window.onresize = this.resize;
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
.mdl-button--file input {
  cursor: pointer;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  z-index: 4;
}
</style>
