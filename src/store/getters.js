const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  uid: state => state.user.uid,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  function_list: state => state.user.function_list,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  role: state => state.user.role
}
export default getters
