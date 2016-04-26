<template>
  <div id="SignUp">
    <form class="" @submit.prevent="signUp">
      <input type="text" placeholder="name" v-model="user._id">
      <input type="password" v-model="user.password">
      <button type="submit">SignUp</button>
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
