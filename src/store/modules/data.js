import request from '@/utils/request'

const state = {

}

const mutations = {

}

const actions = {
  // 招标金额排行
  getTenderPriceListX({ commit }, params) {
    return request({
      url: `/statistical/price`,
      method: 'get',
      params
    })
  },
  // 招标订单省份排行
  getTenderProvinceListX({ commit }, params) {
    return request({
      url: `/statistical/province/`,
      method: 'get',
      params
    })
  },
  // 招标列表数据
  getTenderDataX({ commit }, params) {
    return request({
      url: `/tender/result`,
      method: 'get',
      params
    })
  },
  // 主页招投标数据查询
  getSummaryDataX({ commit }, params) {
    return request({
      url: `/summary/main/num`,
      method: 'get',
      params
    })
  },
  // 主页招投标详细数据查询
  getSummaryDetailDataX({ commit }, params) {
    return request({
      url: `/summary/main/count`,
      method: 'get',
      params
    })
  },
  // 中标金额排行榜
  getBidPriceListX({ commit }, params) {
    return request({
      url: `/summary/main/company`,
      method: 'get',
      params
    })
  },
  // 中标数量排行
  getBidNumListX({ commit }, params) {
    return request({
      url: `/summary/main/win_tender`,
      method: 'get',
      params
    })
  },
  // 中标数据列表
  getBidDataListX({ commit }, params) {
    return request({
      url: `/win_tender/result`,
      method: 'get',
      params
    })
  },
  // 更新中标数据
  updateBidItemDataX({ commit }, params) {
    return request({
      url: `/win_tender/result/${params.id}/${params.time}`,
      method: 'put'
    })
  },
  // 中标合同金额
  getBidContractPriceListX({ commit }, params) {
    return request({
      url: `/statistical/win/money`,
      method: 'get',
      params
    })
  },
  gitBidAnnualizedAmountListX({ commit }, params) {
    return request({
      url: `/statistical/win/money/average`,
      method: 'get',
      params
    })
  },
  // 省份信息查询
  getProvinceInfoX({ commit }) {
    return request({
      url: `/region/province`,
      method: 'get'
    })
  },
  // 导出中标数据
  exportBidDataX({ commit }, params) {
    return request({
      url: `export/win_tender`,
      method: 'get',
      params
    })
  },
  // 导出招标数据
  exportTenderDataX({ commit }, params) {
    return request({
      url: `export/tender`,
      method: 'get',
      params
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
