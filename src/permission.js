// permission是处理路由权限的
// 引入路由实例
import router from '@/router'
// 引入vuex store实例
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 定义白名单, 所有不受权限控制的页面
const whiteList = ['/login', '/404']
    // 前置守卫,进入路由前，对路由权限判断时
router.beforeEach(async(to, from, next) => {
        NProgress.start() // 开启进度条
            // 首先判断是否有token
        if (store.getters.token) {
            //   如果有token 继续判断是不是去登录页
            if (to.path === '/login') {
                // 是去登录页的话，那我们直接去主页
                next('/')
                    // 不是去登录页的话，那么就直接放行
            } else {
                // 只有通过了才去获取用户资料
                // 没有用户资料的时候才去获取，用userID作为判断条件
                if (!store.getters.userId) {
                    // 只有获取完用户的资料后，才进行路由跳转，所以这里必须加await
                    await store.dispatch('user/getUserInfo')
                }
                next()
            }
            // 要是没有token
        } else {
            // 如果在白名单就放过通行
            if (whiteList.indexOf(to.path) > -1) {
                next()
                    // 不在白名单，就去登录页
            } else {
                next('/login')
            }
        }
        NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
    })
    // 后置守卫，进入路由后
router.afterEach(() => {
    NProgress.done() // 关闭进度条
})