<template>
  <div id="board">
    <component v-for="note in notes" :is="note.type" :note="note"></component>
    <svg width="3000" height="3000"></svg>
    <div id="board-function">
      <button v-on:click="toNote()">add note</button>
      <button v-on:click="download($event)">download</button>
    </div>
  </div>
</template>

<script>
import d3 from 'd3'
import io from 'socket.io-client'
import TextNote from './TextNote.vue'

export default {
  data() {
    return {
      notes : [{
        id: '1',
        x: 0,
        y: 0,
        width: 200,
        height: 250,
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
    let drag = d3.behavior.drag()
        .origin(Object)
        .on("drag", function(d) {
          d3.select(this)
          .attr('x', d.x = d3.event.x)
          .attr('y', d.y = d3.event.y);
        });
    d3.select('svg').selectAll('rect')
        .data(this.notes)
        .enter()
        .append('rect')
        .style('opacity', 0.1)
        .style('cursor', 'move')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .call(drag);

  }
}
</script>

<style>
#board {
  position: absolute;
}
#board-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
svg {
  position: absolute;
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
