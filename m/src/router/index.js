import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { setLocalSto } from '../common/js/utils'

Vue.use(VueRouter)

const router = new VueRouter({
    routes,
    mode: 'history',
	base: '/',
    scrollBehavior(to, from, savedPosition) {
        // if (savedPosition) {
        //     return savedPosition
        // } else {
            return {
                y: 0
            }
        // }
    }
})

router.afterEach((to,from,next) => {
    // chrome
    // document.body.scrollTop = 0
    // // firefox
    // document.documentElement.scrollTop = 0
    // // safari
    // window.pageYOffset = 0
    // window.scrollTo(0,0);

    var app = document.getElementById('app');
    if( app && app.scrollTop ){
        app.scrollTop = 0;
    }

});

// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录
        if (localStorage.user) { // 判断token是否存在
            next();
        }else {
            setLocalSto('loginBack', to.fullPath);
            next({
                path: '/login',
                // query: { redirect: to.fullPath } // 登录成功后跳转到存取的路由
            })
        }
    }else {
        next();
    }
});

export default router;
