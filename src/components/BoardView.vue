<template>
  <div id="board">
    <div id="board-zoom">
      <div id="board-content" :style="{ width: config.BoardWidth + 'px', height: config.BoardHeight + 'px', transform: 'scale(' + scale + ') translate(' + translate[0] + 'px, ' + translate[1] + 'px)'}">
        <template v-for="note of notes">
          <div class="note" :style="{ left: note.x + 'px', top: note.y + 'px', width: note.width + 'px', height: note.height + 'px' }">
            <component :is="note.type" :note="note"></component>
          </div>
        </template>
        <svg :width="config.BoardWidth" :height="config.BoardHeight">
          <rect-mask v-for="note of notes" :note="note" :scale="scale" :x="note.x" :y="note.y", :width="note.width" :height="note.height"></rect-mask>
        </svg>
      </div>
    </div>
    <div id="board-function">
      <input type="file" id="addImage" @change="addImage($event)">
      <button @click="toNote()">add sketch</button>
      <button @click="download($event)">download</button>
    </div>
  </div>
</template>

<script>
import d3 from 'd3'
import config from '../config.json'
import RectMask from './RectMask.vue'
import TextNote from './TextNote.vue'
import SketchNote from './SketchNote.vue'
import { genUUID } from '../lib/Helper.js'
import {
  socketInit,
  socketListen,
  notesInit,
  notifyAdd,
} from '../vuex/actions'

export default {
  components: {
    'rect-mask': RectMask,
    'text-note': TextNote,
    'sketch-note': SketchNote,
  },
  vuex: {
    getters: {
      socket: state => state.socket,
      notes: state => state.notes,
    },
    actions: {
      socketInit,
      socketListen,
      notesInit,
      notifyAdd,
    }
  },
  data() {
    return {
      config: config,
      scale: 1,
      translate: [0, 0],
    }
  },
  methods: {
    addImage: function(e) {
      let reader = new FileReader();
      let file = e.target.files[0];
      if (file) {
        reader.readAsDataURL(file);
      }
      reader.onload = () => {
        let note = {
          id: genUUID(),
          x: 0,
          y: 0,
          width: config.NoteWidth,
          height: config.NoteHeight,
          type: 'sketch-note',
          content: reader.result,
        };
        this.notifyAdd(note);
      };
    },
    toNote: function() {
      this.$route.router.go({ name: 'note', params: { rid: this.$route.params.rid }});
    },
    download: function(e) {
      //TODO
    },
  },
  ready() {
    //init notes and socket
    this.notesInit();
    this.socketInit(this.$route.params.rid);
    this.socketListen();

    //generate axis
    let svg = d3.select('svg');
    svg.append("g")
        .attr("class", "x axis")
      .selectAll("line")
        .data(d3.range(0, config.BoardWidth, 100))
      .enter().append("line")
        .attr("x1", function(d) { return d; })
        .attr("y1", 0)
        .attr("x2", function(d) { return d; })
        .attr("y2", config.BoardHeight);

    svg.append("g")
        .attr("class", "y axis")
      .selectAll("line")
        .data(d3.range(0, config.BoardHeight, 100))
      .enter().append("line")
        .attr("x1", 0)
        .attr("y1", function(d) { return d; })
        .attr("x2", config.BoardWidth)
        .attr("y2", function(d) { return d; });

    //zoom and panning behavior
    let zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 5])
      .on("zoom", () => {
        this.scale = d3.event.scale;
        this.translate = d3.event.translate;
      });
    d3.select('#board-zoom').call(zoom);
  }
}
</script>

<style>
#board {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#board-zoom {
  position: absolute;
  width: 100%;
  height: 100%;
}
#board-content {
  position: absolute;
  -webkit-transform-origin: 0 0;
     -moz-transform-origin: 0 0;
          transform-origin: 0 0;
}
#board-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
svg {
  position: absolute;
  overflow: hidden;
}
.axis line {
  stroke: #ddd;
}
rect {
  opacity: 0.1;
  cursor: move;
}
.note{
  background-color: rgb(255, 240, 70);
  padding: 10px;
  position: absolute;
  -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
       box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
</style>
