<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="table-box">
          <div class="header">
            <span class="tips">招标金额榜单</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="priceData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getPriceData"
              />
            </el-form-item>
          </el-form>

          <el-table
            :data="priceData.list"
            border
            fit
            highlight-current-row
            size="mini"
            style="width: 100%;"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="80" />
            <el-table-column label="项目名称" align="center">
              <template slot-scope="{row}">
                <span>{{ row.rtitle }}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额（万元）" align="center">
              <template slot-scope="{row}">
                <span>{{ row.rprice }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="priceData.pagination.total > priceData.pagination.pageSize"
            :total="priceData.pagination.total"
            :limit.sync="priceData.pagination.pageSize"
            :page.sync="priceData.pagination.curPage"
            layout="prev, pager, next"
            @pagination="getPriceData"
          />
        </div>
      </el-col>

      <el-col :span="12">
        <div class="table-box">
          <div class="header">
            <span class="tips">招标订单省市分布</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="provinceData.form.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getProvinceData"
              />
            </el-form-item>
          </el-form>

          <el-table
            :data="provinceData.list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            size="mini"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="80" />
            <el-table-column label="省市区域" align="center">
              <template slot-scope="{row}">
                <span>{{ row.province }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属区域" align="center">
              <template slot-scope="{row}">
                <span>{{ row.scope }}</span>
              </template>
            </el-table-column>
            <el-table-column label="招标订单金额（万元）" align="center" width="200">
              <template slot-scope="{row}">
                <span>{{ row.rprice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="占比（%）" align="center">
              <template slot-scope="{row}">
                <span>{{ row.scale * 100 }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="provinceData.pagination.total > provinceData.pagination.pageSize"
            :total="provinceData.pagination.total"
            :limit.sync="provinceData.pagination.pageSize"
            :page.sync="provinceData.pagination.curPage"
            layout="prev, pager, next"
            @pagination="getProvinceData"
          />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <div class="content-wrapper">
          <tender-province-chart ref="barChart" class-name="province-chart" :province-data="provinceData.list" />
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Pagination from '@/components/Pagination'
import TenderProvinceChart from './component/charts/tender-province'

export default {
  name: 'Statistics',
  components: { Pagination, TenderProvinceChart },
  data() {
    return {
      loader: {
        commonLoading: false
      },
      priceData: {
        pagination: {
          total: 0,
          pageSize: 20,
          curPage: 1
        },
        list: [],
        form: {
          date: []
        }
      },
      provinceData: {
        pagination: {
          total: 0,
          pageSize: 20,
          curPage: 1
        },
        list: [],
        form: {
          date: []
        }
      },
      chartData: {
        provinceList: []
      }
    }
  },
  mounted() {
    this.getPriceData()
    this.getProvinceData()
    this.getProvinceInfo()
  },
  methods: {
    ...mapActions('data', ['getTenderPriceListX', 'getTenderProvinceListX', 'getProvinceInfoX']),
    async getPriceData() {
      const params = {
        per_page: this.priceData.pagination.pageSize,
        current_page: this.priceData.pagination.curPage
      }

      if (this.priceData.form.date.length === 2) {
        const start_time = this.$time(this.priceData.form.date[0])
        const end_time = this.$formatTomorrow(this.priceData.form.date[1])
        params.start_time = start_time
        params.end_time = end_time
      }

      const res = await this.getTenderPriceListX(params)
      this.priceData.list = res.data || []
      this.priceData.pagination.total = res.meta.pagination.total
    },
    async getProvinceData() {
      const params = {
        per_page: this.provinceData.pagination.pageSize,
        current_page: this.provinceData.pagination.curPage
      }

      if (this.provinceData.form.date.length === 2) {
        const start_time = this.$time(this.provinceData.form.date[0])
        const end_time = this.$formatTomorrow(this.provinceData.form.date[1])
        params.start_time = start_time
        params.end_time = end_time
      }

      const res = await this.getTenderProvinceListX(params)
      this.provinceData.list = res.data || []
      // this.provinceData.pagination.total = res.meta.pagination.total
      this.$refs['barChart'].updateChart(this.provinceData.list)
    },
    async getProvinceInfo() {
      const res = await this.getProvinceInfoX()
      this.chartData.provinceList = res.data || []
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../styles/variables.scss';

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

  .table-box {
    background: white;
    padding: 20px;
    min-height: 400px;
  }

  .province-chart {
    width: 100% !important;
    height: 500px !important;
  }

  .content-wrapper {
    background: white;
    padding: 20px;
  }

</style>
