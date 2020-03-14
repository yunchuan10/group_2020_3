<template>
  <div class="hello">
    <h3>表单</h3>

    <k-form :model="model" :rules="rules" ref="loginForm">

        <k-form-item lable="姓名" prop="name">
            <k-input v-model="model.n" type="text" placeholder="qing填写"></k-input>
        </k-form-item>

        <k-form-item lable="密码" prop="name">
            <k-input v-model="model.p" type="password" placeholder="qing填写"></k-input>
        </k-form-item>

    </k-form>

  </div>
</template>

<script>

import kForm from './Form.vue';
import KFormItem from './FormItem';
import KInput from './Input';

export default {
    data(){
        return {
            model: {
                v: '',
                p: ''
            },
            rules: [

            ]
        }
    },

  components: {
      kForm,
      KFormItem,
      KInput
  },
  methods:{

    }
}
</script>


<style scoped>
h3 {
  margin: 40px 0 0;
}

</style>
