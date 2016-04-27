<template>
  <div id="board">
    <div id="board-zoom">
      <div id="board-content" :style="{ width: config.BoardWidth + 'px', height: config.BoardHeight + 'px', transform: 'scale(' + scale + ') translate(' + translate.x + 'px, ' + translate.y + 'px)', 'transform-origin': origin.x+'px '+origin.y+'px'}">
        <template v-for="note of notes">
          <div class="note" :style="{ left: note.x + 'px', top: note.y + 'px', width: note.width + 'px', height: note.height + 'px' }">
            <component :is="'show-'+note.type" :note="note"></component>
          </div>
        </template>
        <svg id="svg-container" :width="config.BoardWidth" :height="config.BoardHeight">
          <rect-mask v-for="note of notes" :note="note" :scale="scale" :x="note.x" :y="note.y", :width="note.width" :height="note.height" @changenote="changenote"></rect-mask>
        </svg>
        <add-note :show.sync="isAddingNote" :pos="addingNotePos"></add-note>
        <change-note :show.sync="isChangingNote" :note="changingNote"></change-note>
      </div>
    </div>
    <div id="board-function">
      <button @click="toNote()">add sketch</button>
    </div>
  </div>
</template>

<script>
import d3 from 'd3'
import Hammer from 'hammerjs'
import config from '../config.json'
import RectMask from './RectMask.vue'
import AddNote from './AddNote.vue'
import ChangeNote from './ChangeNote.vue'
import ShowText from './ShowText.vue'
import ShowSketch from './ShowSketch.vue'
import {
  socketInit,
  socketListen,
  notesInit,
} from '../vuex/actions'

export default {
  components: {
    'rect-mask': RectMask,
    'add-note': AddNote,
    'change-note': ChangeNote,
    'show-text': ShowText,
    'show-sketch': ShowSketch,
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
    }
  },
  data() {
    return {
      config: config,
      scale: 1,
      translate: { x:0, y:0 },
      origin: { x:0, y:0 },
      isAddingNote: false,
      addingNotePos: { x:0, y:0 },
      isChangingNote: false,
      changingNote: null,
    }
  },
  methods: {
    toNote: function() {
      this.$route.router.go({ name: 'sketch', params: { rid: this.$route.params.rid }});
    },
    changenote: function(note) {
      this.isAddingNote = false;
      this.changingNote = note;
      this.isChangingNote = true;
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

    let mcContainer = document.getElementById('svg-container');
    let mc = new Hammer.Manager(mcContainer);
    let tap = new Hammer.Tap();
    let dbtap = new Hammer.Tap({ event: 'dbtap', taps: 2 });
    dbtap.recognizeWith(tap);
    tap.requireFailure(dbtap);
    let pan = new Hammer.Pan();
    let pinch = new Hammer.Pinch();
    mc.add([dbtap, tap, pan, pinch]);
    //double tap add note
    mc.on("dbtap", e => {
      if (e.target !== mcContainer) return;
      this.isChangingNote = false;
      this.addingNotePos.x = e.center.x;
      this.addingNotePos.y = e.center.y;
      this.isAddingNote = true;
    });
    mc.on('tap', e => {
      this.isAddingNote = false;
      this.isChangingNote = false;
    });
    //pan
    let last = { x:0, y:0 };
    mc.on('panmove', (e) => {
      if (e.target !== mcContainer) return;
      this.translate.x = last.x + e.deltaX;
      this.translate.y = last.y + e.deltaY;
    });
    mc.on('panend', (e) => {
      if (e.target !== mcContainer) return;
      last.x = this.translate.x;
      last.y = this.translate.y;
    });
    //pinch to zoom
    mc.on('pinch', (e) => {
      this.scale = e.scale;
      this.origin.x = e.center.x;
      this.origin.y = e.center.y;
    });
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
  opacity: 0;
  cursor: move;
}
.note {
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
.addchange {
  position: absolute;
  width: 400px;
  height: 400px;
}
</style>
