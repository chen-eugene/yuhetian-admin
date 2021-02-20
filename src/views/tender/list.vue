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
            @change="getTenderData"
          />
        </el-form-item>
        <el-form-item label="搜索" style="margin-left: 20px">
          <el-input v-model="form.company" placeholder="请输入合同名称" />
        </el-form-item>
        <el-form-item style="margin-left: 20px">
          <el-button type="primary" icon="el-icon-search" @click="getTenderData">查询</el-button>
        </el-form-item>
      </el-form>
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
        <el-table-column label="时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createtime }}</span>
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
        <el-table-column label="预算金额(万元)" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rprice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购需求" align="center">
          <template slot-scope="{row}">
            <el-popover
              v-if="row.demands"
              placement="top"
              width="300"
              trigger="hover"
              :content="row.demands"
            >
              <span slot="reference" style="color: #409EFF;cursor: pointer">查看</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="合约履行期限(月)" align="center" width="160px">
          <template slot-scope="{row}">
            <span>{{ row.deadline }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资格要求" align="center">
          <template slot-scope="{row}">
            <el-popover
              v-if="row.qualifications"
              placement="top"
              width="300"
              trigger="hover"
              :content="row.qualifications"
            >
              <span slot="reference" style="color: #409EFF;cursor: pointer">查看</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="获取招标文件" align="center">
          <template slot-scope="{row}">
            <el-popover
              v-if="row.documents"
              placement="top"
              width="300"
              trigger="hover"
              :content="row.documents"
            >
              <span slot="reference" style="color: #409EFF;cursor: pointer">查看</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="开标时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rdatetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购人信息" align="center">
          <template slot-scope="{row}">
            <span>{{ row.rcontact }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
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

export default {
  name: 'Data',
  data() {
    return {
      loader: {
        listLoading: false,
        commonLoading: false
      },
      list: [],
      pagination: {
        total: 0,
        pageSize: 20,
        curPage: 1
      },
      form: {
        date: [],
        company: ''
      }
    }
  },
  mounted() {
    this.getTenderData()
  },
  methods: {
    ...mapActions('data', ['getTenderDataX']),
    async getTenderData() {
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

      const res = await this.getTenderDataX(params)
      this.list = res.data || []
      this.pagination.total = res.meta.pagination.total
      this.loader.listLoading = false
    },
    deleteItem(data) {

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
