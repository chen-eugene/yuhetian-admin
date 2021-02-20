<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">环卫服务招投标统计年化金额覆盖率情况（单位：万元）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="annualizedCoverData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getAnnualizedCover"
              />
            </el-form-item>
          </el-form>
          <el-table
            v-loading="loader.annualizedLoading"
            :data="annualizedCoverList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            size="mini"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
            :span-method="objectSpanMethod"
          >
            <el-table-column
              align="center"
              label="公司名称"
              width="180px"
            >
              <template slot-scope="{row}">
                <span>{{ row.company }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="数据来源"
              width="140px"
            >
              <template slot-scope="{row}">
                <span>{{ row.source }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in annualizedCoverYears"
              :key="key"
              align="center"
              :label="key"
            >
              <template slot-scope="{row}">
                <span v-if="row.source === '公告数据'">
                  <span v-if="row[key]">
                    <span>parseFloat(row[key])</span>/
                    <span style="color: #1890FF;cursor:pointer;" @click="openAnnouncementDialog(row[key], key, annualizedCoverData.type)">
                      修改
                    </span>
                  </span>
                  <span style="color: #1890FF;cursor:pointer;" @click="openAnnouncementDialog(row[key], key, annualizedCoverData.type)">
                    填写
                  </span>
                </span>
                <span v-else>{{ row[key] ? parseFloat(row[key]) : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <div class="table-box">
          <div class="header">
            <span class="tips">环卫服务招投标统计总金额覆盖率情况（单位：万元）</span>
          </div>
          <el-form inline label-width="80" size="mini">
            <el-form-item label="时间">
              <el-date-picker
                v-model="totalPriceData.form.date"
                type="monthrange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                @change="getTotalPriceCover"
              />
            </el-form-item>
          </el-form>
          <el-table
            v-loading="loader.totalPriceLoading"
            :data="totalPriceCoverList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            size="mini"
            :header-cell-style="{background:'#FAFAFA',color:'#606266'}"
            :span-method="objectSpanMethod"
          >
            <el-table-column
              align="center"
              label="公司名称"
              width="180px"
            >
              <template slot-scope="{row}">
                <span>{{ row.company }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="数据来源"
              width="140px"
            >
              <template slot-scope="{row}">
                <span>{{ row.source }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="key in totalPriceCoverYears"
              :key="key"
              align="center"
              :label="key"
            >
              <template slot-scope="{row}">
                <span v-if="row.source === '公告数据'">
                  <span v-if="row[key]">
                    <span>parseFloat(row[key])</span>/
                    <span style="color: #1890FF;cursor:pointer;" @click="openAnnouncementDialog(row[key], key, annualizedCoverData.type)">
                      修改
                    </span>
                  </span>
                  <span style="color: #1890FF;cursor:pointer;" @click="openAnnouncementDialog(row[key], key, annualizedCoverData.type)">
                    填写
                  </span>
                </span>
                <span v-else>{{ row[key] ? parseFloat(row[key]) : '' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="请填写公告数据"
      :visible.sync="announcementDialogVisible"
      :before-close="closeAnnouncementDialog"
      width="400px"
    >
      <el-form ref="announcementForm" :model="announcementForm" :rules="announcementRules" inline label-width="120" size="mini">
        <el-form-item label="公告数据(万元)" prop="money">
          <el-input v-model="announcementForm.money" placeholder="请输入公告数据" oninput="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAnnouncementDialog">取消</el-button>
        <el-button type="primary" size="mini" :loading="loader.commonLoading" @click="updateAnnouncementData">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'OrderCover',
  data() {
    return {
      loader: {
        annualizedLoading: false,
        totalPriceLoading: false,
        commonLoading: false
      },
      annualizedCoverData: {
        type: 1,
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
      totalPriceData: {
        type: 2,
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
      announcementDialogVisible: false,
      announcementForm: {
        type: 1,
        year: '',
        money: ''
      },
      announcementRules: {
        money: [{ required: true, message: '请填写运营时间', trigger: 'blur' }]
      }
    }
  },
  computed: {
    annualizedCoverYears() {
      const lenArray = this.annualizedCoverData.list.map(item => {
        return item.money_list.length
      })
      const maxLen = Math.max.apply(null, lenArray)
      const index = lenArray.indexOf(maxLen)
      if (index !== -1) {
        const tempData = this.annualizedCoverData.list[index]
        return tempData.money_list.map(item => {
          return item.year
        })
      }
      return []
    },
    annualizedCoverList() {
      const retArray = []
      this.annualizedCoverData.list.forEach(item => {
        const obj1 = {
          company: item.company,
          source: '订单统计'
        }
        const obj2 = {
          company: item.company,
          source: '公告数据'
        }
        const obj3 = {
          company: item.company,
          source: '占比'
        }
        this.annualizedCoverYears.forEach(year => {
          const tempMoneyItem = item.money_list.find(money_item => {
            return money_item.year === year
          })
          obj1[year] = tempMoneyItem ? tempMoneyItem.money : ''
          obj2[year] = tempMoneyItem ? tempMoneyItem.notice_money : ''
          obj3[year] = tempMoneyItem ? tempMoneyItem.scale : ''
        })

        retArray.push(...[obj1, obj2, obj3])
      })
      console.log('annualizedCoverList -->', retArray)
      return retArray
    },
    totalPriceCoverYears() {
      const lenArray = this.totalPriceData.list.map(item => {
        return item.money_list.length
      })
      const maxLen = Math.max.apply(null, lenArray)
      const index = lenArray.indexOf(maxLen)
      if (index !== -1) {
        const tempData = this.totalPriceData.list[index]
        return tempData.money_list.map(item => {
          return item.year
        })
      }
      return []
    },
    totalPriceCoverList() {
      const retArray = []
      this.totalPriceData.list.forEach(item => {
        const obj1 = {
          company: item.company,
          source: '订单统计'
        }
        const obj2 = {
          company: item.company,
          source: '公告数据'
        }
        const obj3 = {
          company: item.company,
          source: '占比'
        }
        this.annualizedCoverYears.forEach(year => {
          const tempMoneyItem = item.money_list.find(money_item => {
            return money_item.year === year
          })
          obj1[year] = tempMoneyItem ? tempMoneyItem.money : ''
          obj2[year] = tempMoneyItem ? tempMoneyItem.notice_money : ''
          obj3[year] = tempMoneyItem ? tempMoneyItem.scale : ''
        })

        retArray.push(...[obj1, obj2, obj3])
      })
      return retArray
    }
  },
  mounted() {
    this.getAnnualizedCover()
    this.getTotalPriceCover()
  },
  methods: {
    ...mapActions('report', ['getAnnualizedCoverX', 'getTotalPriceCoverX', 'updateAnnouncementDataX']),
    async getAnnualizedCover() {
      this.loader.listLoading = true

      const params = {
        per_page: this.annualizedCoverData.pagination.pageSize,
        current_page: this.annualizedCoverData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.annualizedCoverData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.annualizedCoverData.form.date[0])
        end_time = this.$monthEndDay(this.annualizedCoverData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.annualizedCoverData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getAnnualizedCoverX(params)
      this.annualizedCoverData.list = res.data || []
      // this.annualizedCoverData.pagination.total = res.meta.pagination.total

      this.loader.listLoading = false
    },
    async getTotalPriceCover() {
      this.loader.totalPriceLoading = true

      const params = {
        per_page: this.totalPriceData.pagination.pageSize,
        current_page: this.totalPriceData.pagination.curPage
      }

      let start_time
      let end_time
      if (this.totalPriceData.form.date.length === 2) {
        start_time = this.$monthStartDay(this.totalPriceData.form.date[0])
        end_time = this.$monthEndDay(this.totalPriceData.form.date[1])
      } else {
        start_time = this.$monthStartDay(new Date())
        end_time = this.$monthEndDay(new Date())
        this.totalPriceData.form.date.push(start_time, end_time)
      }
      params.start_time = start_time
      params.end_time = end_time

      const res = await this.getTotalPriceCoverX(params)
      this.totalPriceData.list = res.data || []
      // this.totalPriceData.pagination.total = res.meta.pagination.total

      this.loader.totalPriceLoading = false
    },
    openAnnouncementDialog(money, year, type) {
      this.announcementForm.type = type
      this.announcementForm.year = year
      this.announcementForm.money = money
      this.announcementDialogVisible = true
    },
    closeAnnouncementDialog() {
      this.announcementDialogVisible = false
    },
    updateAnnouncementData() {
      this.$refs['announcementForm'].validate(async valid => {
        if (valid) {
          this.loader.commonLoading = true
          const payload = {
            year: this.announcementForm.year
          }

          if (this.announcementForm.type === this.annualizedCoverData.type) {
            payload.notice_money = this.announcementForm.money
          } else if (this.announcementForm.type === this.totalPriceData.type) {
            payload.notice_total_money = this.announcementForm.money
          }

          await this.updateAnnouncementDataX(payload).finally(() => {
            this.loader.commonLoading = false
          })
          Message.success('修改成功')
          this.closeAnnouncementDialog()
        }
      })
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
