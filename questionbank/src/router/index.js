import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
    routes,
    mode: 'history',
	base: '/tk/',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0, y: 0
            }
        }
    },

})


// 路由判断登录 根据路由配置文件的参数
// router.beforeEach((to, from, next) => {
//     console.log(to)
//     if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录
//         console.log('需要登录');
//         if (localStorage.token) { // 判断token是否存在
//             next();
//         }else {
//             next({
//                 path: '/',
//                 // query: { redirect: to.fullPath } // 登录成功后跳转到存取的路由
//             })
//         }
//     }else {
//         next();
//     }
// });

export default router;
