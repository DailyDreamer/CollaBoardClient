<template>
  <div id="board">
    <div id="board-zoom">
      <div id="board-content">
        <template v-for="note in notes">
          <div class="note" v-bind:style="{ left: note.x + 'px', top: note.y + 'px', width: note.width + 'px', height: note.height + 'px' }">
            <component :is="note.type" :note="note"></component>
          </div>
        </template>
        <svg>
          <rect-mask v-for="note in notes" :note="note" :scale="scale" :x="note.x" :y="note.y", :width="note.width" :height="note.height"></rect-mask>
        </svg>
      </div>
    </div>
    <div id="board-function">
      <button v-on:click="toNote()">add note</button>
      <button v-on:click="download($event)">download</button>
    </div>
  </div>
</template>

<script>
import d3 from 'd3'
import io from 'socket.io-client'
import config from '../config.json'
import RectMask from './RectMask.vue'
import TextNote from './TextNote.vue'
import SketchNote from './SketchNote.vue'

export default {
  data() {
    return {
      scale: 1,
      notes : [{
        id: '1',
        x: 0,
        y: 0,
        width: config.NoteWidth,
        height: config.NoteHeight,
        type: 'text-note',
        content: 'This is a test',
      }],
    }
  },
  methods: {
    toNote: function() {
      this.$route.router.go({ name: 'note', params: { rid: this.$route.params.rid }});
    },
    download: function(e) {
      //TODO
    },
  },
  components: {
    'rect-mask': RectMask,
    'text-note': TextNote,
    'sketch-note': SketchNote,
  },
  ready() {
    this.socket = io(config.server);
    this.socket.emit('join', this.$route.params.rid);

    this.socket.on('note:added', msg => {
      let note = JSON.parse(msg);
      this.notes.push(note);
    });

    //d3.js
    let boardZoom = d3.select('#board-zoom');
    let boardContent = d3.select('#board-content')
      .style('width', config.BoardWidth + 'px')
      .style('height', config.BoardHeight + 'px');
    let svg = d3.select('svg')
      .attr('width', config.BoardWidth)
      .attr('height', config.BoardHeight);

    //generate axis
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
      .scaleExtent([0.1, 10])
      .on("zoom", () => {
        boardContent
          .style('transform', 'scale(' + d3.event.scale + ') translate(' + d3.event.translate[0] + 'px, ' + d3.event.translate[1] + 'px)' );
        this.scale = d3.event.scale;
      });
    boardZoom.call(zoom);
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
