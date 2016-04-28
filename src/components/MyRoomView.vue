<template>
  <div class="pure-menu">
    <span class="pure-menu-heading">My Rooms</span>

    <ul class="pure-menu-list">
      <li class="pure-menu-item" v-for="room in rooms">
        <a class="pure-menu-link" v-link="{name: this.device, params: {rid: room.rid} }">{{room.rname}}</a>
      </li>
    </ul>
  </div>
  <form class="pure-form">
    <input type="text" v-model="rname" placeholder="set a name">
    <button class="pure-button" v-on:click="newRoom">New Room</button>
  </form>
</template>

<script>
import config from '../config.json'
import { isMobile } from '../lib/Helper.js'

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
      if (isMobile.any()){
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
