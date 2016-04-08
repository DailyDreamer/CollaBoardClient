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
      this.$http.post(`http://${Config.server}/api/login`, this.user).then( (res) => {
        if (res.data.err) {
          console.log(res.data.err);
        } else {
          this.$route.router.go({ name: 'index' });
        }
      });
    }
  }
}
</script>
<style>
</style>
