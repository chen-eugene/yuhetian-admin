<template>
  <div class="app-container">
    <div class="header-wrapper">
      <div class="header">
        <span class="tips">订单省份分布情况</span>
      </div>

      <div class="condition-box">
        <el-row>
          <el-col :span="4">
            <div class="condition-label">
              公司名称
            </div>
          </el-col>
          <el-col :span="20">
            <div class="company-box">
              <el-checkbox-group v-model="checkList" />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="condition-label">
              时间范畴
            </div>
          </el-col>
          <el-col :span="20">
            <div class="date-box">
              公司名称
            </div>
          </el-col>
        </el-row>
      </div>

    </div>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <div class="table-box">
          <el-table
            :data="provinceDataList1"
            highlight-current-row
            size="mini"
            :header-cell-style="{background:'#F8F9FA',color: '#505D69'}"
          >
            <el-table-column label="排序" align="center" width="60">
              <template slot-scope="{row}">
                <span>{{ row.rank }}</span>
              </template>
            </el-table-column>
            <el-table-column label="省份" align="center" width="100px">
              <template slot-scope="{row}">
                <span>{{ row.province }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属区域" align="center" width="80">
              <template slot-scope="{row}">
                <span>{{ row.scope }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年化服务金额(万元)" align="center" prop="money">
              <template slot-scope="{row}">
                <span>{{ row.money }}</span>
              </template>
            </el-table-column>
            <el-table-column label="占比（%）" align="center" prop="scale" width="80">
              <template slot-scope="{row}">
                <span>{{ row.scale ? row.scale * 100 : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="table-box">
          <el-table
            :data="provinceDataList2"
            highlight-current-row
            size="mini"
            :header-cell-style="{background:'#F8F9FA',color: '#505D69'}"
          >
            <el-table-column label="排序" align="center" width="60">
              <template slot-scope="{row}">
                <span>{{ row.rank }}</span>
              </template>
            </el-table-column>
            <el-table-column label="省份" align="center" width="100px">
              <template slot-scope="{row}">
                <span>{{ row.province }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属区域" align="center" width="80">
              <template slot-scope="{row}">
                <span>{{ row.scope }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年化服务金额(万元)" align="center" prop="money">
              <template slot-scope="{row}">
                <span>{{ row.money }}</span>
              </template>
            </el-table-column>
            <el-table-column label="占比（%）" align="center" prop="scale" width="80">
              <template slot-scope="{row}">
                <span>{{ row.scale ? row.scale * 100 : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="table-box">
          <el-table
            :data="provinceDataList3"
            highlight-current-row
            size="mini"
            fit
            :header-cell-style="{background:'#F8F9FA',color: '#505D69'}"
          >
            <el-table-column label="排序" align="center" width="60">
              <template slot-scope="{row}">
                <span>{{ row.rank }}</span>
              </template>
            </el-table-column>
            <el-table-column label="省份" align="center" width="100px">
              <template slot-scope="{row}">
                <span>{{ row.province }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属区域" align="center" width="80">
              <template slot-scope="{row}">
                <span>{{ row.scope }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年化服务金额(万元)" align="center" prop="money">
              <template slot-scope="{row}">
                <span>{{ row.money }}</span>
              </template>
            </el-table-column>
            <el-table-column label="占比（%）" align="center" prop="scale" width="80">
              <template slot-scope="{row}">
                <span>{{ row.scale ? row.scale * 100 : '' }}</span>
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
import { add } from '@/utils'

export default {
  name: 'OrderProvince',
  data() {
    return {
      loader: {
        listLoading: false
      },
      companyList: [],
      provinceList: [
        '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省',
        '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西省', '海南省', '重庆市',
        '四川省', '贵州省', '云南省', '西藏省', '陕西省', '甘肃省', '青海省', '宁夏省', '新疆省', '香港市', '澳门市'],
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
      }
    }
  },
  computed: {
    provinceDataList1() {
      if (this.provinceData.list.length > 11) {
        return this.provinceData.list.slice(0, 10).map((item, index) => {
          return {
            rank: index + 1,
            ...item
          }
        })
      }

      const temp = []
      for (let i = 0; i < 11; i++) {
        if (this.provinceData.list.length > i) {
          temp.push({
            rank: i + 1,
            ...this.provinceData.list[i]
          })
        } else {
          const province = this.provinceList.find(p => {
            const index = temp.findIndex(data => {
              return data.province === p
            })
            return index === -1
          })
          temp.push({
            rank: i + 1,
            province: province
          })
        }
      }
      return temp
    },
    provinceDataList2() {
      if (this.provinceData.list.length > 22) {
        return this.provinceData.list.slice(11, 21).map((item, index) => {
          return {
            rank: index + 1,
            ...item
          }
        })
      }

      const temp = []
      for (let i = 11; i < 22; i++) {
        if (this.provinceData.list.length > i) {
          temp.push({
            rank: i + 1,
            ...this.provinceData.list[i]
          })
        } else {
          const province = this.provinceList.find(p => {
            const index1 = temp.findIndex(data => {
              return data.province === p
            })
            const index2 = this.provinceDataList1.findIndex(data => {
              return data.province === p
            })
            return index1 === -1 && index2 === -1
          })
          temp.push({
            rank: i + 1,
            province: province
          })
        }
      }
      return temp
    },
    provinceDataList3() {
      if (this.provinceData.list.length >= 33) {
        return this.provinceData.list.slice(22, 32).map((item, index) => {
          return {
            rank: index + 1,
            ...item
          }
        })
      }

      const temp = []
      for (let i = 22; i < 33; i++) {
        if (this.provinceData.list.length > i) {
          temp.push({
            rank: i + 1,
            ...this.provinceData.list[i]
          })
        } else {
          const province = this.provinceList.find(p => {
            const index1 = temp.findIndex(data => {
              return data.province === p
            })
            const index2 = this.provinceDataList1.findIndex(data => {
              return data.province === p
            })
            const index3 = this.provinceDataList2.findIndex(data => {
              return data.province === p
            })
            return index1 === -1 && index2 === -1 && index3 === -1
          })
          temp.push({
            rank: i + 1,
            province: province
          })
        }
      }
      return temp
    }
  },
  mounted() {
    this.getCompanyList()
    this.getOrderProvinceList()
  },
  methods: {
    ...mapActions('report', ['getOrderProvinceListX', 'getCompanyListX']),
    async getCompanyList() {
      const { data } = await this.getCompanyListX()
      this.companyList = data
      if (data.length > 0) {
        this.provinceData.form.company = data[0]
        this.getOrderProvinceList()
      }
    },
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
    }
  }
}
</script>

<style scoped lang="scss">

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
        background: #4774F5;
        margin-right: 8px;
      }
    }
  }

  .header-wrapper {
    background: white;
    padding: 26px 16px 53px;

    .condition-box {
      background: #F8F9FA;
      border-radius: 10px;
    }

  }

  .table-box {
    background: white;
    padding: 25px 20px 30px;
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
