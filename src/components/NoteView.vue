<template>
  <div id="note">
    <div id="note-function">
        <button v-on:click="send()">send</button>
        <button v-on:click="toBoard()">dashboard</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  data() {
    return {
      canvas: null,
      socket: null,
    }
  },
  components: {

  },
  methods: {
    send: function() {
      //TODO
    },
    toBoard: function() {
      this.$route.router.go({ name: 'board', params: { rid: this.$route.params.rid }});
    }
  },
  ready() {

  }
}
</script>

<style>
#note-function {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
