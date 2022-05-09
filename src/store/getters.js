const getters = {
    //快捷访问模块
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token, //箭头前的state是全局的
    userName: state => state.user.userInfo.username, // 建立用户名称的映射
    userId: state => state.user.userInfo.userId, // 建立用户id的映射
    userAvatar: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
    companyId: state => state.user.userInfo.companyId
}
export default getters