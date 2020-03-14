<template>
  <div>
      <p>input:    22</p>
      <input :value="v" @input="put" v-bind="$attrs"></input>
  </div>
</template>

<script>
export default {
    inheritAttrs: false,
    props: {
        v: String
    },
    methods:{
        put(e){
            this.$emit('input' , e.target.value);
        }
    }
}
</script>


<style scoped>
h3 {
  margin: 40px 0 0;
}

</style>
