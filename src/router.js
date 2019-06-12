import Vue from 'vue'
import Router from 'vue-router'
import HomePageView from '@/views/HomePage'
import Login from "@/views/user/Login";
import BasicLayout from "@/components/BasicLayout";
import SessionLayout from "@/components/SessionLayout";
import PageView from "@/components/PageView";
import Register from "@/views/user/Register";
import api from "@/api";

Vue.use(Router);

let constRouter = [
    {
        path: '/session',
        component: SessionLayout,
        redirect: '/session/login',
        children: [
            {
                // 当 /session/login 匹配成功，
                // Login 会被渲染在 SessionLayout 的 <router-view> 中
                path: 'login',
                name: 'login',
                component: Login
            },
            {
                // 当 /session/register 匹配成功，
                // Register 会被渲染在 SessionLayout 的 <router-view> 中
                path: 'register',
                name: 'register',
                component: Register
            },
        ]
    },
    {
        path: '/index',
        name: '首页',
        redirect: '/home'
    }
];
let router = new Router({
    routes: constRouter
});

const whiteList = ['/session/login']; //白名单

let asyncRouter; //异步路由器

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
    if (whiteList.indexOf(to.path) !== -1) { //返回某个指定的字符串值在字符串中首次出现的位置
        next()
    }
    let token = get('USER_TOKEN');
    let user = get('USER');
    let userRouter = get('USER_ROUTER');
    if (token && user) {
        if (!asyncRouter) {
            if (!userRouter) {
                //根据username 获取菜单权限
                api.user.menuData(user.username).then((res) => {
                    asyncRouter = res.data;
                    save('USER_ROUTER', asyncRouter);
                    go(to, next)
                })
            } else {
                asyncRouter = userRouter;
                go(to, next)
            }
        } else {
            next()
        }
    } else {
        next('/session/login')
    }
});

function go(to, next) {
    asyncRouter = filterAsyncRouter(asyncRouter);
    router.addRoutes(asyncRouter);
    next({...to, replace: true})
}

function save(name, data) {
    localStorage.setItem(name, JSON.stringify(data))
}

function get(name) {
    return JSON.parse(localStorage.getItem(name)) || null
}


function filterAsyncRouter(routes) {
    return routes.filter((route) => {
        let component = route.component;
        if (component) {
            switch (route.component) {
                case 'MenuView':
                    route.component = BasicLayout;
                    break;
                case 'PageView':
                    route.component = PageView;
                    break;
                case 'HomePageView':
                    route.component = HomePageView;
                    break;
                default:
                    route.component = view(component)
            }
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children)
            }
            return true
        }
    })
}

function view(path) {
    return function (resolve) {
        import(`@/views/${path}.vue`).then(mod => {
            resolve(mod)
        })
    }
}

export default router
