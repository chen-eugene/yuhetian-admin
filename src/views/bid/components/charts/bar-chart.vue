<template>
  <div ref="chart" :class="className" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'BarChart',
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
      // this.years.map(year => {
      //   this.data.map(item => {
      //     return item[year]
      //   })
      // })

      return this.data.map(item => {
        console.log('seriesItems -->', item.data)
        return {
          name: item.company,
          type: 'bar',
          barWidth: '40%',
          stack: '总量',
          // label: {
          //   show: false,
          //   position: 'top',
          //   // color: '#E65D6E',
          //   fontWeight: 'bold',
          //   fontSize: 16
          // },
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
        title: {
          text: '总体市场',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 24
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: true,
          right: '10%',
          bottom: '0',
          itemWidth: 10
        },
        xAxis: [{
          type: 'category',
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
          name: '万元',
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
          type: 'inside'
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
