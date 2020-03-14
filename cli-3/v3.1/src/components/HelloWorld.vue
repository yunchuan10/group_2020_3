<template>
  <div class="hello">
    <h1 @click="send">{{ msg }}</h1>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods:{
        send(){
            this.$parent.g("child-msg", 33);
            this.$emit('child-msg', 1);
        }
    }
}
</script>


<style scoped>
h3 {
  margin: 40px 0 0;
}

</style>
