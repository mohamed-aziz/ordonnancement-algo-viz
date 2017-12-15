<template>
  <div id="app">
    <Viz/>
  </div>
</template>

<script>
import Viz from './components/Viz'

export default {
  name: 'app',
  components: {
    Viz
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
