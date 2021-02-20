<template>
  <div ref="chart" :class="className" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'BarChart',
  props: {
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'chart'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    xAxisData() {
      const startTimestamp = new Date(this.$date(this.startTime)).getTime()
      const endTimestamp = new Date(this.$date(this.endTime)).getTime()
      const gap = (endTimestamp - startTimestamp) / 1000 / 60 / 60 / 24
      const dateArray = []
      for (let i = 0; i < gap; i++) {
        const timestamp = new Date().getTime() - (gap - i - 1) * 1000 * 60 * 60 * 24
        dateArray.push(this.$date(timestamp))
      }
      return dateArray
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs['chart'])
    },
    updateChart(bidData, tenderData) {
      this.chart.setOption({
        color: ['#488FF4', '#56D49B'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: true,
          right: '10%'
        },
        xAxis: [{
          type: 'category',
          data: this.xAxisData,
          axisTick: {
            alignWithLabel: true
          },
          axisPointer: {
            show: true,
            type: 'shadow'
          },
          axisLabel: {
            rotate: 30
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: true
          }
        }],
        dataZoom: {
          start: 0,
          show: true,
          type: 'inside',
          endValue: 30
        },
        series: [{
          name: '中标数量',
          type: 'bar',
          data: this.formatData(bidData)
        }, {
          name: '招标数量',
          type: 'bar',
          data: this.formatData(tenderData)
        }]
      })
    },
    formatData(val) {
      const temp = this.xAxisData.map(axis => {
        const target = val.find(item => {
          return item.date === axis
        })
        if (target) {
          return target.num
        }
        return 0
      })
      console.log('formatData -->', val)
      // console.log('formatData -->', temp)
      return temp
    }
  }
}
</script>

<style scoped>

</style>
