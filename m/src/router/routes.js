
//首页
const home = () => import('@/pages/home.vue')

// 课程列表
const courseList = () => import('@/pages/courseList.vue')
// 服务协议
const agreement = () => import('@/pages/agreement.vue')
// 确认订单
const orderSure = () => import('@/pages/orderSure.vue')
// 支付
const androidPay = () => import('@/pages/androidPay.vue')


//学员通知书
const myInform = () => import('@/pages/myInform.vue');
//订单列表页
const myOrder = () => import('@/pages/myOrder.vue');
//我的列表页
const my = () => import('@/pages/my.vue');
//我的收藏
const myCollection = () => import('@/pages/myCollection.vue');
//我的订单详情
const myOrderDetail = () => import('@/pages/myOrderDetail.vue');
//我的售后
const afterSale = () => import('@/pages/afterSale.vue');
//我的售后
const myChangeName = () => import('@/pages/myChangeName.vue');
//校区
const myCampus = () => import('@/pages/myCampus.vue');
//校区详情
const myCampusDetails = () => import('@/pages/myCampusDetails.vue');
//我的预约
const myAppointment = () => import('@/pages/myAppointment.vue');
// 登陆
const login = () => import('@/pages/user/login.vue');
// 重置密码
const setPassword = () => import('@/pages/user/setPassword.vue');

// 课程详情
const courseDetails = () => import('@/pages/courseDetails.vue');
// 服务协议
const serviceAgreement = () => import('@/pages/serviceAgreement.vue');

// 收货地址
const address = () => import('@/pages/address.vue');

// 试听
const audition = () => import('@/pages/audition.vue');

export default [

    {
        path: '/home',
        name: 'home',
        component: home,
        meta: {
            requireAuth: false,
            // 头部没有头像
            hasAuth: true
        }
    },
    {
        path: '/courseDetails',
        name: 'courseDetails',
        component: courseDetails,
        meta: {
            requireAuth: false,
            hasAuth: true,
            title: '课程详情'
        }
    },
    {
	    path: '/serviceAgreement',
	    name: 'serviceAgreement',
	    component: serviceAgreement,
	    meta: {
	        requireAuth: false,
	        hasAuth: true,
	        title: '服务协议'
	    }
    },
    {
        path: '/orderSure',
        name: 'orderSure',
        component: orderSure,
        meta: {
            requireAuth: false,
            hasAuth: true,
            title: '确认订单'
        }
    },

    {
        path: '/androidPay',
        name: 'androidPay',
        component: androidPay,
        meta: {
            requireAuth: false,
            hasAuth: true,
            title: '立即支付'
        }
    },

    {
        path: '/agreement',
        name: 'agreement',
        component: agreement,
        meta: {
            requireAuth: false,
            hasAuth: true,
            title: '服务协议'
        }
    },

    {
        path: '/course-list',
        name: 'course-list',
        component: courseList,
        meta: {
            requireAuth: false,
            hasAuth: true,
            title: '课程列表'
        }
    },


    {
        path: '/myInform',
        name: 'myInform',
        component: myInform,
        meta: {
            requireAuth: true,
            hasAuth: true,
            title: '学员告知书'
        }
    },
	{
        path: '/myOrder',
        name: 'myOrder',
        component: myOrder,
        meta: {
            requireAuth: true,
            hasAuth: true,
            title: '订单列表页'
        }
    },

    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            requireAuth: false,
            hasAuth: false,
            title: '注册/登录'
        }
    },

    {
        path: '/setpassword',
        name: 'setpassword',
        component: setPassword,
        meta: {
            requireAuth: false,
            hasAuth: false,
            title: '重置密码'
        }
    },

    {
        path: '/my',
        name: 'my',
        component: my,
        meta: {
            requireAuth: true,
            hasAuth: true,
            title: '我的'
        }
    },
	{
        path: '/myCollection',
        name: 'myCollection',
        component: myCollection,
        meta: {
            requireAuth: true,
            hasAuth: true,
            title: '我的收藏'
        }
    },
	{
        path: '/myOrderDetail',
        name: 'myOrderDetail',
        component: myOrderDetail,
        meta: {
            requireAuth: true,
            hasAuth: true,
            title: '订单详情'
        },
        beforeEnter:(to, from, next) => {
	        from.path == '/myInform' ? next('/myOrder') :next();
	    }
    },
	{
        path: '/afterSale',
        name: 'afterSale',
        component: afterSale,
        meta: {
            requireAuth: true,
            hasAuth: true,
            title: '申请售后'
        }
    },
    {
        path: '/myChangeName',
        name: 'myChangeName',
        component: myChangeName,
        meta: {
            requireAuth: true,
            hasAuth: false,
            title: '修改昵称'
        }
    },
	{
        path: '/myCampus',
        name: 'myCampus',
        component: myCampus,
        meta: {
            requireAuth: true,
            title: '我的校区'
        }
    },
	{
        path: '/myCampusDetails',
        name: 'myCampusDetails',
        component: myCampusDetails,
        meta: {
            requireAuth: true,
            title: '校区详情'
        }
    },
    {
        path: '/myAppointment',
        name: 'myAppointment',
        component: myAppointment,
        meta: {
            requireAuth: true,
            title: '我的预约'
        }
    },
    {
        path: '/address',
        name: 'address',
        component: address,
        meta: {
            requireAuth: false,
            title: '编辑收货地址'
        }
    },
    {
        path: '/audition',
        name: 'audition',
        component: audition,
        meta: {
            requireAuth: false,
            title: '课程试听'
        }
    },
    {                   //路由重定向
       path: '*',
       redirect: '/home'
    }


]



