// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// ui库
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(Mint);
import App from './App'
// vuex
import store from './store'
import router from './router'

import lrz from 'lrz'

//全局变量引入
import {dev_online} from './common/js/base'//引用文件



// 公共组件
import { commonComp } from './common/js/base'
commonComp();


// 混合
import MyPlugin from './common/js/myPlugin'
//使用自定义插件
Vue.use(MyPlugin)
Vue.prototype.GLOBAL = dev_online; //挂载到Vue实例上面


// 解决移动端点击延迟
import FastClick from 'fastclick'
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
