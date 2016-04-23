<template>
    <rect></rect>
</template>

<script>
import d3 from 'd3'
import config from '../config.json'

export default {
  props: {
    note: Object,
    scale: Number,
  },
  data() {
    return {

    }
  },
  methods: {

  },
  ready() {
    //drag behavior
    let rect = d3.select(this.$el);
    let originX, originY;
    let drag = d3.behavior.drag()
      .origin(() => {
        return {x: this.note.x, y: this.note.y};
      })
      .on("dragstart", () => {
        d3.event.sourceEvent.stopPropagation();
        rect.classed("dragging", true);
        originX = this.note.x;
        originY = this.note.y;
      })
      .on("drag", () => {
        this.note.x = (Math.max(0, Math.min(config.BoardWidth - config.NoteWidth,  originX + (d3.event.x - originX) / this.scale)));
        this.note.y = (Math.max(0, Math.min(config.BoardHeight - config.NoteHeight,  originY + (d3.event.y - originY) / this.scale)));
      })
      .on('dragend', () => {
        rect.classed("dragging", false);
      });
    rect.call(drag);
  }
}
</script>

<style>
</style>
