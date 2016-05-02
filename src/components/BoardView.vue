<template>
  <div id="board">
      <div id="board-content" :style="{ width: config.BoardWidth + 'px', height: config.BoardHeight + 'px', transform: 'scale(' + scale + ') translate(' + translate.x + 'px, ' + translate.y + 'px)', 'transform-origin': origin.x+'px '+origin.y+'px'}">
        <svg :width="config.BoardWidth" :height="config.BoardHeight">
          <g class="axis">
            <line v-for="n in config.BoardWidth / 100" :x1="n*100" :y1="0" :x2="n*100" :y2="config.BoardWidth" />
            <line v-for="n in config.BoardHeight / 100" :x1="0" :y1="n*100" :x2="config.BoardHeight" :y2="n*100" />
          </g>
          <line v-for="link of links" :x1="notes[link.source].x+config.NoteWidth/2" :y1="notes[link.source].y+config.NoteHeight/2" :x2="notes[link.target].x+config.NoteWidth/2" :y2="notes[link.target].y+config.NoteHeight/2" stroke="black"></line>
        </svg>
        <template v-for="note of notes">
          <div class="note" :style="{ left: note.x + 'px', top: note.y + 'px', width: note.width + 'px', height: note.height + 'px', transform: 'scale(' + note.scale + ')' }">
            <component :is="'show-'+note.type" :note="note"></component>
          </div>
        </template>
        <svg id="svg-container" :width="config.BoardWidth" :height="config.BoardHeight">
          <rect-mask v-for="note of notes" :note="note" :scale="scale" :x="note.x" :y="note.y", :width="note.width" :height="note.height" :transform="'scale(' + note.scale + ')'" @changenote="changenote"></rect-mask>
          <cancel v-for="link of links" :pos="{ x: (notes[link.source].x+notes[link.target].x+config.NoteWidth-25)/2, y: (notes[link.source].y+notes[link.target].y+config.NoteHeight-25)/2 }" :link="link"></cencel>
        </svg>
        <add-note :show.sync="isAddingNote" :pos="addingNotePos"></add-note>
        <change-note :show.sync="isChangingNote" :note="changingNote"></change-note>
      </div>
    <div id="board-function">
      <button class="pure-button" @click="toNote()">add sketch</button>
    </div>
  </div>
</template>

<script>
import Hammer from 'hammerjs'
import config from '../config.json'
import RectMask from './RectMask.vue'
import Cancel from './Cancel.vue'
import AddNote from './AddNote.vue'
import ChangeNote from './ChangeNote.vue'
import ShowText from './ShowText.vue'
import ShowSketch from './ShowSketch.vue'
import {
  socketInit,
  socketListen,
  notesInit,
  setSource,
  notifyDeleteLink,
} from '../vuex/actions'

export default {
  components: {
    'rect-mask': RectMask,
    'cancel': Cancel,
    'add-note': AddNote,
    'change-note': ChangeNote,
    'show-text': ShowText,
    'show-sketch': ShowSketch,
  },
  vuex: {
    getters: {
      notes: state => state.notes,
      links: state => state.links,
    },
    actions: {
      socketInit,
      socketListen,
      notesInit,
      setSource,
      notifyDeleteLink,
    }
  },
  data() {
    return {
      config: config,
      //for pan and zoom
      scale: 1,
      translate: { x:0, y:0 },
      origin: { x:0, y:0 },
      //for adding note
      isAddingNote: false,
      addingNotePos: { x:0, y:0 },
      //for changing note
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
    deleteLink: function(link) {
      console.log('delete');
      this.notifyDeleteLink(link);
    },
  },
  ready() {
    //init notes and socket
    this.$http.get(`${config.server}/api/room/${this.$route.params.rid}`).then( (res) => {
      if (res.data.err) {
        console.log(res.data.err);
      } else {
        this.notesInit(JSON.parse(res.data.notes), JSON.parse(res.data.links));
      }
    });
    this.socketInit(this.$route.params.rid);
    this.socketListen();

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
      this.addingNotePos.x = e.center.x - this.translate.x;
      this.addingNotePos.y = e.center.y - this.translate.y;
      this.isAddingNote = true;
    });
    mc.on('tap', e => {
      if (e.target !== mcContainer) return;
      this.isAddingNote = false;
      this.isChangingNote = false;
      this.setSource(null);
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
  -webkit-transform-origin: 0 0;
     -moz-transform-origin: 0 0;
          transform-origin: 0 0;
}
.addchange {
  position: absolute;
  width: 400px;
  height: 400px;
}
</style>
