<template>
  <div class="app-container">

    <div class="content-wrapper">
      <div class="header">
        <span class="tips">爬虫任务列表</span>
        <el-button icon="el-icon-circle-plus" size="mini" type="primary" class="action-add" @click="openAddTaskDialog">
          新增任务
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
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column label="任务名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.task_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目标网站" align="center" show-overflow-tooltip width="280px">
          <template slot-scope="{row}">
            <a :href="row.uri" target="_blank" style="color: #409EFF">{{ row.uri }}</a>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.start_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" align="center" width="120px">
          <template slot-scope="{row}">
            <span>{{ row.rule_type | taskTypeFormatter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" align="center" width="120px">
          <template slot-scope="{row}">
            <span>{{ row.state | statusFormatter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="toggleTask(row)">
              {{ row.state === 0 ? '关闭' : '开启' }}
            </el-button>
            <el-button size="mini" type="success" @click="openEditTaskDialog(row)">
              修改
            </el-button>
            <el-button size="mini" type="success" @click="openKeywordDialog(row)">
              配置关键字
            </el-button>
            <el-button size="mini" type="success" @click="openFieldDialog(row)">
              配置字段
            </el-button>
            <el-button size="mini" plain type="danger" @click="deleteTask(row)">
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
        @pagination="getTaskList"
      />
    </div>

    <el-dialog
      :title="isActionEditTask ? '修改任务' : '新增任务'"
      :visible.sync="taskDialogVisible"
      width="550px"
      :before-close="closeTaskDialog"
    >
      <el-form ref="taskForm" :rules="taskRules" :model="taskForm" label-width="100px" size="mini">
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="taskForm.task_name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="taskForm.start_time"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
          />
        </el-form-item>
        <el-form-item label="任务类型" prop="rule_type" style="margin-top: 20px">
          <el-select
            v-model="taskForm.rule_type"
            class="filter-item"
            placeholder="请选择任务分类"
            :disabled="isActionEditTask"
          >
            <el-option label="招标" value="0" />
            <el-option label="中标" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标网站" prop="target_url" style="margin-top: 20px">
          <el-input
            v-model="taskForm.target_url"
            type="textarea"
            :rows="3"
            placeholder="请输入目标网站"
          />
        </el-form-item>
        <el-form-item label="定时器" prop="crontab" style="margin-top: 20px">
          <el-input v-model="taskForm.crontab" placeholder="请输入定时器" />
        </el-form-item>
        <!--        <el-form-item label="脚本内容" prop="content" style="margin-top: 20px">-->
        <!--          <el-input-->
        <!--            v-model="taskForm.content"-->
        <!--            type="textarea"-->
        <!--            :rows="3"-->
        <!--          />-->
        <!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="taskDialogVisible = false">取 消</el-button>
        <el-button v-if="!isActionEditTask" type="primary" :loading="loader.commonLoading" @click="addTask">确 定</el-button>
        <el-button v-else type="primary" :loading="loader.commonLoading" @click="updateTask">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="配置关键词"
      :visible.sync="keywordDialogVisible"
      width="600px"
      append-to-body
    >
      <div class="header">
        <el-button
          icon="el-icon-circle-plus"
          size="mini"
          type="primary"
          class="action-add"
          style="margin: 0 0 0 auto"
          @click="openAddKeywordDialog"
        >
          新增
        </el-button>
      </div>
      <el-table
        v-loading="loader.listLoading"
        :data="keywordList"
        border
        max-height="400px"
        fit
        highlight-current-row
        style="width: 100%;"
        size="mini"
        :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
        :span-method="objectSpanMethod"
      >
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column label="类型" align="center" prop="category_name">
          <template slot-scope="{row}">
            <span>{{ row.category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关键字" align="center">
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
        <el-button @click="closeKeywordDialog">取 消</el-button>
        <el-button type="primary" :loading="loader.commonLoading" @click="saveTaskKeywords">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="isActionEditKeyword ? '修改关键词' : '新增关键词'"
      :visible.sync="addOrEditKeywordDialogVisible"
      :before-close="closeAddOrEditKeywordDialog"
      width="400px"
    >
      <el-form
        ref="keywordForm"
        :model="keywordForm"
        label-width="80px"
        :rules="keywordRules"
        size="mini"
      >
        <el-form-item label="关键词" prop="keywordPath">
          <el-cascader
            v-if="isShowKeywordCascader"
            ref="keywordCascder"
            v-model="keywordForm.keywordPath"
            :props="cascaderProps"
            placeholder="请选择关键词"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddOrEditKeywordDialog">取消</el-button>
        <el-button type="primary" @click="addOrEditCategoryKeyword">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="配置字段"
      :visible.sync="fieldDialogVisible"
      width="680px"
      append-to-body
      :before-close="closeFieldDialog"
    >
      <div class="header">
        <el-button
          icon="el-icon-circle-plus"
          size="mini"
          type="primary"
          class="action-add"
          style="margin: 0 0 0 auto"
          @click="openAddFieldDialog"
        >
          新增
        </el-button>
      </div>
      <el-table
        :data="fieldList"
        border
        fit
        max-height="300px"
        highlight-current-row
        size="mini"
        :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
      >
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column label="字段名称" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.keywords }}</span>
          </template>
        </el-table-column>
        <el-table-column label="正则表达式" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.keywords_rule }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" :loading="loader.btnLoading" @click="openEditFieldDialog(row)">
              修改
            </el-button>
            <el-button size="mini" plain type="danger" @click="deleteField(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFieldDialog">取消</el-button>
        <el-button type="primary" :loading="loader.btnLoading" @click="saveFields">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="isEditField ? '修改字段' : '新增字段'"
      :visible.sync="addOrEditFieldDialogVisible"
      :before-close="closeAddOrEditFieldDialog"
      width="400px"
    >
      <el-form
        ref="fieldForm"
        :model="fieldForm"
        label-width="80px"
        :rules="fieldRules"
        size="mini"
      >
        <el-form-item label="字段名称" prop="fieldName">
          <el-select v-model="fieldForm.fieldName" placeholder="请选择" :disabled="isEditField">
            <el-option
              v-for="item in filterFieldOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="正则" prop="regular">
          <el-input v-model="fieldForm.regular" type="textarea" :rows="3" placeholder="请输入正则表达式" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddOrEditFieldDialog">取消</el-button>
        <el-button size="mini" type="primary" @click="addOrEditField">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { mapActions } from 'vuex'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'TaskList',
  components: { Pagination },
  filters: {
    sexFormatter(value) {
      return value ? '男' : '女'
    },
    statusFormatter(value) {
      return value === 0 ? '已开启' : '已关闭'
    },
    taskTypeFormatter(value) {
      return value ? '中标' : '招标'
    }
  },
  data() {
    const self = this
    return {
      loader: {
        listLoading: false,
        btnLoading: false,
        commonLoading: false
      },
      pagination: {
        total: 0,
        pageSize: 20,
        curPage: 1
      },
      list: [],
      taskDialogVisible: false,
      taskForm: {
        task_name: '',
        start_time: '',
        rule_type: '',
        target_url: '',
        crontab: '10 12 1 9 5',
        content: 'python Winbid.py'
      },
      taskRules: {
        task_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        start_time: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        rule_type: [{ required: true, message: '请选择任务类型', trigger: 'blur' }],
        target_url: [{ required: true, message: '请输入目标网站', trigger: 'blur' }],
        crontab: [{ required: true, message: '请定时器', trigger: 'blur' }],
        content: [{ required: true, message: '请脚本内容', trigger: 'blur' }]
      },
      taskTypesList: [],
      isActionEditTask: false,

      keywordDialogVisible: false,
      addOrEditKeywordDialogVisible: false,
      isActionEditKeyword: false,
      keywordForm: {
        task_id: '',
        task_type: '',
        start_time: '',
        cid: '',
        category_name: '',
        wid: '',
        word: '',
        keywordPath: []
      },
      keywordRules: {
        start_time: [{ required: true, message: '请选择生效时间', trigger: 'blur' }],
        keywordPath: [{ required: true, message: '请选择关键词', trigger: 'blur' }]
      },
      keywordList: [],
      isShowKeywordCascader: false,
      cascaderProps: {
        lazy: true,
        multiple: false,
        async lazyLoad(node, resolve) {
          const { level, value } = node
          if (level === 0) {
            const { data } = await self.getTaskTypesX()
            const nodes = data.map(item => {
              return {
                value: item.id,
                label: item.category_name,
                leaf: false
              }
            })
            resolve(nodes)
          } else if (level === 1) {
            const { data } = await self.getCategoryKeywordsX({ categoryId: value })
            const nodes = data.words.map(keyword => {
              return {
                value: keyword.id,
                label: keyword.word,
                leaf: true
              }
            })
            resolve(nodes)
          }
        }
      },

      tenderFields: ['项目编号', '项目名称', '项目品目', '资格要求', '项目预算', '合同期限', '招标文件获取方法', '采购需求',
        '开标时间', '采购单位', '采购人地址', '采购人联系方式', '公告时间'],
      bidFields: ['项目编号', '项目名称', '项目品目', '中标金额', '公告日期', '采购单位', '采购人信息', '采购人地址',
        '中标内容', '中标单位', '项目期限'],
      fieldDialogVisible: false,
      fieldList: [],
      fieldForm: {
        taskId: '',
        taskType: 0, // 0 招标  1 中标
        fieldId: '',
        fieldName: '',
        regular: ''
      },
      fieldRules: {
        fieldName: [{ required: true, message: '请输字段名称', trigger: 'blur' }],
        regular: [{ required: true, message: '请输正则表达式', trigger: 'blur' }]
      },
      isEditField: false,
      addOrEditFieldDialogVisible: false
    }
  },
  computed: {
    filterFieldOptions() {
      const tempFields = this.fieldForm.taskType === 0 ? this.tenderFields : this.bidFields
      return tempFields.filter(field => {
        const index = this.fieldList.findIndex(item => {
          return item.keywords === field
        })
        return index === -1
      })
    }
  },
  mounted() {
    this.getTaskList()
    this.getTaskTypes()
  },
  methods: {
    ...mapActions('permission', ['generateRoutesX']),
    ...mapActions('task', ['getTaskListX', 'getTaskTypesX', 'addTaskX', 'updateTaskX', 'getTaskDetailX', 'getCategoryKeywordsX',
      'getTaskKeywordsX', 'saveTaskKeywordsX', 'getTaskFieldsX', 'saveTaskFieldsX', 'deleteTaskX']),

    async getTaskList() {
      this.loader.listLoading = true
      const params = {
        per_page: this.pagination.pageSize,
        current_page: this.pagination.curPage
      }
      const res = await this.getTaskListX(params).finally(() => {
        this.loader.listLoading = false
      })
      this.list = res.data || []
      this.pagination.total = res.meta.pagination.total
    },
    async getTaskTypes() {
      const res = await this.getTaskTypesX()
      this.taskTypesList = res.data
    },
    closeTaskDialog() {
      this.taskDialogVisible = false
    },
    addTask() {
      this.$refs['taskForm'].validate(async valid => {
        if (valid) {
          this.loader.commonLoading = true

          const payload = {
            ...this.taskForm
          }

          payload.start_time = this.$time(payload.start_time)

          await this.addTaskX(payload).finally(() => {
            this.loader.commonLoading = false
          })
          this.closeTaskDialog()
          this.getTaskList()
          Message.success('添加成功')
        }
      })
    },
    async toggleTask(data) {
      this.loader.btnLoading = true
      const payload = {
        id: data.id,
        data: {
          ...data
        }
      }
      if (payload.data.state === 0) {
        payload.data.state = 1
      } else {
        payload.data.state = 0
      }
      await this.updateTaskX(payload).finally(() => {
        this.loader.btnLoading = false
      })
      Message.success(payload === 0 ? '开启成功' : '关闭成功')
      this.getTaskList()
    },
    async updateTask() {
      this.loader.btnLoading = true
      const payload = {
        id: this.taskForm.id,
        data: {
          ...this.taskForm
        }
      }
      await this.updateTaskX(payload).finally(() => {
        this.loader.btnLoading = false
      })
      Message.success('修改成功')
      this.closeTaskDialog()
      this.getTaskList()
    },
    openAddTaskDialog() {
      if (!this.loader.listLoading) {
        this.taskForm = {}
        this.isActionEditTask = false
        this.taskDialogVisible = true
      }
    },
    async openEditTaskDialog(data) {
      this.isActionEditTask = true
      this.loader.btnLoading = true
      const res = await this.getTaskDetailX({
        id: data.id
      }).finally(() => {
        this.loader.btnLoading = false
      })

      this.taskForm.id = res.data.id
      this.taskForm.task_name = res.data.task_name
      this.taskForm.start_time = res.data.start_time
      this.taskForm.rule_type = `${res.data.rule_type}`
      this.taskForm.target_url = res.data.uri
      this.taskForm.crontab = res.data.crontab
      this.taskForm.content = res.data.content

      this.taskDialogVisible = true
    },

    async openKeywordDialog(task) {
      const { data } = await this.getTaskKeywordsX({ taskId: task.id })
      this.keywordList.splice(0, this.keywordList.length)
      data.forEach(item => {
        item.word_list.forEach(word => {
          this.keywordList.push({
            cid: item.cid,
            category_name: item.category_name,
            wid: word.wid,
            word: word.word
          })
        })
      })
      this.keywordForm.task_type = task.rule_type
      this.keywordForm.task_id = task.id
      this.keywordDialogVisible = true
    },
    async saveTaskKeywords() {
      this.loader.commonLoading = true
      const data = []
      this.keywordList.forEach(keyword => {
        const index = data.findIndex(item => {
          return item.cid === keyword.cid && item.wid === keyword.wid
        })

        if (index !== -1) {
          data[index].wids.push(keyword.wid)
        } else {
          data.push({
            cid: keyword.cid,
            wids: [keyword.wid]
          })
        }
      })

      const payload = {
        taskId: this.keywordForm.task_id,
        data: data
      }
      await this.saveTaskKeywordsX(payload).finally(() => {
        this.loader.commonLoading = false
      })
      Message.success('保存成功')
      this.closeKeywordDialog()
    },
    closeKeywordDialog() {
      this.keywordDialogVisible = false
    },
    closeAddOrEditKeywordDialog() {
      this.addOrEditKeywordDialogVisible = false
      setTimeout(() => {
        this.isShowKeywordCascader = false
      })
    },
    openAddKeywordDialog() {
      this.keywordForm.keywordPath.splice(0, this.keywordForm.keywordPath.length)
      this.openAddOrEditKeywordDialog()
    },
    openEditKeywordDialog(keyword) {
      this.keywordForm.keywordPath.splice(0, this.keywordForm.keywordPath.length)
      this.keywordForm.keywordPath.push(keyword.cid, keyword.wid)
      this.openAddOrEditKeywordDialog()
    },
    openAddOrEditKeywordDialog() {
      this.addOrEditKeywordDialogVisible = true
      setTimeout(() => {
        this.isShowKeywordCascader = true
      })
    },
    addOrEditCategoryKeyword() {
      this.$refs['keywordForm'].validate(async valid => {
        if (valid) {
          const nodes = this.$refs['keywordCascder'].getCheckedNodes()

          if (nodes.length > 0) {
            const childNode = nodes[0]
            const parentNode = childNode.parent

            const index = this.keywordList.findIndex(keyword => {
              return keyword.cid === parentNode.value && keyword.wid === childNode.value
            })

            const keyword = {
              cid: parentNode.value,
              category_name: parentNode.label,
              wid: childNode.value,
              word: childNode.label
            }

            if (index !== -1) {
              Message.warning('请不要重复添加关键词')
            } else {
              this.keywordList.push(keyword)
              this.closeAddOrEditKeywordDialog()
            }
          }
        }
      })
    },
    deleteKeyword(keyword) {
      const index = this.keywordList.findIndex(item => {
        return item.cid === keyword.cid && item.wid === keyword.wid
      })

      if (index !== -1) {
        this.keywordList.splice(index, 1)
      }
    },

    async openFieldDialog(task) {
      this.fieldForm.taskId = task.id
      this.fieldForm.taskType = task.rule_type
      const res = await this.getTaskFieldsX({ taskId: task.id })
      this.fieldList = res.data
      this.fieldDialogVisible = true
    },
    closeFieldDialog() {
      this.fieldDialogVisible = false
    },
    openAddFieldDialog() {
      this.addOrEditFieldDialogVisible = true
      this.isEditField = false
      this.fieldForm.fieldId = ''
      this.fieldForm.fieldName = ''
      this.fieldForm.regular = ''
    },
    openEditFieldDialog(data) {
      this.addOrEditFieldDialogVisible = true
      this.isEditField = true
      this.fieldForm.fieldId = data.id
      this.fieldForm.fieldName = data.keywords
      this.fieldForm.regular = data.keywords_rule
    },
    closeAddOrEditFieldDialog() {
      this.addOrEditFieldDialogVisible = false
    },
    addOrEditField() {
      this.$refs['fieldForm'].validate(async valid => {
        if (valid) {
          const fieldObj = {
            keywords: this.fieldForm.fieldName,
            keywords_rule: this.fieldForm.regular
          }
          const index = this.fieldList.findIndex(field => {
            return field.id === this.fieldForm.fieldId
          })
          if (index === -1) {
            this.fieldList.push(fieldObj)
          } else {
            this.$set(this.fieldList, index, fieldObj)
          }
          this.closeAddOrEditFieldDialog()
        }
      })
    },
    async saveFields() {
      this.loader.commonLoading = true
      const payload = {
        taskId: this.fieldForm.taskId,
        data: this.fieldList
      }
      await this.saveTaskFieldsX(payload)
      Message.success('保存成功')
      this.loader.commonLoading = false
      this.closeFieldDialog()
    },
    deleteTask(data) {
      MessageBox.confirm('您确定要删除当前任务吗？', '删除任务', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTaskX({ taskId: data.id })
          .then(res => {
            Message.success('删除成功')
            this.getTaskList()
          })
      })
    },
    deleteField(data) {
      const index = this.fieldList.findIndex(item => {
        return item.id === data.id
      })
      if (index !== -1) {
        this.fieldList.splice(index, 1)
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const data = this.keywordList // 拿到当前table中数据
      const cellValue = row[column.property] // 当前位置的值
      const spanProp = ['category_name'] // 需要合并的字段
      if (cellValue && spanProp.includes(column.property)) {
        const prevRow = data[rowIndex - 1] // 获取到上一条数据
        let nextRow = data[rowIndex + 1] // 下一条数据
        if (prevRow && prevRow[column.property] === cellValue) { // 当有上一条数据，并且和当前值相等时
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) { // 当有下一条数据并且和当前值相等时,获取新的下一条
            nextRow = data[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
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

    .el-form-item {

      &:not(:first-child) {
        margin-bottom: 0;
      }

      .keyword {
        display: inline-block;
        min-width: 120px;
      }

      .el-icon-delete {
        color: #F5222D;
        cursor: pointer;
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

</style>
