<template>
  <div id="note">
    <canvas id="lc"></canvas>
    <div id="sketch-function">
        <button @click="save()">save</button>
        <button @click="toBoard()">dashboard</button>
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
    save: function() {
      let note = {
        id: genUUID(),
        x: 0,
        y: 0,
        width: config.NoteWidth,
        height: config.NoteHeight,
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
    this.socketInit();
    let c = document.getElementById('lc');
    c.height = window.innerHeight;
    c.width = window.innerWidth;
    this.sketch = new Sketch('lc');
  }
}
</script>

<style>
#lc {
  position: absolute;
  background-color: grey;
}
#sketch-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
