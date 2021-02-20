<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">订单省份分布情况</span>
          </div>
          <el-form inline label-width="80">
            <el-form-item label="时间">
              <el-date-picker
                v-model="provinceData.form.date"
                type="monthrange"
                align="left"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getOrderProvinceList"
              />
            </el-form-item>
            <el-form-item label="公司" style="margin-left: 30px">
              <el-select v-model="provinceData.form.company" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in companyList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <el-table
            :data="provinceData.list"
            border
            fit
            highlight-current-row
            size="mini"
            show-summary
            :summary-method="getProvinceSummaries"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="100" />
            <el-table-column label="省份" align="center">
              <template slot-scope="{row}">
                <span>{{ row.province }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属区域" align="center">
              <template slot-scope="{row}">
                <span>{{ row.scope }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年化服务金额（万元）" align="center" prop="money">
              <template slot-scope="{row}">
                <span>{{ row.money }}</span>
              </template>
            </el-table-column>
            <el-table-column label="占比（%）" align="center" prop="scale">
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
            @pagination="getOrderProvinceList"
          />

          <province-chart ref="provinceChart" class-name="province-chart" :province-data="provinceData.list" />

        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">订单区域分布情况（万元）</span>
          </div>
          <el-form inline label-width="100">
            <el-form-item label="时间">
              <el-date-picker
                v-model="regionData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getOrderRegionList"
              />
            </el-form-item>
            <el-form-item label="公司" style="margin-left: 20px">
              <el-select v-model="regionData.form.company" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in companyList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <el-table
            v-if="regionDataList.length > 0"
            :data="regionDataList"
            border
            fit
            highlight-current-row
            show-summary
            :summary-method="getScopeSummaries"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          >
            <el-table-column label="企业名称" align="center" width="280px">
              <template slot-scope="{row}">
                <span>{{ row.company }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in Object.keys(regionDataListLabels)"
              :key="key"
              :label="key"
              align="center"
              :prop="key"
            >
              <template slot-scope="{row}">
                <span>{{ row.data[key] ? parseFloat(row.data[key]) : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="regionData.pagination.total > regionData.pagination.pageSize"
            :total="regionData.pagination.total"
            :limit.sync="regionData.pagination.pageSize"
            :page.sync="regionData.pagination.curPage"
            layout="prev, pager, next"
            @pagination="getOrderRegionList"
          />
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;background: white">
      <el-col :span="24">
        <div class="table-box">
          <region-chart ref="region-chart" class-name="region-chart" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import ProvinceChart from './components/charts/province'
import { add } from '@/utils'
import RegionChart from './components/charts/region'

export default {
  name: 'OrderDistribution',
  components: { ProvinceChart, RegionChart },
  data() {
    return {
      loader: {
        listLoading: false
      },
      companyList: [],
      provinceData: {
        pagination: {
          total: 0,
          pageSize: 20,
          curPage: 1
        },
        list: [],
        form: {
          date: [],
          company: ''
        }
      },
      regionData: {
        pagination: {
          total: 0,
          pageSize: 20,
          curPage: 1
        },
        list: [],
        form: {
          date: [],
          company: ''
        }
      }
    }
  },
  computed: {
    regionDataList() {
      const temp = this.regionData.list.map(item => {
        const obj = new Map()
        obj.company = item.company
        obj.data = {}
        item.scope_money_list.forEach(money_item => {
          obj.data[money_item.scope] = money_item.money
        })
        return obj
      })
      return temp
    },
    regionDataListLabels() {
      const temp = this.regionDataList.map(item => {
        return Object.keys(item.data).length
      })
      const maxLen = Math.max.apply(null, temp)
      const index = temp.indexOf(maxLen)
      return this.regionDataList[index] ? this.regionDataList[index].data : []
    }
  },
  mounted() {
    this.getOrderRegionList()
    this.getCompanyList()
  },
  methods: {
    ...mapActions('report', ['getOrderProvinceListX', 'getOrderRegionListX', 'getCompanyListX']),
    async getOrderProvinceList() {
      this.loader.listLoading = true

      const params = {
        per_page: this.provinceData.pagination.pageSize,
        current_page: this.provinceData.pagination.curPage,
        company: this.provinceData.form.company
      }

      let start_time
      let end_time
      if (this.provinceData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.provinceData.form.date[0])
        end_time = this.$monthEndDay(this.provinceData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.provinceData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getOrderProvinceListX(params)
      this.provinceData.list = res.data || []
      // this.provinceData.pagination.total = res.meta.pagination.total
      this.$refs['provinceChart'].updateChart(this.provinceData.list)
      this.loader.listLoading = false
    },
    async getOrderRegionList() {
      this.loader.listLoading = true

      const params = {
        per_page: this.regionData.pagination.pageSize,
        current_page: this.regionData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.regionData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.regionData.form.date[0])
        end_time = this.$monthEndDay(this.regionData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.regionData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getOrderRegionListX(params)
      this.regionData.list = res.data || []

      this.loader.listLoading = false
    },
    async getCompanyList() {
      const { data } = await this.getCompanyListX()
      this.companyList = data
      if (data.length > 0) {
        this.provinceData.form.company = data[0]
        this.getOrderProvinceList()
      }
    },
    getProvinceSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if ([0, 1, 2].includes(index)) {
          if (index === 0) {
            sums[index] = '合计'
          }
          return
        }
        const values = data.map(item => {
          if (column.property === 'scale') {
            return Number(item[column.property]) * 100
          }
          return Number(item[column.property])
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
    },
    getScopeSummaries(param) {
      const { columns, data } = param
      const sums = []
      const regionChartData = []
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

        regionChartData.push({
          name: column.label,
          value: sums[index]
        })
      })

      if (regionChartData.length > 0) {
        this.$nextTick(() => {
          this.$refs['region-chart'].updateChart(regionChartData)
        })
      }
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

  .province-chart {
    width: 100% !important;
    height: 500px !important;
  }

  .region-chart {
    width: 50% !important;
    height: 400px !important;
    margin: 0 auto;
  }
</style>
