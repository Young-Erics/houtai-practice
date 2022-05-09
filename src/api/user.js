import request from '@/utils/request'

export function login(data) {
    return request({
        // axios返回了一个promise对象
        url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api，所以url不写api
        method: 'post',
        data
    })
}
// 获取用户个人信息
export function getUserInfo() { //括号里不用参数，因为要携带的token已经在请求拦截器中统一处理
    return request({
        url: '/sys/profile',
        method: 'post'
    })
}
// 获取用户头像
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}
export function logout() {
    return request({
        url: '/vue-admin-template/user/logout',
        method: 'post'
    })
}