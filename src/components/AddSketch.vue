<template>
  <canvas id="sc"></canvas>
</template>

<script>
import Sketch from '../lib/Sketch.js'
import {
  notifyAdd,
} from '../vuex/actions'

export default {
  vuex: {
    actions: {
      notifyAdd,
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
  },
  ready() {
    this.sketch = new Sketch('sc');
    let image = new Image();
    image.src = this.note.content;
    image.onload = () => {
      this.sketch.drawImage(image);
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
