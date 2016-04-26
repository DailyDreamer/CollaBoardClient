<template>
  <div id="note">
    <canvas id="c"></canvas>
    <div id="note-function">
        <button @click="save()">save</button>
        <button @click="toBoard()">dashboard</button>
    </div>
  </div>
</template>

<script>
import $ from '$'
import config from '../config.json'
import Sketch from '../lib/Sketch.js'
import { genUUID } from '../lib/Helper.js'
import {
  socketInit,
  notifyAdd,
  notifyContentChange,
} from '../vuex/actions'

export default {
  vuex: {
    getters: {
    },
    actions: {
      socketInit,
      notifyAdd,
      notifyContentChange,
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
        type: 'sketch-note',
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

    //free drawing
    $('#c').attr('height', window.innerHeight)
          .attr('width', window.innerWidth);

    this.sketch = new Sketch('c');
  }
}
</script>

<style>
#c {
  position: absolute;
  background-color: grey;
}
#note-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
