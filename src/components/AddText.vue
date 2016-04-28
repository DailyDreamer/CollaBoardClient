<template>
  <textarea v-model="note.content"></textarea>
</template>

<script>
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
  events: {
    'add': function() {
      this.notifyAdd(this.note);
    },
    'change': function() {
      this.notifyContentChange({ id:this.note.id, content:this.note.content });
    },
  },
}
</script>

<style>
</style>
