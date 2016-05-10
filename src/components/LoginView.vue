<template>
  <div id="Login">
    <form class="pure-form pure-form-stacked">
      <input type="text" placeholder="username" v-model="user._id">
      <input type="password" placeholder="password" v-model="user.password">
    </form>
    <button class="pure-button" @click="login">Login</button>
    <button class="pure-button" @click="toSignup">Signup</button>
  </div>
</template>

<script>
import config from '../config.json'

export default {
  data() {
    return {
      user: {},
    }
  },
  methods: {
    login: function() {
      this.$http.post(`${config.server}/api/login`, this.user).then( (res) => {
        if (res.data.err) {
          console.log(res.data.err);
        } else {
          console.log(res.data.success);
          this.$route.router.go({ name: 'index' });
        }
      });
    },
    toSignup: function() {
      this.$route.router.go({ name: 'signup' });
    },
  }
}
</script>
<style>
</style>
