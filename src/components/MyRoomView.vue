<template>
  <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="new-room" v-on:click="newRoom()">New Room</button>
</template>

<script>
import Config from '../Config.js'

export default {
  data() {
    return {

    }
  },
  methods: {
    newRoom: function(){
      this.$http.get(`http://${Config.server}/api/rid`).then( (res) => {
        if (!!$.os.tablet || !!$.os.phone){
          this.$route.router.go({ name: 'note', params: { rid: res.data }});
        } else {
          this.$route.router.go({ name: 'board', params: { rid: res.data }});
        }
      });
    }
  }
}
</script>
<style>
</style>
