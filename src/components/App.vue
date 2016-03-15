<template>
  <div id="wrapper">
    <div id="header">
      <h1>{{ msg }}</h1>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello Vue!'
    }
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
