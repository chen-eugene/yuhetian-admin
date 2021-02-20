<template>
  <div ref="chart" :class="className" />
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'Region',
  props: {
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
        legend: {
          orient: 'vertical',
          left: 'left',
          data: data.map(item => {
            return item.name
          })
        },
        series: [{
          type: 'pie',
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)'
              },
              labelLine: { show: true }
            },
            emphasis: {
              label: {
                show: true,
                formatter: '{b}\n{c} ({d}%)',
                position: 'center',
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            }
          },
          data: data
        }]
      })
    }

  }
}
</script>

<style scoped lang="scss">

</style>
