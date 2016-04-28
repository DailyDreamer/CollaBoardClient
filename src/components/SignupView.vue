<template>
  <div id="SignUp">
    <form class="pure-form pure-form-stacked" @submit.prevent="signUp">
      <input type="text" placeholder="username" v-model="user._id">
      <input type="password" placeholder="password" v-model="user.password">
      <button class="pure-button" type="submit">SignUp</button>
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
    signUp: function() {
      this.$http.post(`http://${config.server}/api/signUp`, this.user).then( (res) => {
        if (res.data.err) {
          console.log(res.data.err);
        } else {
          this.$route.router.go({ name: 'login' });
        }
      });
    }
  }
}
</script>
<style>
</style>
