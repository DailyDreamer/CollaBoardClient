<template>
  <input type="text" v-model="rname" placeholder="Room name">
  <button v-on:click="newRoom()">New Room</button>
  <ul>
    <li v-for="room in rooms">
      <a v-link="{name: this.device, params: {rid: room.rid} }">{{room.rname}}</a>
    </li>
  </ul>
</template>

<script>
import config from '../config.json'
import $ from '$'

export default {
  data() {
    return {
      rooms: [],
      device: '',
      rname: '',
    }
  },
  methods: {
    newRoom: function(){
      this.$http.post(`http://${config.server}/api/room`, { rname: this.rname }).then( (res) => {
        this.toRoom(res.data);
      });
    },
    toRoom: function(rid) {
      this.$route.router.go({ name: this.device, params: { rid: rid }});
    }
  },
  ready() {
    this.$http.get(`http://${config.server}/api/user`).then( (res) => {
      if (res.data.err) {
        console.log(res.data.err);
      } else {
        this.rooms = res.data.rooms;
      }
      if (!!$.os.tablet || !!$.os.phone){
        this.device = 'sketch';
      } else {
        this.device = 'board';
      }
    });
  },
}
</script>
<style>
</style>
