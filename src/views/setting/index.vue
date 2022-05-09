<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true">
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <!-- width定义列宽 -->
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" label="角色名称" prop="name" width="240" />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽获取点击的行 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <!-- row.id表示可以获取到data绑定的list中的id属性,row.id传值给此方法 -->
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <!-- page-size每页显示的条目个数 -->
              <el-pagination layout="prev,pager,next" :current-page="page.page"
                :page-size="page.pagesize" :total="page.total" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon
              :closable="false" />
            <!-- 右边内容 公司信息 -->
            <!-- 只有做表单校验的时候才会在form中写model和rule -->
            <el-form label-width="120px" style="margin-top: 50px">
              <!-- disabled禁止点击 -->
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled
                  style="width: 400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置弹窗组件，编辑窗口 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], //承接返回的角色数据，是个数组
      page: {
        // 放置页码及相关数据
        page: 1, // 页码
        pagesize: 3, // 每页条数
        total: 0 // 记录总数
      },
      formData: {},// 承载公司信息
      showDialog: false,
      // 专门接收新增或者编辑的角色详情
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表,初始化
    this.getCompanyInfo() // 获取公司信息
  },

  methods: {
    async getRoleList() {
      // getRoleList接口需要传入page和pagesize两个参数，data中定义了page对象，虽然有三个属性但依然可以传入
      // getRoleList返回的data就是total和rows,所以这里进行解构
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList() // 最新页码变了，就要重新获取下数据
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId) // 赋值给formData
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认要删除此角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        // console.log(error);
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) //获取被编辑角色的详情
      this.showDialog = true //显示编辑弹窗，放在获取角色详情后面是避免会有数据延迟的现象
    },
    async btnOK() {
      // 用promise的方式写手动校验
      try {
        await this.$refs.roleForm.validate()
        // 校验成功后就调用更新角色接口,此时你编辑的名称随着双向绑定更新了roleForm
        if (this.roleForm.id) {
          //  这是编辑场景
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        // 重新渲染页面数据
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch {

      }
    },
    btnCancel() {
      // 取消按钮，就要重置表单，移除校验
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
  }
}
</script>

<style></style>
