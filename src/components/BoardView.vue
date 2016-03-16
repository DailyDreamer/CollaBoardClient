<template>
  <div id="board">
    <fabric-canvas></fabric-canvas>
  </div>
</template>

<script>
import fabric from 'fabric'
import io from 'socket.io-client'
import Config from '../Config.js'
import CanvasEvents from './CanvasEvents.js'
import FabricCanvas from './FabricCanvas.vue'

export default {
  data() {
    return {
      canvas: null,
      socket: null
    }
  },
  methods: {
  },
  components: {
    'fabric-canvas': FabricCanvas,
  },
  ready() {
    this.canvas = this.$children[0].canvas;
    this.socket = io(Config.server);
    this.socket.emit('join', this.$route.params.rid);
    new CanvasEvents(this.canvas, this.socket);
  }
}
</script>
<style>
canvas {
  display: block;
}
</style>
