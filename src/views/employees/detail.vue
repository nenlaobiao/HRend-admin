<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="登录账号设置" name="first">
          <el-form
            ref="form"
            :model="userInfoFrom"
            :rules="userInfoRules"
            label-width="80px"
            style="width: 400px; margin-left: 200px; margin-top: 50px"
          >
            <el-form-item label="姓名" prop="username">
              <el-input v-model="userInfoFrom.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userInfoFrom.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">更新</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <UserInfo v-if="index == 1" :id="id"></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <JobInfo v-if="index == 2"></JobInfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import JobInfo from './components/JobInfo.vue'
import UserInfo from './components/UserInfo.vue'
import { getUserDetailById, saveEmployee } from '@/api/user'
export default {
  filters: {},
  components: { UserInfo, JobInfo },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      index: 0,
      password: null,
      activeName: 'first',
      userInfoFrom: {
        username: ''
      },
      userInfoRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
        // password: [
        //   { required: true, message: '密码不能为空', trigger: 'blur' }
        // ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    handleClick (tab) {
      console.log(tab.index)
      this.index = tab.index
    },
    async getUserDetailById () {
      const res = await getUserDetailById(this.id)
      // console.log(res)
      this.password = res.password
      this.userInfoFrom = res
      this.userInfoFrom.password = null
    },
    save () {
      this.$refs.form.validate(async val => {
        if (!val) return this.$message.error('表单数据校验失败')
        if (!this.userInfoFrom.password) {
          this.userInfoFrom.password = this.password
        }
        await saveEmployee(this.id, this.userInfoFrom)
        // console.log(res)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
