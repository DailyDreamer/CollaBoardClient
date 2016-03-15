<template>
  <div id="note">
    <canvas id="c"></canvas>
  </div>
  <button id="send" v-on:click="send()">Send</button>
</template>

<script>
import fabric from 'fabric'
import io from 'socket.io-client'
import Config from '../Config.js'

export default {
  data() {
    return {
      canvas: null,
      socket: null
    }
  },
  methods: {
    send: function() {
      //send whole canvas as a note
      console.log(this.canvas._objects);
      this.socket.emit('note:added', JSON.stringify(this.canvas));
    }
  },
  ready() {
    this.canvas = new fabric.Canvas('c', {isDrawingMode: true});

    this.canvas.setDimensions({width: window.innerWidth, height:window.innerHeight});
    this.canvas.setBackgroundColor('grey');
    this.canvas.renderAll();
    this.socket = io(Config.server);
    this.socket.emit('join', this.$route.params.rid);
  }
}
</script>
<style>
canvas {
  display: block;
}
#send {
  position: fixed;
  top: 0;
  right: 0;
}
</style>
