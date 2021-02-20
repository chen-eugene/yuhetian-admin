<template>
  <div class="app-container">
    <div class="wrapper">
      <div class="header">
        <span class="tips">用户列表</span>
        <el-button icon="el-icon-circle-plus" size="mini" type="primary" class="action-add" @click="openAddUserDialog">
          添加账号
        </el-button>
      </div>

      <el-table
        :key="tableKey"
        v-loading="loading"
        :data="list"
        border
        fit
        size="mini"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="序号"
          prop="uid"
          sortable="custom"
          align="center"
          width="80"
        >
          <template slot-scope="{row}">
            <span>{{ row.uid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sex | sexFormatter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="center">
          <template slot-scope="{row}">
            <span>{{ row.dep_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.user_status | statusFormatter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登陆记录" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updatetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="320" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-if="false" type="primary" size="mini">
              重置密码
            </el-button>
            <el-button size="mini" type="success" @click="openEditUserDialog(row)">
              修改
            </el-button>
            <el-button size="mini" @click="openEditPermissionDialog(row)">
              权限管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" />

      <el-dialog
        :title="isAddUserAction ? '添加账号' : '编辑账号'"
        :visible.sync="addDialogVisible"
        width="500px"
        :before-close="closeAddUserDialog"
      >
        <el-form ref="addUserForm" :rules="userRules" :model="userForm" label-width="80px" size="mini">
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="userForm.name" placeholder="请输入用户姓名" />
          </el-form-item>
          <el-form-item label="用户性别" prop="sex">
            <el-radio-group v-model="userForm.sex">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属部门" prop="dep_name">
            <el-input v-model="userForm.dep_name" placeholder="请输入部门" />
          </el-form-item>
          <el-form-item label="用户账号" prop="user_name">
            <div style="display: flex;align-items: center;justify-content: left">
              <el-input v-model="userForm.user_name" placeholder="请输入用户账号" style="width: 200px" />
              <span style="font-size: 12px;margin-left: 10px"><span style="font-size: 16px;color: #ff4949">*</span>密码默认为123456</span>
            </div>
          </el-form-item>
          <el-form-item label="账号状态" prop="status">
            <el-radio-group v-model="userForm.status">
              <el-radio label="1">冻结</el-radio>
              <el-radio label="0">正常</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限设置">
            <el-button type="primary" size="mini" icon="el-icon-setting" @click="permissionDialogVisible = true">设置</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button v-if="isAddUserAction" type="primary" :loading="loading" @click="addUser">确 定</el-button>
          <el-button v-else type="primary" :loading="loading" @click="updateUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="权限设置" :visible.sync="permissionDialogVisible" width="20%" append-to-body :before-close="closePermissionDialog">
        <el-form label-width="80px">
          <el-form-item v-for="menu in menuList" :key="menu.key" :label="menu.title" prop="sex">
            <el-radio-group v-model="permissionForm[menu.key]">
              <el-radio :label="menu.key">有权限</el-radio>
              <el-radio label="0">无权限</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="addDialogVisible" type="primary" @click="permissionDialogVisible = false">确 定</el-button>
          <el-button v-else type="primary" :loading="loading" @click="updateUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapActions } from 'vuex'
import { dynamicRoutes } from '@/router'
import { Message } from 'element-ui'

export default {
  name: 'Permission',
  components: { Pagination },
  filters: {
    sexFormatter(value) {
      return value === 1 ? '男' : '女'
    },
    statusFormatter(value) {
      return value === '1' ? '冻结' : '正常'
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      loading: true,
      addDialogVisible: false,
      userForm: {
        name: '',
        sex: '1', // 1 男  2 女
        user_password: '123456',
        dep_name: '',
        user_name: '',
        status: '0' // 0 正常  1 冻结
      },
      userRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        dep_name: [{ required: true, message: '请输入部门', trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        status: [{ required: true, message: '请选择装好装填', trigger: 'blur' }]
      },
      permissionDialogVisible: false,
      permissionForm: {},
      isAddUserAction: false
    }
  },
  computed: {
    menuList() {
      return dynamicRoutes.filter(route => {
        return route.key
      }).map(menu => {
        this.$set(this.permissionForm, menu.key, menu.key)
        return {
          key: menu.key,
          title: menu.meta.title
        }
      })
    },
    functionList() {
      return Object.keys(this.permissionForm).filter(key => {
        return parseInt(this.permissionForm[key]) !== 0
      }).map(item => {
        return {
          fid: item,
          status: '1'
        }
      })
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    ...mapActions('user', ['getUserListX', 'addUserX', 'getUserInfoX', 'updateUserX']),
    ...mapActions('permission', ['generateRoutesX']),
    async getUserList() {
      this.loading = true
      const res = await this.getUserListX()
      this.list = res.data || []
      this.loading = false
    },
    closeAddUserDialog() {
      this.addDialogVisible = false
    },
    closePermissionDialog() {
      this.permissionDialogVisible = false
    },
    closeAllDialog() {
      this.addDialogVisible = false
      this.permissionDialogVisible = false
    },
    addUser() {
      this.loading = true
      this.$refs.addUserForm.validate(async valid => {
        if (valid) {
          const payload = {
            ...this.userForm,
            function_list: this.functionList
          }

          this.addUserX(payload)
            .then(res => {
              Message.success('添加成功')
              this.$refs['addUserForm'].resetFields()
              this.closeAllDialog()
              this.permissionForm = {}
            }).finally(() => {
              this.loading = false
            })
        }
      })
    },
    updateUser() {
      this.loading = true
      const payload = {
        ...this.userForm,
        function_list: this.functionList
      }

      this.updateUserX(payload)
        .then(res => {
          Message.success('修改成功')
          this.permissionForm = {}
          this.closeAllDialog()
        }).finally(() => {
          this.loading = false
        })
    },
    openAddUserDialog() {
      this.permissionForm = {}
      this.isAddUserAction = true
      this.addDialogVisible = true
    },
    async openEditUserDialog(data) {
      this.isAddUserAction = false
      this.permissionForm = {}
      Object.assign(this.userForm, data)
      this.userForm.sex = this.userForm.sex.toString()
      this.userForm.status = this.userForm.status.toString()

      this.restoreDynamicMenus(data.uid)

      this.addDialogVisible = true
    },
    async openEditPermissionDialog(data) {
      this.permissionForm = {}

      Object.assign(this.userForm, data)

      this.restoreDynamicMenus(data.uid)

      this.permissionDialogVisible = true
    },
    async restoreDynamicMenus(uid) {
      const res = await this.getUserInfoX(uid)
      const payload = {
        role: res.role_id,
        functionList: res.function_list
      }
      const dynamicMenus = await this.generateRoutesX(payload) || []

      Object.keys(this.permissionForm).forEach(key => {
        const retMenu = dynamicMenus.find(menu => menu.key === parseInt(key))
        if (!retMenu) {
          this.permissionForm[key] = '0'
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../styles/variables.scss';
  .el-form {
    padding: 0 20px;

    ::v-deep .el-form-item__label {
      text-align: justify;
      text-justify: distribute-all-lines; /*ie6-8*/
      text-align-last: justify; /* ie9*/
      -moz-text-align-last: justify; /*ff*/
      -webkit-text-align-last: justify; /*chrome 20+*/
    }

  }

  .wrapper {
    padding: 20px;
    background: white;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .tips {
      vertical-align: middle;

      &:before {
        display: inline-block;
        content: '';
        width: 3px;
        height: 18px;
        vertical-align: middle;
        background: $menuActiveText;
        margin-right: 8px;
        word-break: break-all;
      }
    }

  }
</style>
