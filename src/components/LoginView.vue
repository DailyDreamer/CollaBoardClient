<template>
  <div id="Login">
    <form class="pure-form pure-form-stacked" @submit.prevent="login">
      <input type="text" placeholder="username" v-model="user._id">
      <input type="password" placeholder="password" v-model="user.password">
      <button class="pure-button" type="submit">Login</button>
    </form>
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
          this.$route.router.go({ name: 'index' });
        }
      });
    }
  }
}
</script>
<style>
</style>
