<template>
  <div id="board">
    <fabric-canvas></fabric-canvas>
    <div id="board-function">
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored icon material-icons" id="to-note" v-on:click="toNote()">note_add</button>
      <div class="mdl-tooltip mdl-tooltip--right" for="to-note">Write a note</div><br/>
    </div>
  </div>
</template>

<script>
import fabric from 'fabric'
import io from 'socket.io-client'
import Config from '../Config.js'
import canvasEvents from './CanvasEvents.js'
import FabricCanvas from './FabricCanvas.vue'

export default {
  data() {
    return {
      canvas: null,
      socket: null
    }
  },
  methods: {
    toNote: function() {
      this.$route.router.go({ name: 'note', params: { rid: this.$route.params.rid }});
    }
  },
  components: {
    'fabric-canvas': FabricCanvas,
  },
  ready() {
    this.canvas = this.$children[0].canvas;
    this.socket = io(Config.server);
    this.socket.emit('join', this.$route.params.rid);
    canvasEvents(this.canvas, this.socket);
  }
}
</script>
<style>
canvas {
  display: block;
}
#board-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
