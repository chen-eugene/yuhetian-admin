<template>
  <div class="app-container">
    <div class="wrapper">
      <el-form ref="exportForm" :model="exportForm" :rules="exportRules" inline size="mini">
        <el-form-item label="导出文件名" prop="filename">
          <el-input v-model="exportForm.filename" placeholder="请输入文件名" />
        </el-form-item>
        <el-form-item label="时间" style="margin-left: 20px">
          <el-date-picker
            v-model="exportForm.date"
            type="monthrange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportFile">导出</el-button>
        </el-form-item>
      </el-form>

      <el-form inline label-width="80" size="mini">
        <el-form-item label="时间">
          <el-date-picker
            v-model="selectedDate"
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
          <el-input v-model="form.company" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item style="margin-left: 20px">
          <el-button type="primary" icon="el-icon-search" @click="getBidDataList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loader.listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        size="mini"
        style="width: 100%;"
        :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
      >
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column label="时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rdatetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" align="center">
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
        <el-table-column label="中标单位" align="center">
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
        <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini">
              <a :href="row.uri" target="_blank">查看</a>
            </el-button>
            <el-button size="mini" type="error" @click="deleteItem(row)">
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import fileDownload from 'js-file-download'
import { getToken } from '@/utils/auth'

export default {
  name: 'Export',
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
      exportForm: {
        date: [],
        filename: ''
      },
      exportRules: {
        filename: [{ required: true, message: '请输入文件名', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getBidDataList()
  },
  methods: {
    ...mapActions('data', ['getBidDataListX']),
    async getBidDataList() {
      this.loader.listLoading = true
      const params = {
        per_page: this.pagination.pageSize,
        current_page: this.pagination.curPage,
        rcompany: this.form.company
      }

      if (this.form.date.length === 2) {
        const start_time = this.$time(this.form.date[0])
        const end_time = this.$formatTomorrow(this.form.date[1])
        params.start_time = start_time
        params.end_time = end_time
      }

      const res = await this.getBidDataListX(params)
      this.list = res.data || []
      this.loader.listLoading = false
    },
    deleteItem(item) {

    },
    exportFile() {
      this.$refs['exportForm'].validate(valid => {
        if (valid) {
          const params = {
            file_name: `${this.exportForm.filename}`
          }

          const a = document.createElement('a')
          a.href = `${process.env.VUE_APP_BASE_API}/export/win_tender`
          a.download = this.exportForm.filename
          // a.click();
          // 下面这个写法兼容火狐
          a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
          // window.URL.revokeObjectURL(blob)

          // axios({
          //   headers: {
          //     // Authentication: getToken()
          //   },
          //   url: `${process.env.VUE_APP_BASE_API}/export/win_tender`,
          //   method: 'get',
          //   responseType: 'blob'
          //   // params
          // })
          //   .then(data => {
          //     // fileDownload(data, `${this.exportForm.filename}.xlsx`)
          //     // const blob = new Blob(
          //     //   [data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          //     // const aEle = document.createElement('a') // 创建a标签
          //     // const href = window.URL.createObjectURL(blob) // 创建下载的链接
          //     // aEle.href = href
          //     // aEle.download = `${this.exportForm.filename}.xlsx` // 下载后文件名
          //     // document.body.appendChild(aEle)
          //     // aEle.click() // 点击下载
          //     // document.body.removeChild(aEle) // 下载完成移除元素
          //     // window.URL.revokeObjectURL(href) // 释放掉blob对象
          //
          //     const blob = new Blob([data], {
          //       type: 'application/vnd.ms-excel'
          //     })
          //     const objectUrl = URL.createObjectURL(blob)
          //
          //     const a = document.createElement('a')
          //     a.href = objectUrl
          //     a.download = '客户'
          //     // a.click();
          //     // 下面这个写法兼容火狐
          //     a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
          //     window.URL.revokeObjectURL(blob)
          //   })
        }
      })
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
