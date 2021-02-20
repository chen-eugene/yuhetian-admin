<template>
  <div ref="chart" :class="className" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'LineChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    years: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    seriesItems() {
      return this.data.map(item => {
        return {
          name: item.company,
          type: 'line',
          label: {
            show: false,
            position: 'top',
            // color: '#30B08F',
            fontWeight: 'bold',
            fontSize: 16
          },
          itemStyle: {
            // color: '#30B08F'
          },
          data: Object.values(item.data)
        }
      })
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs['chart'])
      this.updateChart()
    },
    updateChart() {
      this.chart.setOption({
        color: ['#FF6E40', '#5D4037', '#FFD740', '#FFAB40', '#B2FF59', '#69F0AE', '#40C4FF', '#E040FB'],
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
          // data: [2018, 2019, 2020, 2021],
          data: this.years,
          axisTick: {
            alignWithLabel: true
          },
          axisPointer: {
            show: true,
            type: 'none'
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
          endValue: 30
        },
        series: this.seriesItems
      })
    },
    formatData(data, labels) {
      const temp = data.map(item => {
        const temp = []
        Object.keys(labels).forEach(label => {
          temp.push(item[label])
        })
        return temp
      })
      return temp
    }
  }
}
</script>

<style scoped>

</style>
