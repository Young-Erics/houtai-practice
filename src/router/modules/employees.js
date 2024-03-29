//导出员工的路由规则
//引入一级路由 布局layout
import Layout from '@/layout'
export default {
    path: '/employees',
    name: 'employees', // 给路由规则加一个name
    component: Layout,
    children: [{
        //二级路由path为空，表示它是二级路由的默认页面
        path: '',
        //动态加载员工组件
        component: () =>
            import ('@/views/employees'),
        //meta是路由元信息，可以储存数据，放任何内容
        meta: {
            title: '员工管理', // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
            icon: 'people'
        }
    }, {
        path: 'detail/:id', // query传参 动态路由传参. 若:id后加 ? 表示该id可传可不传，都能访问
        component: () =>
            import ('@/views/employees/detail'),
        hidden: true, // 不在左侧菜单显示
        meta: {
            title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        }
    }]
}