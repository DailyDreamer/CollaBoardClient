<template>
  <div id="SignUp">
    <form class="" v-on:submit.prevent="onSubmit">
      <input type="text" placeholder="name" v-model="user._id">
      <input type="password" v-model="user.password">
      <button v-on:click="signUp">SignUp</button>
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
    signUp: function() {
      this.$http.post(`http://${Config.server}/api/signUp`, this.user).then( (res) => {
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
