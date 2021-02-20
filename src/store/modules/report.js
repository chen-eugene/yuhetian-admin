import request from '@/utils/request'

const state = {

}

const mutations = {

}

const actions = {
  // 获取订单省份分布情况
  getOrderProvinceListX({ commit }, params) {
    return request({
      url: `/report/company/province`,
      method: 'get',
      params
    })
  },
  // 获取订单省份分布情况
  getOrderRegionListX({ commit }, params) {
    return request({
      url: `/report/company/scope`,
      method: 'get',
      params
    })
  },
  // 订单获取年化金额榜单
  getOrderAverageListX({ commit }, params) {
    return request({
      url: `/report/company/average`,
      method: 'get',
      params
    })
  },
  // 订单获取总金额榜单
  getOrderTotalPriceListX({ commit }, params) {
    return request({
      url: `/report/company/total`,
      method: 'get',
      params
    })
  },
  // 订单获取年限榜单
  getOrderYearsListX({ commit }, params) {
    return request({
      url: `/report/company/year`,
      method: 'get',
      params
    })
  },
  // 月度订单
  getOrderMonthListX({ commit }, params) {
    return request({
      url: `/report/mouth/total`,
      method: 'get',
      params
    })
  },
  // 企业运营数据
  getCompanyMonthDataX({ commit }, params) {
    return request({
      url: `/report/year/total`,
      method: 'get',
      params
    })
  },
  // 获取中标公司列表
  getCompanyListX({ commit }) {
    return request({
      url: `/company/list`,
      method: 'get'
    })
  },
  // 获取年化金额覆盖率
  getAnnualizedCoverX({ commit }, params) {
    return request({
      url: `/report/cover`,
      method: 'get',
      params
    })
  },
  // 获取总金额覆盖率
  getTotalPriceCoverX({ commit }, params) {
    return request({
      url: `/report/cover/total`,
      method: 'get',
      params
    })
  },
  // 更新公告数据
  updateAnnouncementDataX({ commit }, payload) {
    return request({
      url: `/notice/money`,
      method: 'post',
      data: payload
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
