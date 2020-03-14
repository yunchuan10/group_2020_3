// practice 考试试卷
const test = () => import('@/pages/test/test.vue')

//解析==报告
const report = () => import('@/pages/report/practice')

//练习 习题
//const exercises = () => import('@/pages/exercises/exercises.vue')

// 新版本练习题
const newExercises = () => import('@/pages/new-exercises/new-exercises.vue')


//练习 习题 解析
const testReport = () => import('@/pages/testReport/new-exercises.vue')

//页面首页 --暂时使用 
const index = () => import('@/pages/index.vue')

//新增--错题本
const errorBook = () => import('@/pages/errorBook/errorBook.vue')

//新增--收藏页面
const collection = () => import('@/pages/collection/collection.vue')


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
        path: '/report',
        name: 'report',
        component: report,
        meta: {
            page_title: '考试解析',
            requireAuth: false
        }
    },
//  {
//      path: '/exercises',
//      name: 'exercises',
//      component: exercises,
//      meta: {
//          page_title: '练习题',
//          requireAuth: false
//      }
//  },
    {
        path: '/testReport',
        name: 'testReport',
        component: testReport,
        meta: {
            page_title: '练习解析',
            requireAuth: false
        }
    },
    {
        path: '/new-exercises',
        name: 'new-exercises',
        component: newExercises,
        meta: {
            page_title: '练习',
            requireAuth: false
        }
    },
    //新增--错题本
    {
        path: '/errorBook',
        name: 'errorBook',
        component: errorBook,
        meta: {
            page_title: '错题集',
            requireAuth: false
        }
    },
     //新增--错题本
    {
        path: '/collection',
        name: 'collection',
        component: collection,
        meta: {
            page_title: '收藏',
            requireAuth: false
        }
    },
    
]



