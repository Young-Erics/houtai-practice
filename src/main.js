import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
// 导入所有的自定义指令
// * as 变量 得到的是一个对象{ 变量1：对象1，变量2： 对象2 ...   }
import * as directives from '@/directive'
import * as filters from '@/filters' // 引入工具类
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control，引入代码，就执行了
// 不使用，就给它注释掉
// if (process.env.NODE_ENV === 'production') {
//     const { mockXHR } = require('../mock')
//     mockXHR()
// }
// set ElementUI lang to EN
// 引入并注册所有的公关组件
import Component from '@/components'
Vue.use(Component) // 注册自己的插件
    // 注册所有的自定义指令
    // Object.keys遍历对象，得到数组的形式，数组遍历注册所有自定义指令
Object.keys(directives).forEach(key => {
        // key代表属性名，directives[key]代表属性值
        Vue.directive(key, directives[key])
    })
    // 注册全局的过滤器
Object.keys(filters).forEach(key => {
    // 注册过滤器
    Vue.filter(key, filters[key])
})
Vue.use(ElementUI, { locale })
    // 如果想要中文版 element-ui，按如下方式声明
    // Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})