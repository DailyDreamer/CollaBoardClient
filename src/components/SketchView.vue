<template>
  <div id="note">
    <canvas id="lc"></canvas>
    <div id="sketch-function">
        <button class="pure-button" @click="send">send</button>
        <button class="pure-button" @click="toBoard">dashboard</button>
    </div>
  </div>
</template>

<script>
import config from '../config.json'
import Sketch from '../lib/Sketch.js'
import { genUUID } from '../lib/Helper.js'
import {
  socketInit,
  notifyAdd,
} from '../vuex/actions'

export default {
  vuex: {
    actions: {
      socketInit,
      notifyAdd,
    }
  },
  data() {
    return {
      sketch: null,
    }
  },
  methods: {
    send: function() {
      let note = {
        id: genUUID(),
        x: 0,
        y: 0,
        width: config.NoteWidth,
        height: config.NoteHeight,
        scale: 1,
        type: 'sketch',
        content: this.sketch.toDataURL(),
      };
      this.notifyAdd(note);
      this.sketch.clean();
    },
    toBoard: function() {
      this.$route.router.go({ name: 'board', params: { rid: this.$route.params.rid }});
    }
  },
  ready() {
    this.socketInit(this.$route.params.rid);
    this.sketch = new Sketch('lc');
  }
}
</script>

<style>
#lc {
  position: absolute;
  background-color: grey;
  width: 100%;
  height: 100%;
}
#sketch-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
