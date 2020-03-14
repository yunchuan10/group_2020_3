// import Vue from 'vue'

const MyPlugin = {};

MyPlugin.install = function (Vue, options) {
    // // 1. 添加全局方法或属性
    // Vue.myGlobalMethod = function () {
    //     // 逻辑...
    // }

    // // 2. 添加全局资源
    // Vue.directive('my-directive', {
    //     bind(el, binding, vnode, oldVnode) {
    //         // 逻辑...
    //     }
    // })

    // 3. 注入组件
    Vue.mixin({
        created() {

        },
        methods: {
            my_set_confirm ( obj ){
                obj = obj||{}
                this.$store.commit('set_toarist_confirm', {
                    status: obj.status,
                    cb: obj.cb
                })
            },
            my_set_alert ( obj ){
                obj = obj||{}
                this.$store.commit('set_toarist_alert', {
                    status: obj.status,
                    cb: obj.cb
                })
            }
        }
    })

    // 4. 添加实例方法
    // Vue.prototype.$my_method = function ( methodOptions ) {
    //     console.log('myv_method')
    // }


}

export default MyPlugin;
