import { createRouter, createWebHashHistory } from 'vue-router';
import a from '../view/a.vue'

const routes = [  
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        component: () => import('../view/index.vue')
    }
];



const router = createRouter({
    history: createWebHashHistory(),
    routes
});



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


export default router;
 