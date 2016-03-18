<template>
  <div id="note">
    <fabric-canvas></fabric-canvas>
    <div id="note-function">
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored icon material-icons" id="send" v-on:click="send()">send</button>
        <div class="mdl-tooltip mdl-tooltip--right" for="send">Send</div><br/>
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored icon material-icons" id="clear" v-on:click="clear()">clear</button>
        <div class="mdl-tooltip mdl-tooltip--right" for="clear">Clear</div><br/>
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored icon material-icons" id="to-board" v-on:click="toBoard()">dashboard</button>
        <div class="mdl-tooltip mdl-tooltip--right" for="to-board">Back to board</div><br/>
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
    send: function() {
      //send whole canvas as a note
      this.canvas.uuid = Helper.genUUID();
      this.socket.emit('note:added', Helper.genJSONString(this.canvas));
    },
    clear: function() {
      this.canvas.clear();
    },
    toBoard: function() {
      this.$route.router.go({ name: 'board', params: { rid: this.$route.params.rid }});
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
