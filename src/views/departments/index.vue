<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织结构头部 -->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置树形组件tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 插槽内容 有多少departs对象 就循环多少次tree-tools -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments"
            @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增子部门弹窗组件 -->
    <add-depts ref="addDepts" :show-dialog.sync="showDialog" :tree-node="node"
      @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-toos.vue'
import addDepts from './components/add-depts.vue'
import { getDepartments } from '@/api/departments'
import { transtListToTree } from '@/utils'
export default {
  components: {
    TreeTools,
    addDepts
  },
  data() {
    return {
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: {
        // name: "", manager: ""
      }, // 头部数据
      departs: [
        // {
        //   name: "总裁办",
        //   manager: "曹操",
        //   children: [{ name: "董事会", manager: "曹丕" }],
        // },
        // { name: "行政部", manager: "刘备" },
        // { name: "人事部", manager: "孙权" },
      ],
      showDialog: false,
      node: null // 记录当前点击的节点
    }
  },
  created() {
    this.getDepartments() // 调用获取部门的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // console.log(result);
      this.company = {
        name: result.companyName,
        manager: '负责人杨陈',
        id: ''
      }
      // transtListToTree方法将扁平数组转化为树形结构
      this.departs = transtListToTree(result.depts, '')
    },
    addDepts(node) {
      this.showDialog = true
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来
      this.node = node
    },
    editDepts(node) {
      // 首先打开弹层
      this.showDialog = true
      // 赋值操作的节点
      this.node = node
      // 父组件 调用子组件的方法
      this.$refs.addDepts.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style scoped>
.tree-card {
  /* 上下内边距30，作用内边距140 */
  padding: 30px 140px;
  font-size: 14px;
}
</style>
