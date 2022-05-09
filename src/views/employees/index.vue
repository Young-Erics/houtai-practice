<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{page.total}}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入excel
          </el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table :data="list" border>
          <!-- sortable表示排序 -->
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment"
            :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <!-- table的作用域插槽slot-scope，也可以写成v-slot，可以获取到当前的行、列等 -->
            <template v-slot="{ row }">
              {{row.timeOfEntry | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <!-- fixed列固定在右侧 -->
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page="page.page"
            :total="page.total" @current-change="changePage" />
        </el-row>
      </el-card>
      <!-- 放置新增组件,sync修饰符是子组件去改变父组件数据的一个语法糖 -->
      <add-employee :showDialog.sync="showDialog" @addemployee="getEmployeeList" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入格式化聘用形式的枚举文件
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/addemployee.vue'
export default {
  data() {
    return {
      showDialog: false,
      loading: false,//显示加载转圈圈
      list: [], // 接收员工列表数据
      page: {
        page: 1, // 当前页码
        size: 10, //每页的条数
        total: 0 // 总数
      }
    }
  },
  components: {
    addEmployee
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      console.log('list', this.list)
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage //赋值最新的页码
      this.getEmployeeList()//重新拉取数据渲染
    },
    // 格式化聘用形式，cellvalue是单元格属性值
    formatEmployment(row, column, cellValue, index) {
      // EmployeeEnum是对象，hireType是对象的属性是个数组
      // find方法返回满足条件的第一个数组元素
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('确认删除该员工吗')
        // 确认后,就删除
        await delEmployee(id)
        // 重新拉取
        this.getEmployeeList()
        // 操作成功
        this.$message('操作成功')
      } catch (error) {

      }
    }
  }
};
</script>

<style>
</style>