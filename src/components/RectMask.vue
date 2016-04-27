<template>
    <rect></rect>
</template>

<script>
import Hammer from 'hammerjs'
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
    let mcContainer = this.$el;
    let mc = new Hammer.Manager(mcContainer);
    let dbtap = new Hammer.Tap({ event: 'dbtap', taps: 2 });
    let pan = new Hammer.Pan();
    mc.add([dbtap, pan]);
    mc.on("dbtap", e => {
      if (e.target !== mcContainer) return;
      this.$dispatch('changenote', this.note);
    });
    let ox, oy;
    mc.on('panstart', (e) => {
      if (e.target !== mcContainer) return;
      originX = this.note.x;
      originY = this.note.y;
      ox = e.center.x;
      oy = e.center.y;
    });
    mc.on('panmove', (e) => {
      if (e.target !== mcContainer) return;
      tmpX = (Math.max(0, Math.min(config.BoardWidth - config.NoteWidth,  originX + (e.center.x - ox) / this.scale)));
      tmpY = (Math.max(0, Math.min(config.BoardHeight - config.NoteHeight,  originY + (e.center.y - oy) / this.scale)));
      this.notifyStyleChange({ id: this.note.id, x:tmpX, y:tmpY });
    });
  }
}
</script>

<style>
</style>
