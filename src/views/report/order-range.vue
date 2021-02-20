<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">环卫服务市场公司历年订单获取年化金额榜单（万元）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="orderAverageData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getOrderAverageList"
              />
            </el-form-item>
            <el-form-item label="公司" style="margin-left: 30px">
              <el-select v-model="orderAverageData.form.company" placeholder="请选择">
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
            :data="orderAverageDataList"
            border
            fit
            highlight-current-row
            size="mini"
            style="width: 100%;"
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="80" />
            <el-table-column label="公司" align="center" width="280px">
              <template slot-scope="{row}">
                <span>{{ row.company }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in Object.keys(orderAverageDataLabels)"
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
            v-if="orderAverageData.pagination.total > orderAverageData.pagination.pageSize"
            :total="orderAverageData.pagination.total"
            :limit.sync="orderAverageData.pagination.pageSize"
            :page.sync="orderAverageData.pagination.curPage"
            layout="prev, pager, next"
            @pagination="getOrderAverageList"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">环卫服务市场公司历年订单获取总金额榜单（万元）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="orderTotalPriceData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getOrderTotalPriceList"
              />
            </el-form-item>
            <el-form-item label="公司" style="margin-left: 30px">
              <el-select v-model="orderTotalPriceData.form.company" placeholder="请选择">
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
            :data="orderTotalPriceDataList"
            border
            fit
            highlight-current-row
            size="mini"
            style="width: 100%;"
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="80" />
            <el-table-column label="公司" align="center" width="280px">
              <template slot-scope="{row}">
                <span>{{ row.company }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in Object.keys(orderTotalPriceDataLabels)"
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
            v-if="orderTotalPriceData.pagination.total > orderTotalPriceData.pagination.pageSize"
            :total="orderTotalPriceData.pagination.total"
            :limit.sync="orderTotalPriceData.pagination.pageSize"
            :page.sync="orderTotalPriceData.pagination.curPage"
            layout="prev, pager, next"
            @pagination="getOrderTotalPriceList"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">环卫服务市场公司历年订单获取年限榜单（年）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="orderYearsData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getOrderYearsList"
              />
            </el-form-item>
            <el-form-item label="公司" style="margin-left: 30px">
              <el-select v-model="orderYearsData.form.company" placeholder="请选择">
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
            :data="orderYearsDataList"
            border
            fit
            highlight-current-row
            size="mini"
            style="width: 100%;"
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
          >
            <el-table-column label="排序" align="center" type="index" width="80" />
            <el-table-column label="公司" align="center" width="280px">
              <template slot-scope="{row}">
                <span>{{ row.company }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in Object.keys(orderYearsDataLabels)"
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
            v-if="orderYearsData.pagination.total > orderYearsData.pagination.pageSize"
            :total="orderYearsData.pagination.total"
            :limit.sync="orderYearsData.pagination.pageSize"
            :page.sync="orderYearsData.pagination.curPage"
            layout="prev, pager, next"
            @pagination="getOrderYearsList"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { add } from '@/utils'

export default {
  name: 'OrderRange',
  data() {
    return {
      loader: {
        listLoading: false
      },
      companyList: [],
      orderAverageData: {
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
      orderTotalPriceData: {
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
      orderYearsData: {
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
    orderAverageDataList() {
      return this.orderAverageData.list.map(item => {
        const obj = new Map()
        obj.company = item.company
        obj.data = {}
        item.year_money_list.forEach(money => {
          obj.data[money.year] = money.price
        })
        return obj
      })
    },
    orderAverageDataLabels() {
      const temp = this.orderAverageDataList.map(item => {
        return Object.keys(item.data).length
      })
      const maxLen = Math.max.apply(null, temp)
      const index = temp.indexOf(maxLen)
      return this.orderAverageDataList[index].data
    },
    orderTotalPriceDataList() {
      return this.orderTotalPriceData.list.map(item => {
        const obj = new Map()
        obj.company = item.company
        obj.data = {}
        item.year_money_list.forEach(money => {
          obj.data[money.year] = money.price
        })
        return obj
      })
    },
    orderTotalPriceDataLabels() {
      const temp = this.orderTotalPriceDataList.map(item => {
        return Object.keys(item.data).length
      })
      const maxLen = Math.max.apply(null, temp)
      const index = temp.indexOf(maxLen)
      return this.orderTotalPriceDataList[index].data
    },
    orderYearsDataList() {
      return this.orderYearsData.list.map(item => {
        const obj = new Map()
        obj.company = item.company
        obj.data = {}
        item.year_num_list.forEach(year_item => {
          obj.data[year_item.year] = year_item.num
        })
        return obj
      })
    },
    orderYearsDataLabels() {
      const temp = this.orderYearsDataList.map(item => {
        return Object.keys(item.data).length
      })
      const maxLen = Math.max.apply(null, temp)
      const index = temp.indexOf(maxLen)
      return this.orderYearsDataList[index].data
    }
  },
  mounted() {
    this.getOrderAverageList()
    this.getOrderTotalPriceList()
    this.getOrderYearsList()
  },
  methods: {
    ...mapActions('report', ['getOrderAverageListX', 'getOrderTotalPriceListX', 'getOrderYearsListX']),
    async getOrderAverageList() {
      this.loader.listLoading = true

      const params = {
        per_page: this.orderAverageData.pagination.pageSize,
        current_page: this.orderAverageData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.orderAverageData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.orderAverageData.form.date[0])
        end_time = this.$monthEndDay(this.orderAverageData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.orderAverageData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getOrderAverageListX(params)
      this.orderAverageData.list = res.data || []
      this.orderAverageData.pagination.total = res.meta.pagination.total

      this.loader.listLoading = false
    },
    async getOrderTotalPriceList() {
      this.loader.listLoading = true

      const params = {
        per_page: this.orderTotalPriceData.pagination.pageSize,
        current_page: this.orderTotalPriceData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.orderTotalPriceData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.orderTotalPriceData.form.date[0])
        end_time = this.$monthEndDay(this.orderTotalPriceData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.orderTotalPriceData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getOrderTotalPriceListX(params)
      this.orderTotalPriceData.list = res.data || []
      // this.orderTotalPriceData.pagination.total = res.meta.pagination.total

      this.loader.listLoading = false
    },
    async getOrderYearsList() {
      this.loader.listLoading = true

      const params = {
        per_page: this.orderYearsData.pagination.pageSize,
        current_page: this.orderYearsData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.orderYearsData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.orderYearsData.form.date[0])
        end_time = this.$monthEndDay(this.orderYearsData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.orderYearsData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getOrderYearsListX(params)
      this.orderYearsData.list = res.data || []
      this.orderYearsData.pagination.total = res.meta.pagination.total

      this.loader.listLoading = false
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
</style>
