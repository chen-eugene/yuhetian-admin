<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">环卫服务运营企业（万元）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="companyData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                @change="getCompanyMonthData"
              />
            </el-form-item>
          </el-form>

          <el-table
            v-if="companyDataList.length > 0"
            :data="companyDataList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
            :span-method="objectSpanMethod"
            size="mini"
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
              align="center"
              label="数据类别"
              width="140px"
            >
              <template slot-scope="{row}">
                <span>{{ row.category }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in companyDataYears"
              :key="key"
              align="center"
              :label="key"
            >
              <template slot-scope="{row}">
                <span>{{ row[key] ? parseFloat(row[key]) : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--          <pagination-->
          <!--            v-if="orderYearsData.pagination.total > orderYearsData.pagination.pageSize"-->
          <!--            :total="orderYearsData.pagination.total"-->
          <!--            :limit.sync="orderYearsData.pagination.pageSize"-->
          <!--            :page.sync="orderYearsData.pagination.curPage"-->
          <!--            layout="prev, pager, next"-->
          <!--            @pagination="getOrderYearsList"-->
          <!--          />-->
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">2020月度订单规模-招投标及公共口径（万元）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="orderMonthData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                :picker-options="pickerOptions"
                @change="getCompanyMonthData"
              />
            </el-form-item>
          </el-form>
          <el-table
            v-if="orderMonthDataList.length > 0"
            :data="orderMonthDataList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
            :span-method="objectSpanMethod"
            size="mini"
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
              align="center"
              label="数据类别"
              width="140px"
            >
              <template slot-scope="{row}">
                <span>{{ row.category }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in orderMonthDataYears"
              :key="key"
              align="center"
              :label="key"
            >
              <template slot-scope="{row}">
                <span>{{ row[key] ? parseFloat(row[key]) : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'OrderService',
  data() {
    return {
      loader: {
        companyListLoading: false
      },
      companyData: {
        list: [],
        form: {
          date: []
        }
      },
      orderMonthData: {
        list: [],
        form: {
          date: []
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近十二个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 12)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    companyDataYears() {
      const lenArray = this.companyData.list.map(item => {
        return item.year_number_monies.length
      })
      const maxLen = Math.max.apply(null, lenArray)
      const index = lenArray.indexOf(maxLen)
      if (index !== -1) {
        const tempData = this.companyData.list[index]
        return tempData.year_number_monies.map(item => {
          return item.year
        })
      }
      return []
    },
    companyDataList() {
      const retArray = []
      this.companyData.list.forEach(item => {
        const obj1 = {
          company: item.company,
          category: '总金额'
        }
        const obj2 = {
          company: item.company,
          category: '年化金额'
        }
        const obj3 = {
          company: item.company,
          category: '平均年限'
        }
        this.companyDataYears.forEach(year => {
          const tempMoneyItem = item.year_number_monies.find(money_item => {
            return money_item.year === year
          })
          obj1[year] = tempMoneyItem ? tempMoneyItem.total_money : ''
          obj2[year] = tempMoneyItem ? tempMoneyItem.money : ''
          obj3[year] = tempMoneyItem ? tempMoneyItem.num : ''
        })

        retArray.push(...[obj1, obj2, obj3])
      })
      return retArray
    },
    orderMonthDataYears() {
      const lenArray = this.orderMonthData.list.map(item => {
        return item.year_number_monies.length
      })
      const maxLen = Math.max.apply(null, lenArray)
      const index = lenArray.indexOf(maxLen)
      if (index !== -1) {
        const tempData = this.orderMonthData.list[index]
        return tempData.year_number_monies.map(item => {
          return item.year
        })
      }
      return []
    },
    orderMonthDataList() {
      const retArray = []
      this.orderMonthData.list.forEach(item => {
        const obj1 = {
          company: item.company,
          category: '总金额'
        }
        const obj2 = {
          company: item.company,
          category: '年化金额'
        }
        const obj3 = {
          company: item.company,
          category: '平均年限'
        }
        this.orderMonthDataYears.forEach(year => {
          const tempMoneyItem = item.year_number_monies.find(money_item => {
            return money_item.year === year
          })
          obj1[year] = tempMoneyItem ? tempMoneyItem.total_money : ''
          obj2[year] = tempMoneyItem ? tempMoneyItem.money : ''
          obj3[year] = tempMoneyItem ? tempMoneyItem.num : ''
        })

        retArray.push(...[obj1, obj2, obj3])
      })
      return retArray
    }

  },
  mounted() {
    this.getCompanyMonthData()
    this.getOrderMonthList()
  },
  methods: {
    ...mapActions('report', ['getOrderMonthListX', 'getCompanyMonthDataX']),
    async getCompanyMonthData() {
      this.loader.companyListLoading = false

      const params = {}

      let start_time
      let end_time
      if (this.companyData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.companyData.form.date[0])
        end_time = this.$monthEndDay(this.companyData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.companyData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getCompanyMonthDataX(params)
      this.companyData.list = res.data
    },
    async getOrderMonthList() {
      this.loader.companyListLoading = false

      const params = {}

      let start_time
      let end_time
      if (this.orderMonthData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.orderMonthData.form.date[0])
        end_time = this.$monthEndDay(this.orderMonthData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.orderMonthData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getOrderMonthListX(params)
      this.orderMonthData.list = res.data
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
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
