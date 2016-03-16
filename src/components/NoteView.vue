<template>
  <div id="note">
    <fabric-canvas></fabric-canvas>
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" id="send" v-on:click="send()">Send</button>
  </div>
</template>

<script>
import fabric from 'fabric'
import io from 'socket.io-client'
import Config from '../Config.js'
import FabricCanvas from './FabricCanvas.vue'

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
    send: function() {
      //send whole canvas as a note
      console.log(this.canvas._objects);
      this.socket.emit('note:added', JSON.stringify(this.canvas));
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
#send {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
