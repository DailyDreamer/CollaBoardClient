<template>
  <textarea v-model="note.content"></textarea>
</template>

<script>
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
  events: {
    'add': function() {
      this.notifyAdd(this.note);
    },
  },
}
</script>

<style>
</style>
