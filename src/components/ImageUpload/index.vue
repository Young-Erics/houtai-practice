<template>
  <div>
    <!-- action 一个#号，不会报错 -->
    <el-upload :class="{disabled: fileComputed }" list-type="picture-card" :on-preview="preview" :on-remove="handleRemove" :on-change="changeFile"
      :file-list="fileList" :limit="1" action="#">
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [], // 图片地址设置为数组 
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击文件列表中已上传的图片时的钩子，实现预览功能
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>