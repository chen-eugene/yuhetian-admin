<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">招标金额榜单（万元）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="bidContractData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getBidContractPriceList"
              />
            </el-form-item>
          </el-form>

          <el-table
            v-if="bidContractDataList.length > 0"
            :data="bidContractDataList"
            border
            fit
            highlight-current-row
            size="mini"
            style="width: 100%;"
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column
              align="center"
              label="公司名称"
              width="240px"
            >
              <template slot-scope="{row}">
                <span>{{ row.company }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in Object.keys(bidContractLabels)"
              :key="key"
              align="center"
              :label="key"
              :prop="key"
            >
              <template slot-scope="{row}">
                <span>{{ row.data[key] ? parseFloat(row.data[key]) : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="bidContractData.pagination.total > bidContractData.pagination.pageSize"
            :total="bidContractData.pagination.total"
            :limit.sync="bidContractData.pagination.pageSize"
            :page.sync="bidContractData.pagination.curPage"
            layout="prev, pager, next"
            @pagination="getSummaries"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="table-box">
          <line-chart
            v-if="bidContractDataList.length > 0"
            ref="lineChart"
            class-name="small-chart"
            :years="Object.keys(bidContractLabels)"
            :data="bidContractDataList"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="table-box">
          <line-chart
            v-if="bidContractDataList.length > 0"
            ref="lineChart"
            class-name="small-chart"
            :years="Object.keys(bidContractLabels)"
            :data="bidContractDataList"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="table-box">
          <line-chart
            v-if="bidContractDataList.length > 0"
            ref="lineChart"
            class-name="small-chart"
            :years="Object.keys(bidContractLabels)"
            :data="bidContractDataList"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="table-box">
          <line-chart
            v-if="bidContractDataList.length > 0"
            ref="lineChart"
            class-name="small-chart"
            :years="Object.keys(bidContractLabels)"
            :data="bidContractDataList"
          />
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">订单获取年化金额（万元/年）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="bidAnnualizedAmountData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="gitBidAnnualizedAmountList"
              />
            </el-form-item>
          </el-form>

          <el-table
            v-if="bidAnnualizedAmountDataList.length > 0"
            :data="bidAnnualizedAmountDataList"
            border
            fit
            highlight-current-row
            size="mini"
            style="width: 100%;"
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column
              align="center"
              label="公司名称"
            >
              <template slot-scope="{row}">
                <span>{{ row.company }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in Object.keys(bidAnnualizedAmountLabels)"
              :key="key"
              align="center"
              :label="key"
              :prop="key"
            >
              <template slot-scope="{row}">
                <span>{{ row.data[key] ? parseFloat(row.data[key]) : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="bidAnnualizedAmountData.pagination.total > bidAnnualizedAmountData.pagination.pageSize"
            :total="bidAnnualizedAmountData.pagination.total"
            :limit.sync="bidAnnualizedAmountData.pagination.pageSize"
            :page.sync="bidAnnualizedAmountData.pagination.curPage"
            layout="prev, pager, next"
            @pagination="gitBidAnnualizedAmountList"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="table-box">
          <line-chart
            v-if="bidAnnualizedAmountDataList.length > 0"
            ref="lineChart"
            class-name="small-chart"
            :years="Object.keys(bidAnnualizedAmountLabels)"
            :data="bidAnnualizedAmountDataList"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="table-box">
          <line-chart
            v-if="bidAnnualizedAmountDataList.length > 0"
            ref="lineChart"
            class-name="small-chart"
            :years="Object.keys(bidAnnualizedAmountLabels)"
            :data="bidAnnualizedAmountDataList"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="table-box">
          <line-chart
            v-if="bidAnnualizedAmountDataList.length > 0"
            ref="lineChart"
            class-name="small-chart"
            :years="Object.keys(bidAnnualizedAmountLabels)"
            :data="bidAnnualizedAmountDataList"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="table-box">
          <line-chart
            v-if="bidAnnualizedAmountDataList.length > 0"
            ref="lineChart"
            class-name="small-chart"
            :years="Object.keys(bidAnnualizedAmountLabels)"
            :data="bidAnnualizedAmountDataList"
          />
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <div class="table-box">
          <bar-chart
            v-if="bidAnnualizedAmountDataList.length > 0"
            class-name="chart"
            :years="Object.keys(bidAnnualizedAmountLabels)"
            :data="bidAnnualizedAmountDataList"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import LineChart from './components/charts/line-chart'
import BarChart from './components/charts/bar-chart'
import { add } from '@/utils'

export default {
  name: 'Statistics',
  components: { LineChart, BarChart },
  data() {
    return {
      bidContractData: {
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
      bidAnnualizedAmountData: {
        pagination: {
          total: 0,
          pageSize: 20,
          curPage: 1
        },
        list: [],
        form: {
          date: []
        }
      }
    }
  },
  computed: {
    bidContractDataList() {
      const temp = this.bidContractData.list.map(item => {
        const obj = new Map()
        obj.company = item.rcompany
        obj.data = {}
        item.money_list.forEach(money => {
          obj.data[money.year] = money.price
        })
        return obj
      })
      return temp
    },
    bidContractLabels() {
      const temp = this.bidContractDataList.map(item => {
        return Object.keys(item.data).length
      })
      const maxLen = Math.max.apply(null, temp)
      const index = temp.indexOf(maxLen)
      return this.bidContractDataList[index] ? this.bidContractDataList[index].data : []
    },
    bidAnnualizedAmountDataList() {
      const temp = this.bidAnnualizedAmountData.list.map(item => {
        const obj = new Map()
        obj.company = item.rcompany
        obj.data = {}
        item.money_list.forEach(money => {
          obj.data[money.year] = money.price
        })
        return obj
      })

      return temp
    },
    bidAnnualizedAmountLabels() {
      const temp = this.bidAnnualizedAmountDataList.map(item => {
        return Object.keys(item.data).length
      })
      const maxLen = Math.max.apply(null, temp)
      const index = temp.indexOf(maxLen)
      return this.bidAnnualizedAmountDataList[index] ? this.bidAnnualizedAmountDataList[index].data : []
    }
  },
  mounted() {
    this.getBidContractPriceList()
    this.gitBidAnnualizedAmountList()
  },
  methods: {
    ...mapActions('data', ['getBidContractPriceListX', 'gitBidAnnualizedAmountListX']),
    async getBidContractPriceList() {
      const params = {
        per_page: this.bidContractData.pagination.pageSize,
        current_page: this.bidContractData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.bidContractData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.bidContractData.form.date[0])
        end_time = this.$monthEndDay(this.bidContractData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.bidContractData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getBidContractPriceListX(params)
      this.bidContractData.list = res.data || []
      this.bidContractData.pagination.total = res.meta.pagination.total
    },
    async gitBidAnnualizedAmountList() {
      const params = {
        per_page: this.bidAnnualizedAmountData.pagination.pageSize,
        current_page: this.bidAnnualizedAmountData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.bidAnnualizedAmountData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.bidAnnualizedAmountData.form.date[0])
        end_time = this.$monthEndDay(this.bidAnnualizedAmountData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.bidAnnualizedAmountData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.gitBidAnnualizedAmountListX(params)
      this.bidAnnualizedAmountData.list = res.data || []
      this.bidAnnualizedAmountData.pagination.total = res.meta.pagination.total
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => {
          return Number(item.data[column.property])
        })

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            if (!isNaN(curr)) {
              return add(prev, curr)
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
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
  }

  .small-chart {
    width: 100% !important;
    height: 300px !important;
    margin-top: 20px;
  }

  .chart {
    width: 100% !important;
    height: 500px !important;
    margin: 20px 0;
  }
</style>

