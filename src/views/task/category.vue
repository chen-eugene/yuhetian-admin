<template>
  <div class="app-container">

    <div class="content-wrapper">
      <div class="header">
        <span class="tips">分类配置</span>
        <el-button icon="el-icon-circle-plus" size="mini" type="primary" class="action-add" @click="openAddTypeDialog">
          新增分类
        </el-button>
      </div>
      <el-table
        v-loading="loader.listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        size="mini"
        :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
      >
        <el-table-column label="序号" align="center" type="index" width="120" />
        <el-table-column label="分类名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updatetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="openKeywordDialog(row)">
              添加关键词
            </el-button>
            <el-button size="mini" type="primary" @click="openEditTypeDialog(row)">
              修改
            </el-button>
            <el-button size="mini" plain type="danger" @click="deleteType(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="pagination.total > pagination.pageSize"
        :total="pagination.total"
        :limit.sync="pagination.pageSize"
        :page.sync="pagination.curPage"
        layout="prev, pager, next"
        @pagination="getTaskTypes"
      />
    </div>

    <el-dialog :title="isActionEditType ? '修改分类' : '新增分类'" :visible.sync="typeDialogVisible" width="400px" :before-close="closeTypeDialog">
      <el-form ref="typeForm" :rules="typeRules" :model="typeForm" label-width="80px">
        <el-form-item label="分类名称" prop="category_name">
          <el-input v-model="typeForm.category_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTypeDialog">取消</el-button>
        <el-button v-if="!isActionEditType" type="primary" :loading="loader.commonLoading" @click="addType">确定</el-button>
        <el-button v-else type="primary" :loading="loader.commonLoading" @click="updateType">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加关键词"
      :visible.sync="keywordData.keywordDialogVisible"
      width="500px"
      :show-close="false"
      append-to-body
      :before-close="closeKeywordDialog"
    >
      <div class="header">
        <el-button icon="el-icon-circle-plus" size="mini" type="primary" class="action-add" @click="openAddKeywordDialog">
          新增
        </el-button>
      </div>
      <el-table
        :data="keywordData.list"
        border
        fit
        highlight-current-row
        max-height="400px"
        size="mini"
        :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
      >
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column label="关键词名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.word }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="openEditKeywordDialog(row)">
              修改
            </el-button>
            <el-button size="mini" plain type="danger" @click="deleteKeyword(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeKeywordDialog">取消</el-button>
        <el-button type="primary" :loading="loader.commonLoading" @click="saveCategoryKeywords">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="keywordData.isActionEditKeyword ? '修改关键词' : '新增关键词'"
      :visible.sync="keywordData.addOrEditKeywordDialogVisible"
      :before-close="closeAddOrEditKeywordDialog"
      width="400px"
    >
      <el-form
        ref="keywordForm"
        :model="keywordData.keywordForm"
        label-width="80px"
        :rules="keywordData.keywordRules"
      >
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="keywordData.keywordForm.keyword" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddOrEditKeywordDialog">取消</el-button>
        <el-button type="primary" @click="addOrEditCategoryKeyword">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'TaskCategory',
  filters: {
    statusFormatter(value) {
      return value ? '已开启' : '已关闭'
    }
  },
  data() {
    return {
      loader: {
        listLoading: false,
        commonLoading: false
      },
      pagination: {
        total: 0,
        pageSize: 20,
        curPage: 1
      },
      typeDialogVisible: false,
      list: [],
      typeForm: {
        categoryId: '',
        category_name: ''
      },
      typeRules: {
        category_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      isActionEditType: false,

      keywordData: {
        list: [],
        keywordDialogVisible: false,
        keywordForm: {
          categoryId: '',
          keywordId: '',
          keyword: ''
        },
        keywordRules: {
          keyword: [{ required: true, message: '请输入关键词', trigger: 'blur' }]
        },
        addOrEditKeywordDialogVisible: false,
        isActionEditKeyword: false
      }

    }
  },
  mounted() {
    this.getTaskTypes()
  },
  methods: {
    ...mapActions('task', ['getTaskTypesX', 'addTaskTypeX', 'updateTaskTypeX', 'deleteTaskTypeX', 'getCategoryKeywordsX',
      'saveCategoryKeywordsX', 'deleteCategoryX']),
    async getTaskTypes() {
      this.loader.listLoading = true
      const params = {
        per_page: this.pagination.pageSize,
        current_page: this.pagination.curPage
      }
      const res = await this.getTaskTypesX(params)
      this.list = res.data || []
      this.pagination.total = res.meta.pagination.total
      this.loader.listLoading = false
    },
    openAddTypeDialog() {
      this.typeForm = {}
      this.openTypeDialog()
    },
    openTypeDialog() {
      if (!this.loader.listLoading) {
        this.typeDialogVisible = true
      }
    },
    closeTypeDialog() {
      this.typeDialogVisible = false
    },
    openEditTypeDialog(data) {
      this.typeForm.categoryId = data.id
      this.typeForm.category_name = data.category_name
      this.isActionEditType = true
      this.openTypeDialog()
    },
    addType() {
      this.$refs['typeForm'].validate(async valid => {
        if (valid) {
          this.loader.commonLoading = true
          const payload = Object.assign({}, this.typeForm)
          this.addTaskTypeX(payload)
            .then(res => {
              Message.success('添加成功')
              this.$refs['typeForm'].resetFields()
              this.closeTypeDialog()
              this.getTaskTypes()
            }).finally(() => {
              this.loader.commonLoading = false
            })
        }
      })
    },
    updateType() {
      this.$refs['typeForm'].validate(async valid => {
        if (valid) {
          this.loader.commonLoading = true
          const payload = Object.assign({}, this.typeForm)
          this.updateTaskTypeX(payload)
            .then(res => {
              Message.success('修改成功')
              this.$refs['typeForm'].resetFields()
              this.closeTypeDialog()
              this.getTaskTypes()
            }).finally(() => {
              this.loader.commonLoading = false
            })
        }
      })
    },
    deleteType(data) {
      MessageBox.confirm('您确定要删除当前分类吗？', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTaskTypeX({ id: data.id })
          .then(res => {
            Message.success('删除成功')
            this.getTaskTypes()
          })
      })
    },
    async openKeywordDialog(category) {
      await this.getCategoryKeywords(category.id)
      this.keywordData.keywordForm.categoryId = category.id
      this.keywordData.keywordDialogVisible = true
    },
    closeKeywordDialog() {
      this.keywordData.keywordDialogVisible = false
    },
    async getCategoryKeywords(categoryId) {
      const res = await this.getCategoryKeywordsX({
        categoryId: categoryId
      })
      this.keywordData.list = res.data.words
    },
    addOrEditCategoryKeyword() {
      this.$refs['keywordForm'].validate(async valid => {
        if (valid) {
          const temp = this.keywordData.list
          const index = this.keywordData.list.findIndex(item => {
            return item.id === this.keywordData.keywordForm.keywordId
          })
          if (index === -1) {
            temp.push({
              word: this.keywordData.keywordForm.keyword
            })
          } else {
            this.keywordData.list[index].word = this.keywordData.keywordForm.keyword
          }
          this.keywordData.list = temp
          this.closeAddOrEditKeywordDialog()
        }
      })
    },
    async saveCategoryKeywords() {
      this.loader.commonLoading = true
      const payload = {
        categoryId: this.keywordData.keywordForm.categoryId,
        words: this.keywordData.list.map(item => {
          return item.word
        })
      }
      await this.saveCategoryKeywordsX(payload)
      this.getCategoryKeywords(this.keywordData.keywordForm.categoryId)
      Message.success('保存成功')
      this.loader.commonLoading = false
      this.closeKeywordDialog()
    },
    openAddKeywordDialog() {
      this.keywordData.keywordForm.keywordId = ''
      this.keywordData.keywordForm.keyword = ''
      this.openAddOrEditKeywordDialog()
    },
    openAddOrEditKeywordDialog() {
      this.keywordData.addOrEditKeywordDialogVisible = true
    },
    closeAddOrEditKeywordDialog() {
      this.keywordData.addOrEditKeywordDialogVisible = false
    },
    openEditKeywordDialog(keyword) {
      this.keywordData.keywordForm.keywordId = keyword.id
      this.keywordData.keywordForm.keyword = keyword.word
      this.keywordData.isActionEditKeyword = true
      this.openAddOrEditKeywordDialog()
    },
    deleteKeyword(data) {
      const index = this.keywordData.list.findIndex(item => {
        return item.id === data.id
      })
      if (index !== -1) {
        this.keywordData.list.splice(index, 1)
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../styles/variables.scss';

  .content-wrapper {
    background: white;
    padding: 20px;
  }

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

