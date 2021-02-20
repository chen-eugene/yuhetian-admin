import { getToken, setToken, setUid, clearCookie } from '@/utils/auth'
import { resetRouter } from '@/router'
import request from '@/utils/request'

const state = {
  token: getToken(),
  uid: '',
  role: -1, // 1 管理员  0 普通账号
  name: '',
  avatar: '',
  introduction: '',
  function_list: [],
  userInfo: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_FUNCTION_LIST: (state, list) => {
    state.function_list = list
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo

    const [response, err] = await request({
      url: '/user/login',
      method: 'post',
      data: {
        user_name: username.trim(),
        user_password: password
      }
    }).then(response => [response, null]).catch(err => [null, err])

    if (response) {
      const { data } = response
      commit('SET_UID', data.uid)
      const token = data.token
      setToken(token)
      setUid(data.uid)
      return Promise.resolve()
    } else {
      return Promise.reject(err)
    }
  },

  // get user info
  async getUserInfoX({ commit }, uid) {
    const [response, err] = await request({
      url: `/user/${uid}`,
      method: 'get'
    }).then(response => [response, null]).catch(err => [null, err])

    if (response) {
      const { data } = response

      if (!data) {
        return Promise.reject('请先登录')
      }

      const { role_id, name, function_list } = data
      commit('SET_USER_INFO', data)
      commit('SET_ROLE', role_id)
      commit('SET_NAME', name)
      commit('SET_FUNCTION_LIST', function_list)
      return Promise.resolve(data)
    } else {
      return Promise.reject(err)
    }
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_ROLE', -1)
        clearCookie()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  getUserListX() {
    return request({
      url: `/user`,
      method: 'get'
    })
  },

  addUserX({ commit }, data) {
    return request.post('/user', data)
  },

  updateUserX({ commit }, data) {
    return request.put(`/user/${data.uid}`, data)
  },

  resetTokenX({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLE', -1)
      clearCookie()
      resolve()
    })
  },

  queryIpX({ commit }) {
    return request({
      url: `user/ip`,
      method: 'get'
    })
  },

  changePasswordX({ commit }, data) {
    return request({
      url: `user/password`,
      method: 'put',
      data
    })
  },

  // 获取菜单列表
  getMenuListX({ commit }, params) {
    return request({
      url: `menu/uri`,
      method: 'get',
      params
    })
  },

  // 保存菜单
  addMenuX({ commit }, data) {
    return request({
      url: `menu/uri`,
      method: 'post',
      data
    })
  },

  // 修改菜单
  updateMenuX({ commit }, payload) {
    return request({
      url: `menu/uri/${payload.menuId}`,
      method: 'put',
      data: payload.data
    })
  },

  // 删除菜单
  deleteMenuX({ commit }, params) {
    return request({
      url: `menu/uri/${params.menuId}`,
      method: 'delete'
    })
  },

  // 获取登录历史
  getUserHistoryX({ commit }, params) {
    return request({
      url: `user/history`,
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
