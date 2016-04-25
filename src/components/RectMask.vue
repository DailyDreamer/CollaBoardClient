<template>
    <rect></rect>
</template>

<script>
import d3 from 'd3'
import config from '../config.json'
import {
  notifyStyleChange
} from '../vuex/actions'

export default {
  vuex: {
    getters: {
    },
    actions: {
      notifyStyleChange,
    }
  },
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
    let originX, originY, tmpX, tmpY;
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
        tmpX = (Math.max(0, Math.min(config.BoardWidth - config.NoteWidth,  originX + (d3.event.x - originX) / this.scale)));
        tmpY = (Math.max(0, Math.min(config.BoardHeight - config.NoteHeight,  originY + (d3.event.y - originY) / this.scale)));
        this.notifyStyleChange({ id: this.note.id, x:tmpX, y:tmpY });
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
