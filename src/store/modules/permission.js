import { dynamicRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, role) {
  if (role === 1) {
    return routes
  }

  const res = []
  routes.forEach(route => {
    const tmp = { ...route }

    console.log('tempRoute -->', tmp)
    // if (hasPermission(roles, tmp)) {
    //   if (tmp.children) {
    //     tmp.children = filterAsyncRoutes(tmp.children, roles)
    //   }
    //   res.push(tmp)
    // }
  })

  return res
}

export function mapFunctionRoute(routes, functionList) {
  const res = []
  routes.forEach(route => {
    functionList.forEach(item => {
      if (item.fid === route.key) {
        res.push(route)
      }
    })
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutesX({ commit }, payload) {
    const { role, functionList } = payload
    return new Promise(resolve => {
      let accessedRoutes
      if (role === 1) {
        accessedRoutes = dynamicRoutes || []
      } else {
        accessedRoutes = mapFunctionRoute(dynamicRoutes, functionList)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
