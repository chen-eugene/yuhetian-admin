<template>
  <div class="picker-wrapper">
    <el-date-picker
      v-model="date"
      type="monthrange"
      align="center"
      unlink-panels
      size="mini"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :clearable="false"
      @change="onPickDate"
    />
    <svg-icon icon-class="calendar" class-name="picker-icon" />
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  model: {
    prop: 'value',
    event: 'pick'
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      date: []
    }
  },
  watch: {
    value(val) {
      this.date = val
    }
  },
  methods: {
    onPickDate(date) {
      this.$emit('pick', date)
    }
  }
}
</script>

<style scoped lang="scss">

  .picker-wrapper {
    width: 300px;
    height: 40px;
    line-height: 40px;
    background: #FFFFFF;
    box-shadow: 0 4px 12px 0 rgba(179, 192, 231, 0.24);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;

    .picker-icon {
      width: 24px;
      height: 24px;
      color: #8E97B3;
    }
  }

  .el-input__inner {
    border: none;
    padding: 0;
    height: 40px;
    width: auto;
    display: flex;

    ::v-deep .el-input__icon {
      display: none;
    }

    ::v-deep .el-range-separator {
      line-height: 40px;
    }

    ::v-deep .el-range-input {
      color: #8E97B3;
      font-size: 12px;
      flex: 1;
    }
  }

</style>
