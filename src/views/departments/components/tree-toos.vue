<template>
  <!-- slot-scope="{ data }"原本封装前是写在el-row里面的 -->
  <!-- space-between先两侧靠拢，再平分剩余空间 -->
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- span表示占据4列 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>操作 <i class="el-icon-arrow-down" /></span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true, // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 操作节点调用的方法
    operateDepts(type) {
      if (type === "add") {
        // 添加子部门的操作
        // 触发自定义事件，告诉父组件要显示弹窗了
        this.$emit("addDepts", this.treeNode); //this.treeNode就是当前点击的部门
      } else if (type === "edit") {
        //  编辑部门的操作
        this.$emit("editDepts", this.treeNode); //this.treeNode点击谁就编辑谁
      } else {
        //  删除操作.then里面传入的是一个callback回调函数
        // 因为在使用confirm时点击确认的回调从.then中传入，this.$confirm()会return出一个Promise对象
        this.$confirm("确定要删除吗")
          .then(() => {
            // 返回的是一个promise对象
            return delDepartments(this.treeNode.id);
          })
          // 后台删除成功后，要传父组件更新,子传父通过$emit触发自定义事件
          .then(() => {
            this.$emit("delDepts");
            this.$message.success("删除部门成功");
          });
      }
    },
  },
};
</script>

<style>
</style>