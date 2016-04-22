<template>
  <div id="board">
    <div id="board-zoom">
      <div id="board-content">
        <component v-for="note in notes" :is="note.type" :note="note"></component>
        <svg></svg>
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
import TextNote from './TextNote.vue'

export default {
  data() {
    return {
      notes : [{
        id: '1',
        x: 0,
        y: 0,
        width: config.NoteWidth,
        height: config.NoteHeight,
        type: 'text-note',
        text: 'This is a test',
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
    'text-note' : TextNote,
  },
  ready() {
    let boardZoom = d3.select('#board-zoom');
    let boardContent = d3.select('#board-content')
      .style('width', config.BoardWidth + 'px')
      .style('height', config.BoardHeight + 'px');
    let svg = d3.select('svg')
      .attr('width', config.BoardWidth)
      .attr('height', config.BoardHeight);
    let rects = svg.selectAll('rect');

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

    //zoom
    let scale = 1;
    let zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", () => {
        console.log(d3.event.translate);
        boardContent
          .style('transform', 'scale(' + d3.event.scale + ') translate(' + d3.event.translate[0] + 'px, ' + d3.event.translate[1] + 'px)' )
          .style('transform-origin', d3.event.x + ' ' + d3.event.y);
        scale = d3.event.scale;
      });
    boardZoom.call(zoom);

    //drag objects
    let originX, originY;
    let drag = d3.behavior.drag()
      .origin(Object)
      .on("dragstart", function(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
        originX = d.x;
        originY = d.y;
      })
      .on("drag", function(d) {
        d.x = (Math.max(0, Math.min(config.BoardWidth - config.NoteWidth,  originX + (d3.event.x - originX) / scale)));
        d.y = (Math.max(0, Math.min(config.BoardHeight - config.NoteHeight,  originY + (d3.event.y - originY) / scale)));
        d3.select(this)
        .attr('x', d.x)
        .attr('y', d.y);
      })
      .on('dragend', function(d) {
        d3.select(this).classed("dragging", false);
      });

    //automatical generate rect object
    rects.data(this.notes)
      .enter().append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .call(drag)
  //    rects.exit().remove();
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
}
#board-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
svg {
  position: absolute;
  overflow: hidden;
  border: black 2px solid;
}
.axis line {
  fill: none;
  stroke: #ddd;
  shape-rendering: crispEdges;
  vector-effect: non-scaling-stroke;
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
