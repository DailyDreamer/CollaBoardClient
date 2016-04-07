<template>
  <div id="Login">
    <form class="" v-on:submit.prevent="onSubmit">
      <input type="text" placeholder="name" v-model="user._id">
      <input type="password" v-model="user.password">
      <button v-on:click="login">Login</button>
    </form>
  </div>
</template>

<script>
import Config from '../Config.js'

export default {
  data() {
    return {
      user: {},
    }
  },
  methods: {
    login: function() {
      console.log(this.user);
      //todo add xhr before all push
      this.$http.post(`http://${Config.server}/api/login`, this.user, {xhr: {withCredentials: true }}).then( (res) => {
        console.log(res.data);
        console.log(res.headers());
        console.log(res);
      });
    }
  }
}
</script>
<style>
</style>
