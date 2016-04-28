<template>
    <rect></rect>
</template>

<script>
import Hammer from 'hammerjs'
import config from '../config.json'
import {
  notifyStyleChange,
  setSource,
  notifyAddLink,
} from '../vuex/actions'

export default {
  vuex: {
    getters: {
      source: state => state.source,
    },
    actions: {
      notifyStyleChange,
      setSource,
      notifyAddLink,
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
    let tap = new Hammer.Tap();
    let dbtap = new Hammer.Tap({ event: 'dbtap', taps: 2 });
    dbtap.recognizeWith(tap);
    tap.requireFailure(dbtap);
    let pan = new Hammer.Pan();
    mc.add([dbtap, tap, pan]);
    mc.on("dbtap", e => {
      if (e.target !== mcContainer) return;
      this.$dispatch('changenote', this.note);
    });
    mc.on('tap', e => {
      if (e.target !== mcContainer) return;
      if (!this.source) {
        this.setSource(this.note.id);
      } else if (this.source !== this.note.id) {
        this.notifyAddLink(this.note.id);
      }
    })
    let objPos = { x: 0, y: 0 };
    let tapPos = { x: 0, y: 0 };
    let tmpX, tmpY;
    mc.on('panstart', e => {
      if (e.target !== mcContainer) return;
      objPos.x = this.note.x;
      objPos.y = this.note.y;
      tapPos.x = e.center.x;
      tapPos.y = e.center.y;
    });
    mc.on('panmove', (e) => {
      if (e.target !== mcContainer) return;
      tmpX = (Math.max(0, Math.min(config.BoardWidth - config.NoteWidth,  objPos.x + (e.center.x - tapPos.x) / this.scale)));
      tmpY = (Math.max(0, Math.min(config.BoardHeight - config.NoteHeight,  objPos.y + (e.center.y - tapPos.y) / this.scale)));
      this.notifyStyleChange({ id: this.note.id, x:tmpX, y:tmpY });
    });
  }
}
</script>

<style>
</style>
