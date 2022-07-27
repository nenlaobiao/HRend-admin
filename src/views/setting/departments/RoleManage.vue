<template>
  <div>
    <el-button size="mini" type="primary" @click="addFn">添加角色</el-button>
    <el-table :data="roleList" style="margin-bottom: 18px">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" sortable label="角色名" width="150px" />
      <el-table-column prop="description" sortable label="描述" />
      <el-table-column label="操作">
        <template v-slot="data">
          <el-button type="text" @click="setRoot(data.row.id)">
            分配权限
          </el-button>
          <el-button type="text" @click="setBtn(data.row)">修改</el-button>
          <el-button type="text" @click="del(data.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        :current-page="paramsObj.page"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="paramsObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <el-dialog title="分配权限" :visible.sync="rootDialog">
      <el-tree
        v-if="rootDialog"
        ref="treeRef"
        show-checkbox
        :default-checked-keys="selpermissions"
        default-expand-all
        :data="permissions"
        node-key="id"
        :props="{
          label: 'name',
        }"
      ></el-tree>
      <template #footer>
        <el-button @click="rootDialog = false">取消</el-button>
        <el-button type="primary" @click="seve()">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :title="isEdit ? '修改' : '新增'"
      :visible.sync="addRootDialog"
      @close="reset"
    >
      <el-form
        v-if="addRootDialog"
        ref="addFormRef"
        label-width="80px"
        :model="addForm"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addRootDialog = false">取消</el-button>
        <el-button type="primary" @click="addFormFn">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { treeFn } from '@/utils'
import { getPermissions, getPermissionsById, assignPermission, addRole } from '@/api/permissions'
import { getRoleList, delRoleAPI, editRole } from '@/api/setting'
export default {
  filters: {},
  components: {},
  data () {
    return {
      rootDialog: false,
      addRootDialog: false,
      paramsObj: {
        page: 1,
        pagesize: 5
      },
      roleList: [],
      permissions: [],
      selpermissions: [],
      listTotal: null,
      id: null,
      addForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    // handleNodeClick (value) {
    // console.log(value)
    // },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.paramsObj.pagesize = val
      this.getRoleList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.paramsObj.page = val
      this.getRoleList()
    },
    reset () {
      this.$refs.addFormRef.resetFields()
    },
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      console.log(res)
      this.roleList = res.rows
      this.listTotal = res.total
    },
    async getPermissions (id) {
      const res = await getPermissions()
      this.permissions = treeFn(res, '0')
      const res1 = await getPermissionsById(id)
      this.selpermissions = res1.permIds
      console.log(res1)
    },
    setRoot (id) {
      this.id = id
      this.getPermissions(id)
      this.rootDialog = true
      console.log(id)
    },
    setBtn (row) {
      this.isEdit = true
      this.addRootDialog = true
      this.addForm = Object.assign({}, row)
    },
    addFormFn () {
      this.$refs.addFormRef.validate(async val => {
        if (!val) return this.$message.error('表单数据非法')
        if (this.isEdit) {
          await editRole(this.addForm)
        } else {
          await addRole(this.addForm)
        }
        this.getRoleList()
        this.addRootDialog = false
      })
    },
    addFn () {
      this.addForm = {}
      this.isEdit = false
      this.addRootDialog = true
    },
    async seve () {
      try {
        const data = this.$refs.treeRef.getCheckedKeys()
        console.log(data)
        const res = await assignPermission(this.id, data)
        this.rootDialog = false
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    del (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(id)
        await delRoleAPI(id)
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
