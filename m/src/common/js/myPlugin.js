// import Vue from 'vue'
import { setLocalSto } from './utils'
const MyPlugin = {};

MyPlugin.install = function (Vue, options) {
    // // 1. 添加全局方法或属性
    // Vue.myGlobalMethod = function () {
    //     // 逻辑...
    // }

    // // 2. 添加全局资源
    Vue.directive('doyoo', function(el){
        el.onclick = function () {
            if(typeof doyoo != 'undefined'){
                doyoo.util.openChat('g=10066540');return false;
            }
        }
    })

    // 3. 注入组件
    Vue.mixin({
        methods: {
            setLoginBack(){
                setLocalSto('loginBack', this.$route.fullPath);
                this.$router.replace({path: '/login'});
            }
        }
    })

    // 4. 添加实例方法
    // Vue.prototype.$setLoginBack = function ( methodOptions ) {
    //     setLocalSto('loginBack', this.$route.fullPath+Math.random());
    // }


}

export default MyPlugin;
