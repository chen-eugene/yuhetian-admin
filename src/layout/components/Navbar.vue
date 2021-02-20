<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <div class="right-menu-item">
        <el-popover
          placement="bottom"
          width="400"
        >
          <div class="popup-wrapper" style="font-size: 12px">
            <div
              class="header"
              style="height: 40px;line-height: 40px;border-bottom: 1px solid #dfdfdf;display: flex;justify-content: space-between"
            >
              <span>账户信息</span>
              <span style="color: #409EFF;cursor: pointer" @click="openPswDialog">修改密码</span>
            </div>
            <el-form label-width="80px" label-position="left" style="margin-top: 10px" size="mini">
              <el-form-item label="所在部门:" style="margin-bottom: 0">
                <span>{{ userInfo.dep_name }}</span>
              </el-form-item>
              <el-form-item label="本次登录:" style="margin-bottom: 0">
                <span>{{ userInfo.current_login_time }}</span>
              </el-form-item>
              <el-form-item label="登录地区:" style="margin-bottom: 0">
                <span>{{ mapIpAddress }}</span>
              </el-form-item>
              <el-form-item label="上次登录:" style="margin-bottom: 0">
                <span>{{ userInfo.last_login_time }}</span>
              </el-form-item>
            </el-form>
          </div>
          <div slot="reference" class="avatar-container hover-effect">
            <div class="avatar-wrapper">
              <i class="el-icon-user-solid user-avatar" />
              <span>{{ userInfo.name }}</span>
              <i class="el-icon-caret-bottom" />
            </div>
          </div>
        </el-popover>
      </div>
      <div class="right-menu-item hover-effect" @click="openMenuDialog">
        <i class="el-icon-menu" />
      </div>
      <div class="right-menu-item">
        <el-button size="mini" type="danger" plain icon="el-icon-switch-button" @click="logout">退出</el-button>
      </div>
    </div>

    <el-dialog
      title="修改密码"
      width="400px"
      :visible.sync="pswDialogVisible"
      :before-close="closePswDialog"
    >
      <el-form ref="pswForm" :model="pswForm" :rules="pswRules" label-width="100px" size="mini" label-position="right">
        <el-form-item label="旧密码" prop="oldPsw">
          <el-input v-model="pswForm.oldPsw" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPsw">
          <el-input v-model="pswForm.newPsw" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPsw">
          <el-input v-model="pswForm.confirmPsw" placeholder="再次输入新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePswDialog">取消</el-button>
        <el-button type="primary" :loading="loader.commonLoading" @click="changePsw">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="常用菜单"
      width="600px"
      :visible.sync="menuData.menuDialogVisible"
      :before-close="closeMenuDialog"
      append-to-body
    >
      <div class="header">
        <el-button icon="el-icon-circle-plus" size="mini" type="primary" class="action-add" @click="openAddMenuDialog">
          新增
        </el-button>
      </div>
      <el-table
        v-loader="loader.listLoading"
        :data="menuData.list"
        size="mini"
        border
        fit
        highlight-current-row
        style="margin-top: 20px"
        :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
      >
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column label="名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="链接" align="center">
          <template slot-scope="{row}">
            <a :href="row.uri" target="_blank" style="color: #409EFF">{{ row.uri }}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="openEditMenuDialog(row)">
              修改
            </el-button>
            <el-button size="mini" plain type="danger" @click="deleteMenu(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :title="menuData.isEditMenu ? '修改菜单' : '添加菜单'"
      width="400px"
      :visible.sync="menuData.addOrEditMenuDialogVisible"
      :before-close="closeAddOrEditDialog"
    >
      <el-form
        size="mini"
        label-width="80px"
      >
        <el-form-item label="菜单名称" size="mini">
          <el-input v-model="menuData.form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="菜单链接" size="mini">
          <el-input
            v-model="menuData.form.uri"
            placeholder="请输入链接"
            type="textarea"
            row="2"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddOrEditDialog">取消</el-button>
        <el-button v-if="!menuData.isEditMenu" type="primary" size="mini" :loading="loader.commonLoading" @click="addMenu">确定</el-button>
        <el-button v-else type="primary" size="mini" :loading="loader.commonLoading" @click="updateMenu">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { Message, MessageBox } from 'element-ui'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      loader: {
        listLoading: false,
        commonLoading: false
      },
      ipAddress: null,
      pswForm: {
        oldPsw: '',
        newPsw: '',
        confirmPsw: ''
      },
      pswRules: {
        oldPsw: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPsw: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPsw: [{ required: true, message: '再次输入新密码', trigger: 'blur' }]
      },
      pswDialogVisible: false,

      menuData: {
        menuDialogVisible: false,
        addOrEditMenuDialogVisible: false,
        list: [],
        isEditMenu: false,
        form: {
          id: '',
          name: '',
          uri: ''
        }
      }

    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'userInfo'
    ]),
    mapIpAddress() {
      return this.ipAddress ? `${this.ipAddress.ip_address}（IP: ${this.ipAddress.ip}）` : ''
    }
  },
  mounted() {
    this.getIpAddress()
  },
  methods: {
    ...mapActions('user', ['queryIpX', 'changePasswordX', 'getMenuListX', 'addMenuX', 'updateMenuX', 'deleteMenuX']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async getIpAddress() {
      const res = await this.queryIpX()
      this.ipAddress = res.data
    },
    openPswDialog() {
      this.pswDialogVisible = true
    },
    closePswDialog() {
      this.pswDialogVisible = false
    },
    changePsw() {
      this.$refs['pswForm'].validate(async valid => {
        if (valid) {
          this.loader.commonLoading = true
          const data = {
            uid: this.userInfo.uid,
            password: this.pswForm.oldPsw,
            new_password: this.pswForm.newPsw
          }
          await this.changePasswordX(data).finally(() => {
            this.loader.commonLoading = false
          })
          Message.success('修改成功')
          this.closePswDialog()
        }
      })
    },
    openMenuDialog() {
      this.menuData.menuDialogVisible = true
      this.getMenuList()
    },
    closeMenuDialog() {
      this.menuData.menuDialogVisible = false
    },
    async getMenuList() {
      const res = await this.getMenuListX()
      this.menuData.list = res.data
    },
    openAddMenuDialog() {
      this.menuData.form = {}
      this.menuData.isEditMenu = false
      this.menuData.addOrEditMenuDialogVisible = true
    },
    openEditMenuDialog(data) {
      Object.assign(this.menuData.form, data)
      this.menuData.isEditMenu = true
      this.menuData.addOrEditMenuDialogVisible = true
    },
    closeAddOrEditDialog() {
      this.menuData.addOrEditMenuDialogVisible = false
    },
    async addMenu() {
      this.loader.commonLoading = true
      const data = {
        name: this.menuData.form.name,
        uri: this.menuData.form.uri
      }
      await this.addMenuX(data).finally(() => {
        this.loader.commonLoading = false
      })
      Message.success(!this.menuData.isEditMenu ? '添加成功' : '修改成功')
      this.getMenuList()
      this.closeAddOrEditDialog()
    },
    async updateMenu() {
      this.loader.commonLoading = true
      const payload = {
        menuId: this.menuData.form.id,
        data: {
          name: this.menuData.form.name,
          uri: this.menuData.form.uri
        }
      }
      await this.updateMenuX(payload).finally(() => {
        this.loader.commonLoading = false
      })
      Message.success('添加成功')
      this.getMenuList()
      this.closeAddOrEditDialog()
    },
    deleteMenu(data) {
      MessageBox.confirm('您确定要删除当前分类吗？', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMenuX({ menuId: data.id })
          .then(res => {
            Message.success('删除成功')
            this.getMenuList()
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 12px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }

    .hover-effect {
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .avatar-container {

      .avatar-wrapper {
        position: relative;
        font-size: 14px;

        .user-avatar {
          cursor: pointer;
          margin-right: 6px;
        }

        .el-icon-caret-bottom {
          margin-left: 8px;
        }
      }
    }
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
      }
    }

  }

}
</style>
