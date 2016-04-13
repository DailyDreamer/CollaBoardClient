<template>
  <div id="note">
    <fabric-canvas :canvas-width="Config.NoteWidth" :canvas-height="Config.NoteHeight"></fabric-canvas>
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
      socket: null,
      Config: Config,
    }
  },
  components: {
    'fabric-canvas': FabricCanvas,
  },
  methods: {
    send: function() {
      //send whole canvas as a note
      this.canvas.uuid = Helper.genUUID();

      let fabricObjects = this.canvas.getObjects();
      for (let fabricObject of fabricObjects) {
        fabricObject.hasBorders = false;
      }
      let group = new fabric.Group(fabricObjects, {
        left: 0,
        top: 0,
      });
      let back = new fabric.Rect({
        left: group.left,
        top: group.top,
        fill: 'yellow',   //todo: need to change color
        width: group.width,
        height: group.height,
      });
      group.addWithUpdate(back);
      back.sendToBack();
      group.setOptions({uuid: Helper.genUUID()});

      this.socket.emit('object:added', Helper.genJSONString(group));
      this.canvas.clear();
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
#note-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
