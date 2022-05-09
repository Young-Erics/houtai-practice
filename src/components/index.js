// 该文件负责所有的公共的组件的全局注册   Vue.use
import pageTools from './pagetools'
import UploadExcel from './UploadExcel'
export default {
    install(Vue) {
        //  注册全局的通用栏组件对象
        Vue.component('pageTools', pageTools)
        Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    }
}