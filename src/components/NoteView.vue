<template>
  <div id="note">
    <canvas id="c"></canvas>
    <div id="note-function">
        <button v-on:click="save()">save</button>
        <button v-on:click="toBoard()">dashboard</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import $ from '$'
import config from '../config.json'
import Sketch from './Sketch.js'
import {
  contentChange
} from '../vuex/actions'

export default {
  vuex: {
    getters: {
      notes: state => state.notes
    },
    actions: {
      contentChange,
    }
  },
  data() {
    return {
      sketch: null,
      socket: null,
      note: null,
    }
  },
  methods: {
    genUUID : function() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
      });
    },
    save: function() {
      let note = {
        id: this.genUUID(),
        x: 0,
        y: 0,
        width: config.NoteWidth,
        height: config.NoteHeight,
        type: 'sketch-note',
        content: this.sketch.toDataURL(),
      };
      this.socket.emit('note:added', JSON.stringify(note));
      this.sketch.clean();
    },
    toBoard: function() {
      this.$route.router.go({ name: 'board', params: { rid: this.$route.params.rid }});
    }
  },
  ready() {
    this.socket = io(config.server);
    this.socket.emit('join', this.$route.params.rid);

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
