<template>
  <div>
    <!-- 公共导入组件 -->
    <!-- on-success 是组件的props参数，是个函数，定义success方法来绑定它 -->
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    // 如果是导入员工。results是个数组，数组里面有三个对象作为数组元素
    // onSuccess传出一个头和尾，就是对象excelData
    // { header, results }这样写实际上是对excelData的对象解构，用相同的变量名称来匹配对象中的属性
    async success({ header, results }) {
      // result数组里面的item对象的key是中文，所以要转换为英文才能调接口
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        // item是个对象，当做{手机号：13586693446}
        //item又是个对象， Object.keys(item)返回的是一个key键的数组
        const userInfo = {}
        // 遍历item对象，其只有一个键值对，如{手机号：13586693446}
        Object.keys(item).forEach(key => {
          //由于key是中文，是属性，它和userRelations的属性对应一致
          //userRelations[key]传入中文的key返回的就是timeOfEntry等英文的值
          //将原来中文对应的值赋值给英文对应的值
          // 下面一步可以看做是 userInfo[mobile] = 13586693446
          userInfo[userRelations[key]] = item[key]
        })
        // 实际上就是将results的结果变成了arr
        arr.push(userInfo) //userinfo是个对象，最后的结果就是个包含对象的数组，跟results一样，只是做了中文转英文
      })
      await importEmployee(arr) // 调用导入接口
      this.$message.success('导入成功')
      // 导入功能是个单独的路由页面，若导入成功就返回点击导入的页面
      this.$router.back()
      //第二种方法
      //map返回一个数组循环后的return的结果
      // var newArr = results.map(item => {
      //   const userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     userInfo[userRelations[key]] = item[key]
      //   })
      //   return userInfo 
      // })
    }
  }
}
</script>

<style>
</style>