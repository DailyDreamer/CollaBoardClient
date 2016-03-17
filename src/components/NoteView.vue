<template>
  <div id="note">
    <fabric-canvas></fabric-canvas>
    <div id="note-function">
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" id="send" v-on:click="send(canvas, socket)">Send</button>
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" id="clear" v-on:click="clear(canvas)">Clear</button>
    </div>
  </div>
</template>

<script>
import fabric from 'fabric'
import io from 'socket.io-client'
import Config from '../Config.js'
import FabricCanvas from './FabricCanvas.vue'
import Helper from './Helper.js'

export default {
  data() {
    return {
      canvas: null,
      socket: null
    }
  },
  components: {
    'fabric-canvas': FabricCanvas,
  },
  methods: {
    send: (canvas, socket) => {
      //send whole canvas as a note
      canvas.uuid = Helper.genUUID();
      socket.emit('note:added', Helper.genJSONString(canvas));
    },
    clear: (canvas) => {
      canvas.clear();
    }
  },
  ready() {
    this.canvas = this.$children[0].canvas;
    this.socket = io(Config.server);
    this.socket.emit('join', this.$route.params.rid);
  }
}
</script>
<style>
canvas {
  display: block;
}
#note-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
