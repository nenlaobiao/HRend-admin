<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ isTitle ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="isTitle">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="adddialogVisible"
      width="50%"
      @click.native.stop
      @close="handleAddForm"
    >
      <el-form
        ref="addForm"
        label-width="100px"
        :model="addDepartmentFrom"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentFrom.name"
            placeholder="1~50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addDepartmentFrom.code"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="addDepartmentFrom.manager"
            placeholder="请选择"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(obj, index) in users"
              :key="index"
              :label="obj.username"
              :value="obj.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentFrom.introduce"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment, getSimpleUserList, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      const res = await getDepartmentsList()
      if (this.isEdit) {
        const pid = this.node.data.pid
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      } else {
        const id = this.node.data ? this.node.data.id : ''
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      isEdit: false,
      adddialogVisible: false,
      addDepartmentFrom: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: ''// 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      },
      users: []
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    },
    isTitle () {
      return !!this.node.data
    }
  },
  watch: {},
  created () {
  },
  methods: {
    handleAddForm () {
      this.$refs.addForm.resetFields()
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log(res)
      this.users = res
    },
    async onCommand (key) {
      if (this.users.length < 1) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        this.isEdit = false
        console.log('添加')
        this.adddialogVisible = true
      } else if (key === 'b') {
        this.isEdit = true
        this.adddialogVisible = true
        this.addDepartmentFrom = { ...this.node.data }
        console.log('查看')
      } else {
        console.log('删除')
        try {
          await this.$confirm('是否删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          console.log('用户确定了')
          const res = await delDepartment(this.node.data.id)
          console.log(res)
          this.$emit('delDepartment')
        } catch (error) {
          console.log(error)
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    },
    async onSubmit () {
      if (this.isEdit) {
        delete this.addDepartmentFrom.children
        await editDepartment(this.addDepartmentFrom)
      } else {
        this.addDepartmentFrom.pid = this.node.data ? this.node.data.id : ''
        const res = await addDepartment(this.addDepartmentFrom)
        console.log(res)
      }
      this.adddialogVisible = false
      this.$emit('delDepartment')
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
