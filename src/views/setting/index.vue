<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="公司管理" name="first">
          <RoleManage></RoleManage>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <CompanyInfo></CompanyInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CompanyInfo from './departments/CompanyInfo.vue'
import RoleManage from './departments/RoleManage.vue'
export default {
  filters: {},
  components: { RoleManage, CompanyInfo },
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    handleClick (val) {
      console.log(val.name)
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
