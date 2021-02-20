<template>
  <div ref="chart" :class="className" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'LineChart',
  props: {
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    },
    itemName: {
      type: String,
      default: ''
    },
    itemColor: {
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
    updateChart(bidData) {
      this.chart.setOption({
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
            type: 'none'
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
            show: false
          }
        }],
        dataZoom: {
          start: 0,
          show: true,
          type: 'inside',
          endValue: 15
        },
        series: [{
          name: this.itemName,
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: this.itemColor
          },
          data: this.formatData(bidData)
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
      return temp
    }
  }
}
</script>

<style scoped>

</style>
