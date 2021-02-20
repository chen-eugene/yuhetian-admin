<template>
  <div class="app-container">
    <div class="wrapper">
      <div class="header">
        <span class="tips">常用网址</span>
        <el-button icon="el-icon-circle-plus" size="mini" type="primary" class="action-add" @click="openAddMenuDialog">
          新增网址
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
        <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
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
    </div>

    <el-dialog
      :title="menuData.isEditMenu ? '修改菜单' : '添加菜单'"
      width="400px"
      :visible.sync="menuData.addOrEditMenuDialogVisible"
      :before-close="closeAddOrEditDialog"
    >
      <el-form
        size="mini"
        label-width="80px"
        :model="menuData.form"
        :rules="menuData.rules"
      >
        <el-form-item label="菜单名称" size="mini" prop="name">
          <el-input v-model="menuData.form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="菜单链接" size="mini" prop="uri">
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
import { mapActions } from 'vuex'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Website',
  data() {
    return {
      loader: {
        listLoading: false
      },
      menuData: {
        menuDialogVisible: false,
        addOrEditMenuDialogVisible: false,
        list: [],
        isEditMenu: false,
        form: {
          id: '',
          name: '',
          uri: ''
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          uri: [{ required: true, message: '请输入网址', trigger: 'blur' }]
        }
      }
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    ...mapActions('user', ['getMenuListX', 'addMenuX', 'updateMenuX', 'deleteMenuX']),
    async getMenuList() {
      this.loader.listLoading = true
      const res = await this.getMenuListX().finally(() => {
        this.loader.listLoading = false
      })
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

<style scoped lang="scss">
  @import '../../styles/variables.scss';

  .wrapper {
    background: white;
    padding: 20px;
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
</style>
