// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//路由
import router from './router'
//时间处理函数
import moment from "moment";
Vue.prototype.$moment = moment;
//vuex
import store from './store'

//公共组件
import { commonComp } from './common/js/base'

commonComp();

import fixedInput from './common/js/directive.js'

Vue.config.productionTip = false


//百度富文本编辑器
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.js'
import '../static/UE/themes/default/css/ueditor.css'

import VueUeditorWrap from 'vue-ueditor-wrap'
// 或者在 main.js 里将它注册为全局组件
Vue.component('vue-ueditor-wrap', VueUeditorWrap)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
