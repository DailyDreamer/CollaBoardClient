<template>
  <div id="add" v-if="show" :style="{left: note.x + 'px', top: note.y + 'px'}">
    <component :is="'change-'+this.type" :note="this.note" @close="show=false"></component>
    <button @click="changeNote">add</button>
    <button @click="show=false">cancle</button>
  </div>
</template>

<script>
import config from '../config.json'
import AddText from './AddText.vue'
import AddSketch from './AddSketch.vue'

export default {
  components: {
    'change-text': AddText,
    'change-sketch': AddSketch,
  },
  props: {
    show: Boolean,
    note: Object,
  },
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
    changeNote: function() {
      this.$broadcast('change');
      this.show = false;
    },
  },
  ready() {
  }
}
</script>

<style>
</style>
