<template>
  <div id="app">
    <header>这是一个静态页面</header>
    <button @click="prient">打印</button>
  </div>
</template>
<script>
export default {
  name: 'about',
  methods: {
    prient: function () {
      console.log('打印了')
    }
  }
}
</script>
