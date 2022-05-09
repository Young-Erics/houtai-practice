// 这个文件负责管理所有的自定义指令
export const imgerror = {
    // 指令对象，在当前dom元素插入到节点之后触发一次
    // options是指令中变量的解释
    inserted(dom, options) {
        // onerror是指图片有地址但加载失败会触发的事件，会报错
        dom.onerror = function() {
            // 当图片出现异常的时候，会将指令配置的图片设置为默认图片
            dom.src = options.value
        }
    }
}