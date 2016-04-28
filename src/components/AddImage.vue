<template>
  <form class="pure-form">
    <label for="addimage">
      <i class="material-icons">file_upload</i>
      upload
    </label>
    <input type="file" id="addimage" @change="addImage($event)">
  </form>
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
input[type=file] {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
</style>
