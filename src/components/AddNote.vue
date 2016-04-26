<template>
  <div id="add" v-if="show">
    <div class="pure-menu pure-menu-horizontal">
      <ul class="pure-menu-list">
        <li class="pure-menu-item pure-menu-link" @click="this.note.type='text'">Text</li>
        <li class="pure-menu-item pure-menu-link" @click="this.note.type='sketch'">Image</li>
        <li class="pure-menu-item pure-menu-link" @click="this.note.type='sketch'">Sketch</li>
      </ul>
    </div>
    <component :is="'add-'+this.note.type" :note="this.note"></component>
    <input type="file" @change="addImage($event)">
  </div>
</template>

<script>
import config from '../config.json'
import { genUUID } from '../lib/Helper.js'
import {
  notifyAdd,
} from '../vuex/actions'

export default {
  props: {
    show: Boolean,
  },
  vuex: {
    getters: {
    },
    actions: {
      notifyAdd,
    }
  },
  data() {
    return {
      note: null,
    }
  },
  methods: {
    changeNoteType: function(e) {

    },
    addImage: function(e) {
      let reader = new FileReader();
      let file = e.target.files[0];
      if (file) {
        reader.readAsDataURL(file);
      }
      reader.onload = () => {
        this.note.content = reader.result;
        this.notifyAdd(this.note);
      };
    },
  },
  ready() {
    this.note = {
      id: genUUID(),
      x: 0,
      y: 0,
      width: config.NoteWidth,
      height: config.NoteHeight,
      type: 'text',
      content: null,
    };
  }
}
</script>

<style>
</style>
