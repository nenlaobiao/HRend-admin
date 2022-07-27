<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="1消息提示的文案">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel">
            普通Excel导出
          </el-button>
          <el-button type="info" size="mini" @click="exportExcel1">
            复杂表头Excel导出
          </el-button>
          <el-button
            type="success"
            size="mini"
            @click="$router.push('/import?type=user')"
            >Excel导入</el-button
          >
          <el-button type="primary" size="mini" @click="addEmpVisible = true">
            新增员工
          </el-button>
        </template>
      </PageTool>
      <el-card>
        <el-table border :data="employees">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="70px"
          />
          <el-table-column
            align="center"
            label="姓名"
            sortable
            prop="username"
          />
          <el-table-column align="center" label="头像">
            <template v-slot="scope">
              <div
                style="width: 50px; height: 30px"
                @click="showQrFn(scope.row.staffPhoto)"
              >
                <img
                  v-imgerror
                  :src="scope.row.staffPhoto"
                  alt=""
                  style="width: 50px"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="手机号"
            prop="mobile"
            min-width="110px"
          />
          <el-table-column align="center" label="工号" prop="workNumber" />
          <!-- <el-table-column
            align="center"
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          /> -->
          <!-- <el-table-column
            align="center"
            label="聘用形式"
            prop="formOfEmployment"
          >
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatterForm }}
            </template>
          </el-table-column> -->

          <el-table-column align="center" label="部门" prop="departmentName" />
          <el-table-column align="center" label="入职时间" min-width="100px">
            <template v-slot="scope">
              <span>{{ scope.row.timeOfEntry | dateformat }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template v-slot="scope">
              <el-switch v-model="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="230px">
            <template v-slot="scope">
              <el-button
                type="text"
                size="mini"
                @click="$router.push('/employees/detail/' + scope.row.id)"
                >查看</el-button
              >
              <el-button type="text" size="mini">转正</el-button>
              <el-button type="text" size="mini">调岗</el-button>
              <el-button type="text" size="mini">离职</el-button>
              <el-button
                type="text"
                size="mini"
                @click="setRoleVisibleFn(scope.row.id)"
              >
                角色
              </el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog title="分配角色" :visible.sync="setRoleVisible" width="45%">
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="obj in roleList"
          :key="obj.id"
          :label="obj.id"
          border
          >{{ obj.name }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer">
        <el-button @click="setRoleVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="assignRoles"> 确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增员工"
      :visible.sync="addEmpVisible"
      width="45%"
      @close="handleClose"
    >
      <el-form
        ref="employeeRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="employeeForm.formOfEmployment"
            placeholder="请选择"
          >
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="showDepartment"
          ></el-input>
          <el-tree
            v-if="departmentList.length > 0"
            default-expand-all
            :data="departmentList"
            :props="{ label: 'name' }"
            @node-click="handleNodeClick"
          />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addEmpVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="addEmpVisibleFn"> 确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="showQr" title="图片二维码">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { validMobile } from '@/utils/validate'
import { getPersonalDetail, assignRoles } from '@/api/user'
import { getRoleList } from '@/api/setting'
import { getDepartmentsList } from '@/api/departments'
import { getUserList } from '@/api/employees'
import employees from '@/constant/employees'
export default {
  filters: {
    formatterForm (id) {
      var obj = employees.hireType.find(item => item.id === id - 0)
      if (obj) {
        return obj.value
      } else {
        return '未知'
      }
    }
  },
  components: {},
  data () {
    const validateMobile = (rule, value, callback) => {
      validMobile(value) ? callback() : callback(new Error('手机号格式不对'))
    }
    return {
      checkList: [],
      roleList: [],
      showQr: false,
      addEmpVisible: false,
      setRoleVisible: false,
      getData: {
        page: 1,
        size: 20
      },
      total: null,
      employees: [],
      id: null,
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      employeeFormRules: {
        mobile: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      hireType: employees.hireType,
      departmentList: []
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserList()
  },
  methods: {
    showQrFn (src) {
      this.showQr = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, src, function (error) {
          if (error) console.error(error)
          console.log('success')
        })
      })
    },
    handleClose () {
      this.$refs.employeeRef.resetFields()
    },
    async getUserList () {
      const res = await getUserList(this.getData)
      console.log(res)
      this.total = res.total
      this.employees = res.rows
    },
    formatterEmployee (row, column, cellValue, index) {
      return employees.hireType.find(item => item.id === cellValue).value
    },
    async exportExcel () {
      const { rows } = await getUserList({ page: 1, size: 9999 })
      console.log(rows)
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var data = []
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
        data.push(Object.values(item))
      })
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = ['编号', '名字']
        // const data = [[1, '张三'], [2, '李四']]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '人力资源表格', // 文件名 --- 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 文件类型 --- 非必填
        })
      })
      // console.log(data)
    },
    exportExcel1 () {
      const multiHeader = [['', '主要信息', '', '', '', '', '']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    },
    async setRoleVisibleFn (id) {
      this.id = id
      this.checkList = []
      this.setRoleVisible = true
      const { rows } = await getRoleList({ page: 1, pagesize: 9999 })
      const { roleIds } = await getPersonalDetail(id)
      this.roleList = rows
      this.checkList = roleIds
    },
    async assignRoles () {
      const res = await assignRoles({
        id: this.id,
        roleIds: this.checkList
      })
      console.log(res)
      this.setRoleVisible = false
    },
    addEmpVisibleFn () {

    },
    async showDepartment () {
      const res = await getDepartmentsList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      var data = tranferListToTree(res.depts, '')
      console.log(data)
      this.departmentList = data
    },
    handleNodeClick (data) {
      this.employeeForm.departmentName = data.name
      this.departmentList = []
    }

  }

}
</script>

<style scoped lang='scss'>
</style>
