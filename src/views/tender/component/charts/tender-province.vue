<template>
  <div ref="chart" :class="className" />
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'TenderProvince',
  props: {
    provinceData: {
      type: Array,
      default() {
        return []
      }
    },
    allProvinceList: {
      type: Array,
      default() {
        return []
      }
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
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs['chart'])
    },
    updateChart(data) {
      this.chart.setOption({
        color: ['#409EFF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {},
        xAxis: [{
          type: 'category',
          data: this.formatXAxisData(data),
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
        series: [{
          type: 'bar',
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            color: '#409EFF',
            fontWeight: 'bold',
            fontSize: 16
          },
          data: this.formatYAxisData(data)
        }]
      })
    },
    formatXAxisData(data) {
      return data.map(item => {
        return item.province
      })
    },
    formatYAxisData(data) {
      return data.map(item => {
        return item.rprice
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
