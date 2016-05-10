<template>
  <div id="SignUp">
    <form class="pure-form pure-form-stacked">
      <input type="text" placeholder="username" v-model="user._id">
      <input type="password" placeholder="password" v-model="user.password">
    </form>
    <button class="pure-button" @click="signup">SignUp</button>
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
    signup: function() {
      this.$http.post(`${config.server}/api/signup`, this.user).then( (res) => {
        if (res.data.err) {
          console.log(res.data.err);
        } else {
          console.log(res.data.success);
          this.$route.router.go({ name: 'login' });
        }
      });
    }
  }
}
</script>
<style>
</style>
