<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card
        v-loading="isLoding"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="min-width: 700px"
      >
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem
              :node="titleObj"
              @delDepartment="getDepartmentsList"
            ></TreeItem>
            <el-tree :data="treeData" default-expand-all>
              <template v-slot="scope">
                <TreeItem
                  :node="scope.node"
                  @delDepartment="getDepartmentsList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getDepartmentsList } from '@/api/departments'
import TreeItem from './components/TreeItem.vue'
export default {
  filters: {},
  components: { TreeItem },
  data () {
    return {
      treeData: [],
      titleObj: {},
      isLoding: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentsList()
  },
  methods: {
    async getDepartmentsList () {
      this.isLoding = true
      const res = await getDepartmentsList()
      console.log(res)
      function dataFn (list, pid) {
        var arr = []
        list.forEach((item) => {
          if (item.pid === pid) {
            arr.push(item)
            item.children = dataFn(list, item.id)
            if (item.children.length < 1) {
              // delete item.children
            }
          }
        })
        return arr
      }
      const data = dataFn(res.depts, '')
      this.titleObj = res.depts[0]
      console.log(data)
      this.isLoding = false
      this.treeData = data
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
