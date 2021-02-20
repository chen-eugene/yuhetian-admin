import request from '@/utils/request'

const state = {

}

const mutations = {

}

const actions = {
  // 获取任务列表
  getTaskListX({ commit }, params) {
    return request({
      url: `/rule`,
      method: 'get',
      params
    })
  },
  // 添加任务
  addTaskX({ commit }, data) {
    return request({
      url: `/rule`,
      method: 'post',
      data
    })
  },
  // 获取任务详情
  getTaskDetailX({ commit }, params) {
    return request({
      url: `/rule/${params.id}`,
      method: 'get'
    })
  },
  // 更新任务详情
  updateTaskX({ commit }, payload) {
    return request({
      url: `/rule/${payload.id}`,
      method: 'put',
      data: payload.data
    })
  },
  // 获取任务分类
  getTaskTypesX({ commit }, params) {
    return request({
      url: `/category`,
      method: 'get',
      params
    })
  },
  addTaskTypeX({ commit }, data) {
    return request({
      url: `/category`,
      method: 'post',
      data
    })
  },
  updateTaskTypeX({ commit }, data) {
    return request({
      url: `/category/${data.categoryId}`,
      method: 'put',
      data
    })
  },
  // 删除任务分类
  deleteTaskTypeX({ commit }, params) {
    return request({
      url: `/category/${params.id}`,
      method: 'delete'
    })
  },
  getTaskRulesX({ commit }, params) {
    return request({
      url: `/keyword/${params.id}`,
      method: 'get'
    })
  },
  // 获取分类的关键词
  getCategoryKeywordsX({ commit }, params) {
    return request({
      url: `/category/word/${params.categoryId}`,
      method: 'get'
    })
  },
  // 保存分类的关键词
  saveCategoryKeywordsX({ commit }, data) {
    return request({
      url: `/category/word/${data.categoryId}`,
      method: 'post',
      data
    })
  },
  // 获取任务的关键词
  getTaskKeywordsX({ commit }, params) {
    return request({
      url: `/rule/${params.taskId}/word`,
      method: 'get'
    })
  },
  // 保存任务的关键词
  saveTaskKeywordsX({ commit }, payload) {
    return request({
      url: `/rule/${payload.taskId}/word`,
      method: 'post',
      data: payload.data
    })
  },
  // 获取任务字段
  getTaskFieldsX({ commit }, params) {
    return request({
      url: `/keyword/${params.taskId}`,
      method: 'get'
    })
  },
  // 保存任务字段
  saveTaskFieldsX({ commit }, payload) {
    return request({
      url: `/keyword/${payload.taskId}`,
      method: 'post',
      data: payload.data
    })
  },
  // 保存任务
  deleteTaskX({ commit }, params) {
    return request({
      url: `/rule/${params.taskId}`,
      method: 'delete'
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
