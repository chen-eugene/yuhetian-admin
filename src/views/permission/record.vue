<template>
  <div class="app-container">
    <div class="wrapper">
      <div class="header">
        <span class="tips">登录记录</span>
      </div>
      <el-table
        v-loading="loader.listLoading"
        :data="historyList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        size="mini"
        :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
      >
        <el-table-column label="序号" align="center" type="index" width="80" />
        <el-table-column label="登录账号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="ip地址" align="center">
          <template slot-scope="{row}">
            <span>{{ row.login_ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createtime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="pagination.total > pagination.pageSize"
        :total="pagination.total"
        :limit.sync="pagination.pageSize"
        :page.sync="pagination.curPage"
        layout="prev, pager, next"
        @pagination="getUserHistory"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Record',
  data() {
    return {
      loader: {
        listLoading: false
      },
      pagination: {
        total: 0,
        pageSize: 20,
        curPage: 1
      },
      historyList: []
    }
  },
  mounted() {
    this.getUserHistory()
  },
  methods: {
    ...mapActions('user', ['getUserHistoryX']),
    async getUserHistory() {
      this.loader.listLoading = true
      const params = {
        per_page: this.pagination.pageSize,
        current_page: this.pagination.curPage
      }
      const res = await this.getUserHistoryX(params).finally(() => {
        this.loader.listLoading = false
      })
      this.pagination.total = res.meta.pagination.total
      this.historyList = res.data || []
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
