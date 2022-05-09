import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
        token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
        // 用户个人信息
        userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
    }
    // 修改状态
const mutations = {
        setToken(state, token) { //这里的token相当于载荷payload，这一行setToken是vuex的方法
            state.token = token //将数据设置给vuex
                //一旦vuex中的token变化，都将变化同步给缓存
            setToken(token) //再调用一次引入的setToken方法，以将传进入的token同步给缓存
        },
        removeToken(state) {
            state.token = null // 删除vuex的token
            removeToken() // 再清除缓存的token,达到 vuex和 缓存数据的同步
        },
        // 设置用户信息
        setUserInfo(state, result) {
            state.userInfo = result
                // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
                // state.userInfo = { ...result } 
        },
        // 删除用户信息
        reomveUserInfo(state) {
            state.userInfo = {}
        }
    }
    // 执行异步
const actions = {
    // 这是actions里定义的异步函数login
    async login(context, data) {
        // 拿到token
        const result = await login(data) // 实际上就是一个promise  result就是执行的结果
            // axios默认给数据加了一层data，但在request响应拦截器中统一处理了这个问题
        if (result) {
            // 设置token
            context.commit('setToken', result)
                // 拿到token说明登录成功
                // 设置当前时间戳
            setTimeStamp()
        }
        // if (result.data.success) {
        //     // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
        //     // actions 修改state 必须通过mutations
        //     context.commit('setToken', result.data.data)
        // }

    },
    async getUserInfo(context) {
        const result = await getUserInfo()
            // 通过用户ID获取员工基本资料，里面有头像
        const baseInfo = await getUserDetailById(result.userId)
            // 将用户基本信息和员工基本资料合并到一起
        const userAll = {...result, ...baseInfo }
        context.commit('setUserInfo', userAll) //将整个的个人信息设置到vuex中
        return userAll // 这里为什么要返回 为后面埋下伏笔
    },
    // 退出登录
    logout(context) {
        // 删除用户token
        context.commit('removeToken')
            // 删除用户信息
        context.commit('reomveUserInfo')
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}