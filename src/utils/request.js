// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
// 导入vuex实例
import store from '@/store'
// 导入路由
import router from '@/router'
// 导入element-ui的提示方法Message
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
// 定义超时时间3600秒，一个小时
var timeOut = 3600
    // 创建一个axios的实例
const service = axios.create({
        // 设置axios请求的开发环境地址
        // 这是在development中的基础变量，该变量已经定义/api
        baseURL: process.env.VUE_APP_BASE_API,
        timeout: 5000 // 定义5秒超时
    })
    // 请求拦截器
service.interceptors.request.use(config => {
        // config 是请求的配置信息
        // 注入token
        if (store.getters.token) {
            // 注意，checkTimeOut后一定要跟括号，表示调用函数，才会返回布尔值
            if (checkTimeOut()) {
                // 如果为true，表示token过期了，就要登出
                store.dispatch('user/logout')
                    // 还要返回登录页
                router.push('/login')
                    // 过期了也要提示token过期的信息
                return Promise.reject(new Error('token过期了'))
            }
            config.headers['Authorization'] = `Bearer ${store.getters.token}`
        }
        return config
    }, error => {
        return Promise.reject(error)
    })
    // 响应拦截器，包含两个参数函数，一个是执行成功一个是执行失败
service.interceptors.response.use(response => {
        // axios返回结果数据默认加了一层data包裹,所以响应成功要解构数据
        // 对象解构是用定义的变量名来匹配对象的属性，若匹配成功，将属性值赋值给变量
        const { success, message, data } = response.data
            // 根据success成功与否来执行操作
        if (success) {
            return data
        } else {
            Message.error(message)
                // else里面没有error，所以需要new一个
            return Promise.reject(new Error(message))
        }
    }, error => {
        // error里面有response对象
        if (error.response && error.response.data && error.response.data.code === 10002) {
            // 当后端返回100002时，证明token超时了
            store.dispatch('user/logout')
            router.push('/login')
        } else {
            // 大写Message是框架的提示信息方法，括号里的message是后端返回的错误信息
            Message.error(error.message)
        }
        // 返回执行错误，跳出执行链，进入catch
        return Promise.reject(error) //error是错误对象
    })
    // 定义是否超时的函数。超时逻辑：当前时间 - 存入时间戳时间 > timeOut 超时时间
function checkTimeOut() {
    // 当前时间
    var currentTime = Date.now()
        // 时间戳时间
    var timeStamp = getTimeStamp()
        // 因为时间是毫秒单位，所以转换为秒要除以1000
    return (currentTime - timeStamp) / 1000 > timeOut
}
export default service // 导出axios实例