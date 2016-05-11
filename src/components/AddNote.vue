<template>
  <div class="addchange note" v-if="show" :style="{left: pos.x + 'px', top: pos.y + 'px'}">
    <div class="pure-menu pure-menu-horizontal">
      <ul class="pure-menu-list">
        <li class="pure-menu-item pure-menu-link" @click="type='text'">Text</li>
        <li class="pure-menu-item pure-menu-link" @click="type='image'">Image</li>
        <li class="pure-menu-item pure-menu-link" @click="type='sketch'">Sketch</li>
      </ul>
    </div>
    <component :is="'add-'+ type" :note="newNote()" @close="show=false"></component>
    <div>
      <button class="pure-button" @click="addNote"><i class="material-icons">done</i></button>
      <button class="pure-button" @click="show=false"><i class="material-icons">cancel</i></button>
    </div>
  </div>
</template>

<script>
import config from '../config.json'
import { genUUID } from '../lib/Helper.js'
import AddText from './AddText.vue'
import AddImage from './AddImage.vue'
import AddSketch from './AddSketch.vue'

export default {
  components: {
    'add-text': AddText,
    'add-image': AddImage,
    'add-sketch': AddSketch,
  },
  props: {
    show: Boolean,
    pos: Object,
  },
  data() {
    return {
      type: 'text',
    }
  },
  methods: {
    newNote: function() {
      //note type image === sketch
      let type = (this.type === 'image') ? 'sketch' : this.type;
      return {
        id: genUUID(),
        x: this.pos.x,
        y: this.pos.y,
        width: config.NoteWidth,
        height: config.NoteHeight,
        scale: 1,
        type: type,
        content: null,
      };
    },
    addNote() {
      this.$broadcast('add');
      this.show = false;
    },
  },
  ready() {
  }
}
</script>

<style>
</style>
