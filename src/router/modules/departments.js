//导出员工的路由规则
//引入一级路由 布局layout
import Layout from '@/layout'
export default {
    path: '/departments',
    name: 'departments', // 给路由规则加一个name
    component: Layout,
    children: [{
        //二级路由path为空，表示它是二级路由的默认页面
        path: '',
        //动态加载员工组件
        component: () =>
            import ('@/views/departments'),
        //meta是路由元信息，可以储存数据，放任何内容
        meta: {
            title: '组织架构', // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
            icon: 'tree'
        }
    }]
}