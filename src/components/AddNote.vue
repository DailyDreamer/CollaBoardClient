<template>
  <div id="add" v-if="show">
    <div class="pure-menu pure-menu-horizontal">
      <ul class="pure-menu-list">
        <li class="pure-menu-item pure-menu-link" @click="type='text'">Text</li>
        <li class="pure-menu-item pure-menu-link" @click="type='image'">Image</li>
        <li class="pure-menu-item pure-menu-link" @click="type='sketch'">Sketch</li>
      </ul>
    </div>
    <component :is="'add-'+this.type" :note="this.newNote()" @close="show=false"></component>
    <button @click="addNote">add</button>
    <button @click="show=false">cancle</button>
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
  },
  data() {
    return {
      type: 'text',
    }
  },
  computed: {
    note: function() {

    }
  },
  methods: {
    newNote: function() {
      //note type image === sketch
      let type = (this.type === 'image') ? 'sketch' : this.type;
      return {
        id: genUUID(),
        x: 0,
        y: 0,
        width: config.NoteWidth,
        height: config.NoteHeight,
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
