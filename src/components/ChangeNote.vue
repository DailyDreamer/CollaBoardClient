<template>
  <div class="addchange note" v-if="show" :style="{left: note.x + 'px', top: note.y + 'px'}">
    <component :is="'change-'+ note.type" :note="copyNote()" @close="show=false"></component>
    <div>
      <button class="pure-button" @click="changeNote"><i class="material-icons">done</i></button>
      <button class="pure-button" @click="show=false"><i class="material-icons">cancel</i></button>
      <button class="pure-button" @click="deleteNote"><i class="material-icons">delete</i></button>
    </div>
  </div>
</template>

<script>
import config from '../config.json'
import AddText from './AddText.vue'
import AddSketch from './AddSketch.vue'
import {
  notifyDelete,
} from '../vuex/actions'

export default {
  components: {
    'change-text': AddText,
    'change-sketch': AddSketch,
  },
  vuex: {
    actions: {
      notifyDelete,
    }
  },
  props: {
    show: Boolean,
    note: Object,
  },
  methods: {
    copyNote: function() {
      return Object.assign({}, this.note);
    },
    changeNote: function() {
      this.$broadcast('change');
      this.show = false;
    },
    deleteNote: function() {
      this.notifyDelete(this.note.id);
      this.show = false;
    },
  },
}
</script>

<style>
</style>
