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
  computed: {
    info() {
      return this.$store.state.msg;
    }
  },
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
