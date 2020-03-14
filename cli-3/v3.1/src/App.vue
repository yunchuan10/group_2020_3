<template>
  <div id="app">


    <v-form></v-form>


  </div>
</template>

<script>
import VForm from './form/Index'

export default {
  name: 'app',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    VForm
  },
  methods: {
      g(m) {
        console.log(m, 2222);
      }
  },


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
