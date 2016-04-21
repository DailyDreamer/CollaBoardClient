<template>
  <div class="note" v-bind:style="{ left: note.x + 'px', top: note.y + 'px', width: note.width + 'px', height: note.height + 'px' }">
    {{note.text}}
  </div>
</template>

<script>
import d3 from 'd3'

export default {
  props: {
    note: Object,
  },
  data() {
    return {

    }
  },
  methods: {

  },
  ready() {
    
  }
}
</script>

<style>
</style>
