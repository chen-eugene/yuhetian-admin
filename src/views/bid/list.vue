<template>
  <div class="app-container">
    <div class="wrapper">
      <el-form inline label-width="80" size="mini">
        <el-form-item label="时间">
          <el-date-picker
            v-model="form.date"
            type="monthrange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getBidDataList"
          />
        </el-form-item>
        <el-form-item label="搜索" style="margin-left: 20px">
          <el-input v-model="form.company" size="mini" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item style="margin-left: 20px">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="getBidDataList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loader.listLoading"
        :data="list"
        border
        fit
        size="mini"
        highlight-current-row
        style="width: 100%;"
        :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rdatetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.province_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rtitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中标供应商" align="center">
          <template slot-scope="{row}">
            <span>{{ row.wcompany }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中标内容" align="center">
          <template slot-scope="{row}">
            <span>{{ row.wcontent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中标金额(万元)" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rprice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运营时间(年)" align="center" width="100px">
          <template slot-scope="{row}">
            <span v-if="isShowTimeLimit(row)">{{ row.time_limit }} /
              <span style="color: #1890FF;cursor:pointer;" @click="openTimeDialog(row)">修改</span>
            </span>
            <span v-else style="color: #1890FF;cursor:pointer;" @click="openTimeDialog(row)">填写</span>
            <!--            <el-button v-else size="mini" type="primary" @click="openTimeDialog(row)">填写</el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="采购人信息" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rcontact }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购人地址" align="center">
          <template slot-scope="{row}">
            <span>{{ row.raddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini">
              <a :href="row.uri" target="_blank">查看</a>
            </el-button>
            <el-button v-if="false" size="mini" type="error" @click="deleteItem(row)">
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
        @pagination="getTenderData"
      />
    </div>

    <el-dialog
      title="填写运营时间"
      :visible.sync="timeDialogVisible"
      :before-close="closeTimeDialog"
      width="400px"
    >
      <el-form ref="timeFrom" :model="timeForm" :rules="timeRules" inline label-width="120" size="mini">
        <el-form-item label="运营时间（年）" prop="date">
          <el-input v-model="timeForm.date" placeholder="请填写年限" oninput="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeTimeDialog">取消</el-button>
        <el-button type="primary" size="mini" :loading="loader.commonLoading" @click="updateItemData">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'BidList',
  data() {
    return {
      loader: {
        listLoading: false,
        commonLoading: false
      },
      selectedDate: '',
      list: [],
      pagination: {
        total: 0,
        pageSize: 20,
        curPage: 1
      },
      form: {
        date: [],
        company: ''
      },
      timeDialogVisible: false,
      timeForm: {
        itemId: '',
        date: ''
      },
      timeRules: {
        date: [{ required: true, message: '请填写运营时间', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getBidDataList()
  },
  methods: {
    ...mapActions('data', ['getBidDataListX', 'updateBidItemDataX']),
    async getBidDataList() {
      this.loader.listLoading = true
      const params = {
        per_page: this.pagination.pageSize,
        current_page: this.pagination.curPage,
        rcompany: this.form.company
      }

      let start_time
      let end_time
      if (this.form.date.length === 2) {
        start_time = this.$monthStartDay(this.form.date[0])
        end_time = this.$monthEndDay(this.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getBidDataListX(params)
      this.list = res.data || []
      this.loader.listLoading = false
    },
    openTimeDialog(data) {
      this.timeForm.itemId = data.id
      if (this.$isNumber(data.time_limit)) {
        this.timeForm.date = data.time_limit
      } else {
        this.timeForm.date = ''
      }
      this.timeDialogVisible = true
    },
    closeTimeDialog() {
      this.timeDialogVisible = false
    },
    updateItemData() {
      console.log('updateItemData -->', this.timeForm.date)
      this.$refs['timeFrom'].validate(async valid => {
        if (valid) {
          this.loader.commonLoading = true

          const params = {
            id: this.timeForm.itemId,
            time: this.timeForm.date
          }

          await this.updateBidItemDataX(params).finally(() => {
            this.loader.commonLoading = false
          })
          Message.success('修改成功')
          this.closeTimeDialog()
          this.getBidDataList()
        }
      })
    },
    deleteItem(item) {

    },
    isShowTimeLimit(data) {
      return data.time_limit && this.$isNumber(data.time_limit)
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    background: white;
    padding: 20px;
  }
</style>
