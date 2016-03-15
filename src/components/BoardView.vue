<template>
  <div id="board">
    <canvas id="c"></canvas>
    <button id="mode" v-on:click="changeMode(canvas)">Change Mode</button>
  </div>
</template>

<script>
import fabric from 'fabric'
import io from 'socket.io-client'
import Config from '../Config.js'
import CanvasEvents from './CanvasEvents.js'

export default {
  data() {
    return {
      canvas: null,
      socket: null
    }
  },
  methods: {
    changeMode: (canvas) => {
      canvas.isDrawingMode = !canvas.isDrawingMode;
    }
  },
  ready() {
    this.canvas = new fabric.Canvas('c', {isDrawingMode: true});

    this.canvas.setDimensions({width: window.innerWidth, height:window.innerHeight});
    this.canvas.setBackgroundColor('grey');
    this.canvas.renderAll();
    this.socket = io(Config.server);
    var canvasEvents = new CanvasEvents(this.canvas, this.socket, this.$route.params.rid);
  }
}
</script>
<style>
canvas {
  display: block;
}
#mode {
  position: fixed;
  top: 0;
  right: 0;
}
</style>
