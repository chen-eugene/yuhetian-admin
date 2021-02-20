<template>
  <div class="app-container">
    <div class="header" style="justify-content: left">
      <el-date-picker
        v-model="summaryData.form.date"
        type="daterange"
        align="right"
        unlink-panels
        size="mini"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="false"
        @change="onSelectSummaryDate"
      />
      <el-radio-group v-model="summaryData.form.shortcutDate" size="mini" style="margin-left: 30px" @change="onShortcutsSummaryDate">
        <el-radio-button label="1">今天</el-radio-button>
        <el-radio-button label="0">昨天</el-radio-button>
      </el-radio-group>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="panel-block" style="background: #488FF4">
          <div>
            <div class="title">新增中标数</div>
            <div class="content">{{ summaryData.data && summaryData.data.between_win_tender_count }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel-block" style="background: #FEB230">
          <div>
            <div class="title">新增招标数</div>
            <div class="content">{{ summaryData.data && summaryData.data.between_tender_count }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel-block" style="background: #45B3F2">
          <div>
            <div class="title">总中标数量</div>
            <div class="content">{{ summaryData.data && summaryData.data.total_win_tender_count }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel-block" style="background: #F6494E">
          <div>
            <div class="title">总招标数量</div>
            <div class="content">{{ summaryData.data && summaryData.data.total_tender_count }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="content-wrapper">
          <div class="header chart-header">
            <span class="tips">新增中标趋势</span>
            <div>
              <el-select
                v-model="lineChartData.bidForm.shortDateValue"
                placeholder="请选择"
                size="mini"
                style="margin-right: 10px;width: 120px"
                @change="onPickBidDate"
              >
                <el-option
                  v-for="item in datePickerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="lineChartData.bidForm.date"
                type="daterange"
                align="right"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                :picker-options="pickerOptions"
                @change="onSelectBidSummaryDate"
              />
            </div>
          </div>
          <line-chart
            v-if="lineChartData.bidForm.date.length === 2"
            ref="bidLineChart"
            class-name="line-chart"
            :start-time="lineChartData.bidForm.date[0]"
            :end-time="lineChartData.bidForm.date[1]"
            item-name="新增中标数"
            item-color="#488FF4"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="content-wrapper">
          <div class="header chart-header">
            <span class="tips">新增招标趋势</span>
            <div>
              <el-select
                v-model="lineChartData.tenderForm.shortDateValue"
                placeholder="请选择"
                size="mini"
                style="margin-right: 10px;width: 120px"
                @change="onPickTenderDate"
              >
                <el-option
                  v-for="item in datePickerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="lineChartData.tenderForm.date"
                type="daterange"
                align="right"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                :picker-options="pickerOptions"
                @change="onSelectTenderSummaryDate"
              />
            </div>
          </div>
          <line-chart
            v-if="lineChartData.tenderForm.date.length === 2"
            ref="tenderLineChart"
            class-name="line-chart"
            :start-time="lineChartData.tenderForm.date[0]"
            :end-time="lineChartData.tenderForm.date[1]"
            item-name="新增招标数"
            item-color="#56D49B"
          />
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <div class="content-wrapper">
          <div class="header chart-header">
            <span class="tips">招标中标趋势</span>
            <div>
              <el-radio-group v-model="lineChartData.form.shortcutDate" size="mini" style="margin-right: 30px" @change="onShortcutsLineChartDate">
                <el-radio-button label="7">7天</el-radio-button>
                <el-radio-button label="30">30天</el-radio-button>
                <el-radio-button label="90">90天</el-radio-button>
                <el-radio-button label="180">180天</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-model="lineChartData.form.date"
                type="daterange"
                align="right"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="onSelectLineChartDate"
              />
            </div>
          </div>
          <bar-chart
            v-if="lineChartData.form.date.length === 2"
            ref="barChart"
            class-name="bar-chart"
            :start-time="lineChartData.form.date[0]"
            :end-time="lineChartData.form.date[1]"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <div class="table-box">
          <div class="header">
            <span class="tips">中标金额榜单</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="bidPriceData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getBidPriceList"
              />
            </el-form-item>
          </el-form>
          <el-table
            :data="bidPriceData.list"
            border
            fit
            size="mini"
            highlight-current-row
            style="width: 100%;"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="80" />
            <el-table-column label="公司名称" align="center">
              <template slot-scope="{row}">
                <span>{{ row.rcompany }}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额（万元）" align="center" width="140">
              <template slot-scope="{row}">
                <span>{{ row.price }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="bidPriceData.pagination.total > bidPriceData.pagination.pageSize"
            :total="bidPriceData.pagination.total"
            :limit.sync="bidPriceData.pagination.pageSize"
            :page.sync="bidPriceData.pagination.curPage"
            layout="prev, pager, next"
            :auto-scroll="false"
            @pagination="getBidPriceList"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="table-box">
          <div class="header">
            <span class="tips">招标金额榜单</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="tenderPriceData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getTenderPriceList"
              />
            </el-form-item>
          </el-form>
          <el-table
            :data="tenderPriceData.list"
            border
            fit
            size="mini"
            highlight-current-row
            style="width: 100%;"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="80" />
            <el-table-column label="项目名称" align="center">
              <template slot-scope="{row}">
                <span>{{ row.rtitle }}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额（万元）" align="center" width="140">
              <template slot-scope="{row}">
                <span>{{ row.rprice }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="tenderPriceData.pagination.total > tenderPriceData.pagination.pageSize"
            :total="tenderPriceData.pagination.total"
            :limit.sync="tenderPriceData.pagination.pageSize"
            :page.sync="tenderPriceData.pagination.curPage"
            layout="prev, pager, next"
            :auto-scroll="false"
            @pagination="getTenderPriceList"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="table-box">
          <div class="header">
            <span class="tips">公司中标数量榜单</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="bidNumData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getBidNumList"
              />
            </el-form-item>
          </el-form>
          <el-table
            :data="bidNumData.list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            size="mini"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="70" />
            <el-table-column label="公司名称" align="center">
              <template slot-scope="{row}">
                <span>{{ row.rcompany }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" align="center" width="70">
              <template slot-scope="{row}">
                <span>{{ row.num }}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额（万元）" align="center" width="120">
              <template slot-scope="{row}">
                <span>{{ row.price }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="bidNumData.pagination.total > bidNumData.pagination.pageSize"
            :total="bidNumData.pagination.total"
            :limit.sync="bidNumData.pagination.pageSize"
            :page.sync="bidNumData.pagination.curPage"
            layout="prev, pager, next"
            :auto-scroll="false"
            @pagination="getBidNumList"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Pagination from '@/components/Pagination'
import LineChart from './components/charts/line-chart'
import BarChart from './components/charts/bar-chart'

export default {
  name: 'Index',
  components: { LineChart, BarChart, Pagination },
  data() {
    return {
      summaryData: {
        data: null,
        form: {
          date: [],
          shortcutDate: null
        }
      },
      lineChartData: {
        tenderList: [],
        bidList: [],
        form: {
          date: [],
          shortcutDate: 30
        },
        bidForm: {
          shortDateValue: 30,
          date: []
        },
        tenderForm: {
          shortDateValue: 30,
          date: []
        }
      },
      bidPriceData: {
        list: [],
        form: {
          date: []
        },
        pagination: {
          total: 0,
          pageSize: 10,
          curPage: 1
        }
      },
      bidNumData: {
        list: [],
        form: {
          date: []
        },
        pagination: {
          total: 0,
          pageSize: 10,
          curPage: 1
        }
      },
      tenderPriceData: {
        list: [],
        form: {
          date: []
        },
        pagination: {
          total: 0,
          pageSize: 10,
          curPage: 1
        }
      },
      datePickerOptions: [{
        value: 7,
        label: '最近七天'
      }, {
        value: 30,
        label: '最近一个月'
      }, {
        value: 90,
        label: '最近三个月'
      }]
    }
  },
  mounted() {
    this.getSummaryData()
    this.getBidPriceList()
    this.getTenderPriceList()
    this.getBidNumList()
    this.onShortcutsLineChartDate(this.lineChartData.form.shortcutDate)
    this.onSelectBidSummaryDate()
    this.onSelectTenderSummaryDate()
  },
  methods: {
    ...mapActions('data', ['getSummaryDataX', 'getBidPriceListX', 'getTenderPriceListX', 'getBidNumListX', 'getSummaryDetailDataX']),
    async getSummaryData() {
      const params = {}
      let start_time
      let end_time
      if (this.summaryData.form.date.length === 2) {
        start_time = `${this.$date(this.summaryData.form.date[0])} 00:00:00`
        end_time = `${this.$date(this.summaryData.form.date[1])} 23:59:59`
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.summaryData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getSummaryDataX(params)
      this.summaryData.data = res.data
    },
    getBidAndTenderDetailData() {
      const bidParams = {
        type: 1
      }
      let start_time
      let end_time
      if (this.lineChartData.form.date.length === 2) {
        start_time = `${this.$date(this.lineChartData.form.date[0])} 00:00:00`
        end_time = `${this.$date(this.lineChartData.form.date[1])} 23:59:59`
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.lineChartData.form.date.push(start_time, end_time)
      }
      bidParams.start_time = start_time
      bidParams.end_time = end_time

      const p1 = this.getSummaryDetailDataX(bidParams).then(res => {
        this.lineChartData.bidList = res.data
      })

      const tenderParams = Object.assign({}, bidParams)
      tenderParams.type = 0
      const p2 = this.getSummaryDetailDataX(tenderParams).then(res => {
        this.lineChartData.tenderList = res.data
      })

      Promise.all([p1, p2]).then(res => {
        this.$refs['barChart'].updateChart(this.lineChartData.bidList, this.lineChartData.tenderList)
      })
    },
    async getBidPriceList() {
      const params = {
        per_page: this.bidPriceData.pagination.pageSize,
        current_page: this.bidPriceData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.bidPriceData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.bidPriceData.form.date[0])
        end_time = this.$monthEndDay(this.bidPriceData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.bidPriceData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getBidPriceListX(params)
      this.bidPriceData.list = res.data
      this.bidPriceData.pagination.total = res.meta.pagination.total
    },
    async getBidNumList() {
      const params = {
        per_page: this.bidNumData.pagination.pageSize,
        current_page: this.bidNumData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.bidNumData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.bidNumData.form.date[0])
        end_time = this.$monthEndDay(this.bidNumData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.bidNumData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time
      const res = await this.getBidNumListX(params)
      this.bidNumData.list = res.data
      this.bidNumData.pagination.total = res.meta.pagination.total
    },
    async getTenderPriceList() {
      const params = {
        per_page: this.tenderPriceData.pagination.pageSize,
        current_page: this.tenderPriceData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.tenderPriceData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.tenderPriceData.form.date[0])
        end_time = this.$monthEndDay(this.tenderPriceData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.tenderPriceData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getTenderPriceListX(params)
      this.tenderPriceData.list = res.data
      this.tenderPriceData.pagination.total = res.meta.pagination.total
    },
    onSelectSummaryDate(date) {
      this.summaryData.form.shortcutDate = null
      this.getSummaryData()
    },
    onPickBidDate(value) {
      const end = `${this.$date(new Date())} 00:00:00`
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * value)
      this.lineChartData.bidForm.date.splice(0, 2, `${this.$date(start)} 00:00:00`, end)
      this.onSelectBidSummaryDate()
    },
    onPickTenderDate(value) {
      const end = `${this.$date(new Date())} 00:00:00`
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * value)
      this.lineChartData.tenderForm.date.splice(0, 2, `${this.$date(start)} 00:00:00`, end)
      this.onSelectTenderSummaryDate()
    },
    onSelectBidSummaryDate() {
      const params = {
        type: 1
      }

      let start_time
      let end_time
      if (this.lineChartData.bidForm.date.length === 2) {
        start_time = `${this.$date(this.lineChartData.bidForm.date[0])} 00:00:00`
        end_time = `${this.$date(this.lineChartData.bidForm.date[1])} 23:59:59`
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.lineChartData.bidForm.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time
      this.getSummaryDetailDataX(params).then(res => {
        this.$refs['bidLineChart'].updateChart(this.lineChartData.bidList)
      })
    },
    onSelectTenderSummaryDate() {
      const params = {
        type: 0
      }

      let start_time
      let end_time
      if (this.lineChartData.tenderForm.date.length === 2) {
        start_time = `${this.$date(this.lineChartData.tenderForm.date[0])} 00:00:00`
        end_time = `${this.$date(this.lineChartData.tenderForm.date[1])} 23:59:59`
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.lineChartData.tenderForm.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time
      this.getSummaryDetailDataX(params).then(res => {
        this.$refs['tenderLineChart'].updateChart(this.lineChartData.tenderList)
      })
    },
    onSelectLineChartDate(date) {
      this.lineChartData.form.shortcutDate = null
      this.getBidAndTenderDetailData()
    },
    onShortcutsSummaryDate(label) {
      let startTime
      let endTime
      if (parseInt(label) === 1) {
        startTime = `${this.$date(new Date())} 00:00:00`
        endTime = `${this.$date(new Date())} 23:59:59`
      } else {
        const yesterdayTimestamp = new Date().getTime() - 24 * 60 * 60 * 1000
        startTime = `${this.$date(yesterdayTimestamp)} 00:00:00`
        endTime = `${this.$date(yesterdayTimestamp)} 23:59:59`
      }
      this.summaryData.form.date = [startTime, endTime]
      this.getSummaryData()
    },
    onShortcutsLineChartDate(label) {
      let timestamp
      switch (parseInt(label)) {
        case 7:
          timestamp = new Date().getTime() - 24 * 60 * 60 * 1000 * 6
          break
        case 30:
          timestamp = new Date().getTime() - 24 * 60 * 60 * 1000 * 29
          break
        case 90:
          timestamp = new Date().getTime() - 24 * 60 * 60 * 1000 * 89
          break
        case 180:
          timestamp = new Date().getTime() - 24 * 60 * 60 * 1000 * 179
          break
      }

      const startTime = `${this.$date(timestamp)} 00:00:00`
      const endTime = `${this.$date(new Date().getTime())} 23:59:59`

      this.lineChartData.form.date = [startTime, endTime]
      this.getBidAndTenderDetailData()
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../styles/variables.scss';

  ::v-deep .el-radio-button {
    &:first-child {
      border: none;
    }

    .el-radio-button__inner {
      border: none;
      background: none;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #488FF4;
      box-shadow: none;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .tips {
      vertical-align: middle;

      &:before {
        display: inline-block;
        content: '';
        width: 3px;
        height: 18px;
        vertical-align: middle;
        margin-right: 8px;
        background: #488FF4;
      }
    }
  }

  .panel-block {
    height: 100px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 14px;
      text-align: center;
      color: white;
    }

    .content {
      font-size: 24px;
      text-align: center;
      margin-top: 10px;
      color: white;
      font-weight: 500;
    }
  }

  .chart-header {
    margin: 0;
    height: 60px;
    padding: 0 20px;
  }

  .table-box {
    padding: 20px;
    background: white;
    min-height: 700px;
  }

  .content-wrapper {
    background: white;
    overflow: hidden;
  }

  .line-chart {
    width: 100% !important;
    height: 300px !important;
    margin: 20px 0;
  }

  .bar-chart {
    width: 100% !important;
    height: 400px !important;
    margin: 20px 0;
  }

</style>
