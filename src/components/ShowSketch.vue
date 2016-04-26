<template>
  <img :src="note.content"></img>
</template>

<script>

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
img {
  height: auto;
  max-height: 100%;
  width: auto;
  max-width: 100%;
}
</style>
