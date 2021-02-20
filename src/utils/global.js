import { formatDate, formatTomorrow, formatMoney } from '../filters/index'
import { getTargetDate, monthStartDay, monthEndDay, isNumber } from '@/utils/index'

export default {
  install(Vue) {
    Vue.prototype.$date = date => formatDate(date, 'YYYY-MM-DD')
    Vue.prototype.$time = formatDate
    Vue.prototype.$formatTomorrow = formatTomorrow
    Vue.prototype.$currency = formatMoney
    Vue.prototype.$targetDate = getTargetDate
    Vue.prototype.$monthStartDay = monthStartDay
    Vue.prototype.$monthEndDay = monthEndDay
    Vue.prototype.$isNumber = isNumber
  }
}
