// practice 考试试卷
const test = () => import('@/pages/test/test.vue')

//解析==报告
const test_report = () => import('@/pages/testreport/test_report.vue')


//页面首页 --暂时使用 
const index = () => import('@/pages/index.vue')

////新增--错题本
//const errorBook = () => import('@/pages/errorBook/errorBook.vue')
//
////新增--收藏页面
//const collection = () => import('@/pages/collection/collection.vue')


export default [
    {
        path: '/test',
        name: 'test',
        component: test,
        meta: {
            page_title: '试卷',
            requireAuth: false
        }
    },
    
    
    {//路由的重定向
       path: '/',
       redirect: '/index'
    },
    {
        path: '/index',
        name: 'index',
        component: index,
        meta: {
            page_title: '临时使用首页入口',
            requireAuth: false
        }
    },
    
    
    
    {
        path: '/test_report',
        name: 'test_report',
        component: test_report,
        meta: {
            page_title: '考试解析',
            requireAuth: false
        }
    },
    

    
]



