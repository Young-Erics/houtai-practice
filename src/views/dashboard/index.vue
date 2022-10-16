<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ userName }}</div>
    是啊
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  created() {
    const a = _.uniq([2, 1, 2]);
    console.log('去重数组', a)
    // let x = -1
    // if (x < 0) {
    //   throw new Error('x 必须为正数');
    // }
  },
  components: {

  },
  computed: {
    ...mapGetters([
      'userName'
    ])
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
