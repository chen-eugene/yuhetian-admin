<template>
  <el-table
    :data="list"
    highlight-current-row
    size="mini"
    :header-cell-style="{background:'#F8F9FA',color: '#505D69'}"
  >
    <slot />
  </el-table>
</template>

<script>
export default {
  name: 'Table',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
