import Vue from 'vue'
import Router from 'vue-router'
import a from '../view/a.vue'
Vue.use(Router)

const router = new Router({
    mode: 'hash', 
     routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            component: () => import('../view/index.vue')
        }
    ]
})

//动态添加路由
router.$append = (index) => { 
    router.addRoute(`a${index}`,{
        path: `/a${index}`,
        component:  {
            ...a,
            name: `a${index}`
        },
    })  
}

router.$push = (index) => { 
        router.push({
            path:`/a${index}`,
            query:{
                name:`a${index}`
            }
        })
} 
export default  router