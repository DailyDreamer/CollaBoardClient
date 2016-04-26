<template>
  <div style="display:block">
    <input type="file" @change="addImage($event)">
  </div>
</template>

<script>
import {
  notifyAdd,
} from '../vuex/actions'

export default {
  props: {
    note: Object,
  },
  vuex: {
    actions: {
      notifyAdd,
    }
  },
  methods: {
    addImage: function(e) {
      let reader = new FileReader();
      let file = e.target.files[0];
      if (file) {
        reader.readAsDataURL(file);
      }
      reader.onload = () => {
        this.note.content = reader.result;
        this.notifyAdd(this.note);
        this.$dispatch('close');
      };
    },
  },
}
</script>

<style>
</style>
