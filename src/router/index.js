import Vue from 'vue'
import Router from 'vue-router'
// import a from '../view/a.vue'
import a from '../view/a2.vue' //使用复杂的vue场景
import index from '../view/index.vue'
import Layout from '../view/Layout'

Vue.use(Router)

const router = new Router({
    mode: 'hash', 
     routes: [
        {
            path : "/sub",
            component: Layout,
            children: [
                {
                    path: '/sub/index',
                    component: () => import('../view/index.vue')
                }, 
            ]
        },
        {
            path: '/', 
            redirect: '/sub',
        },
      
    ]
})

const subList = []

//动态添加路由
router.$append = (index) => { 
    // debugger
    subList.push( {
        path: `/sub/a${index}`,
        component:  {
            ...a,
            name: `a${index}`
        }
    } 
    )
    const newRoutes =  
        {
            path : "/sub",
            component: Layout,
            children: [
                {
                    path: '/sub/index',
                    component: {...index}
                }
            ]
        }
        newRoutes.children = newRoutes.children.concat(subList)
        router.addRoute(newRoutes)
}

router.$push = (index) => { 
        router.push({
            path:`/sub/a${index}`,
            query:{
                name:`a${index}`
            }
        })
} 

const createRouter = (routes) => new Router({
    mode: 'hash', 
    routes 
})
// 刷新路由的方法重新构建新的路由然后替换 matcher 达到刷新的效果 如果routes内容出现变动的话
const resetRouter = (routes) => {
    const newRouter = createRouter(routes)
    router.matcher = newRouter.matcher // 替换matcher
}

export default  router