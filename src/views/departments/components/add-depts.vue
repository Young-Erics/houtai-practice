<template>
  <!-- 放置弹出的新增部门框 -->
  <!-- visible来控制显示或隐藏 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 label-width设置label的宽度-->
    <el-form label-width="120px" :model="formData" :rules="deptRules" ref="deptForm">
      <el-form-item label="部门名称" prop="name">
        <el-input style="width: 80%" placeholder="1-50个字符" v-model="formData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input style="width: 80%" placeholder="1-50个字符" v-model="formData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select style="width: 80%" placeholder="请选择" v-model="formData.manager"
          @focus="getEmployeeSimple">
          <!-- 循环生成选项 lable要显示的，value是要存储的-->
          <el-option v-for="item in people" :key="item.id" :label="item.username"
            :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <!-- :rows表示3行文本域 -->
        <el-input style="width: 80%" placeholder="1-300个字符" type="textarea" :rows="3"
          v-model="formData.introduce" />
      </el-form-item>
    </el-form>
    <!-- dialog的footer -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
import { updateDepartments } from "@/api/departments";
// 引入Form,validate手动验证就不会报错了
import { Form } from "element-ui";
export default {
  data() {
    // 自定义校验函数，目的是去找同级部门下是否有重复的部门名称
    const checkNameRepeat = async (rule, value, callback) => {
      // getDepartments返回data对象，data对象中有depts属性，于是对象解构，将对象属性的值赋值给变量
      // 这里用最新的部门数据进行新增部门名称的校验
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        // 编辑场景下的校验，编辑时部门数据已经在数据库中了
        isRepeat = depts
          .filter(
            (item) =>
              // 这一步是筛选出所有除自身部门以外的同级部门
              item.pid === this.formData.pid && item.id !== this.treeNode.id
          )
          // 筛选完毕之后就可以比较是否重名了
          .some((item) => item.name === value);
      } else {
        // 没有id就是新增场景下
        // 筛选出点击节点的所有子部门，depts是数组包裹的对象
        isRepeat = depts
          .filter((item) => {
            return item.pid === this.treeNode.id;
          })
          //  子部门有没有名字和新增的部门名字一样，返回布尔值
          .some((item) => {
            return item.name === value;
          });
      }

      // 如果为true，说明有一样的名字，提示错误；如果为false就callback放行
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback();
    };
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        isRepeat = depts.some(
          // 编辑模式下不算自己，所以通过id吧自己筛出去
          (item) => item.id !== this.treeNode.id && item.code === value && value
        ); // 这里加一个 value不为空 因为我们的部门有可能没有code
      } else {
        // 新增场景下
        isRepeat = depts.some((item) => item.code === value && value);
      }

      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback();
    };
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      deptRules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkNameRepeat },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkCodeRepeat },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
      people: [], // 接收获取的员工简单列表的数据
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  methods: {
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      this.people = await getEmployeeSimple();
    },
    btnOK() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          // 要分清楚现在是编辑还是新增
          if (this.formData.id) {
            // 编辑模式  调用编辑接口
            await updateDepartments(this.formData);
          } else {
            // 新增模式
            // 新增部门需要传入五个参数，设置接口以data对象作为参数传入，所以传入的是对象
            // 三个点this.formData是将其四个属性拆分出来
            await addDepartments({ ...this.formData, pid: this.treeNode.id });
          }
          // 告诉父组件，重新拉取数据
          this.$emit("addDepts");
          // 此时去修改showDialog为false,关闭弹窗
          // update:固定写法 (update:props名称, 值)
          this.$emit("update:showDialog", false);
          // 关闭dialog时候，会调用close事件，而close事件的方法是btnCancel，所以不需要再重置表单
        }
      });
    },
    btnCancel() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      // 如若不重置数据，点完编辑部门后，getDepartDetail会给formData添加id属性，这时候再去点添加
      // 子部门，formData的id属性还在，title就会仍然显示新增子部门
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      // 子传父，关闭弹窗
      this.$emit("update:showDialog", false);
      // 移除表单校验结果
      this.$refs.deptForm.resetFields();
    },
    async getDepartDetail(id) {
      // props传值是异步的，上面的id作为参数，再传给下面的id
      this.formData = await getDepartDetail(id);
    },
  },
};
</script>

<style>
</style>