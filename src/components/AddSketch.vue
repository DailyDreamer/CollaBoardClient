<template>
  <canvas id="sc"></canvas>
</template>

<script>
import Sketch from '../lib/Sketch.js'
import {
  notifyAdd,
  notifyContentChange,
} from '../vuex/actions'

export default {
  vuex: {
    actions: {
      notifyAdd,
      notifyContentChange,
    }
  },
  props: {
    note: Object,
  },
  data() {
    return {
      sketch: null,
    }
  },
  methods: {

  },
  events: {
    'add': function() {
      this.note.content = this.sketch.toDataURL();
      this.notifyAdd(this.note);
    },
    'change': function() {
      this.note.content = this.sketch.toDataURL();
      this.notifyContentChange({ id:this.note.id, content:this.note.content });
    },
  },
  ready() {
    this.sketch = new Sketch('sc');
    let image = new Image();
    image.src = this.note.content;
    image.onload = () => {
      this.sketch.drawImage(image, 0, 0);
    };
  }
}
</script>

<style>
#sc {
  display: block;
  background-color: grey;
}
</style>
