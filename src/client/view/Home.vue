<template>
  <div id="app">
    <h2>Home</h2>
    <div class="info">测试</div>
    <p>{{ info }}</p>
  </div>
</template>
<script>
export default {
  asyncData({ store, route }) {
    return store.dispatch('changeMsg');
  },
  data() {
    return {
      info: this.$store.state.msg
    }
  },
  /* computed: {
    info() {
      console.log('ss');
      return this.$store.state.msg;
    }
  }, */
  mounted() {
    console.log(this.$store);
  }
}
</script>

<style>
.layout {
  margin: 0;
  padding: 0;
}
</style>
