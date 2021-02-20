import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const dynamicRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    key: 1,
    meta: { title: '系统首页', icon: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/example/list',
    key: 2,
    name: 'Report',
    meta: {
      title: '报表系统',
      icon: 'report'
    },
    children: [
      {
        path: 'order-range',
        component: () => import('@/views/report/order-range'),
        name: 'OrderRange',
        meta: { title: '订单获取榜单分析', icon: 'range' }
      },
      {
        path: 'order-province',
        component: () => import('@/views/report/order-province'),
        name: 'OrderProvince',
        meta: { title: '订单省市分布分析', icon: 'province' }
      },
      {
        path: 'order-scope',
        component: () => import('@/views/report/order-scope'),
        name: 'OrderScope',
        meta: { title: '订单地理区域分析', icon: 'el-icon-s-order' }
      },
      {
        path: 'order-distribution',
        component: () => import('@/views/report/order-distribution'),
        name: 'OrderDistribution',
        meta: { title: '订单区域竞争分析', icon: 'list' }
      },
      {
        path: 'order-cover',
        component: () => import('@/views/report/order-cover'),
        name: 'OrderCover',
        meta: { title: '订单覆盖率分析', icon: 'cover' }
      },
      {
        path: 'order-service',
        component: () => import('@/views/report/order-service'),
        name: 'OrderService',
        meta: { title: '月度订单数据库', icon: 'month' }
      }
    ]
  },
  {
    path: '/tender',
    component: Layout,
    redirect: '/tender/list',
    key: 4,
    name: 'Tender',
    meta: {
      title: '招标系统',
      icon: 'tender'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/tender/list'),
        name: 'TenderList',
        meta: { title: '数据报表', icon: 'data' }
      },
      {
        path: 'statistics',
        component: () => import('@/views/tender/statistics'),
        name: 'TenderStatistics',
        meta: { title: '统计分析', icon: 'statistics' }
      },
      {
        path: 'export',
        component: () => import('@/views/tender/export'),
        name: 'TenderExport',
        meta: { title: '导出系统', icon: 'export' }
      }
    ]
  },
  {
    path: '/bid',
    component: Layout,
    redirect: '/bid/list',
    name: 'Bid',
    key: 3,
    meta: {
      title: '中标系统',
      icon: 'bid'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/bid/list'),
        name: 'BidList',
        meta: { title: '数据报表', icon: 'data' }
      },
      {
        path: 'statistics',
        component: () => import('@/views/bid/statistics'),
        name: 'BidStatistics',
        meta: { title: '统计分析', icon: 'statistics' }
      },
      {
        path: 'export',
        component: () => import('@/views/bid/export'),
        name: 'BidExport',
        meta: { title: '导出系统', icon: 'export' }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/list',
    key: 5,
    name: 'Task',
    meta: {
      title: '系统管理',
      icon: 'system'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/task/list'),
        name: 'TaskList',
        meta: { title: '采集任务', icon: 'task' }
      },
      {
        path: 'category',
        component: () => import('@/views/task/category'),
        name: 'TaskCategory',
        meta: { title: '分类配置', icon: 'distribution' }
      },
      {
        path: 'website',
        component: () => import('@/views/task/website'),
        name: 'FavoriteWebsite',
        meta: { title: '常用网址', icon: 'website' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    key: 6,
    meta: { title: '权限设置', icon: 'permission' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/permission/index'),
        name: 'Permission',
        meta: { title: '权限设置', icon: 'permission', noCache: true }
      },
      {
        path: 'record',
        component: () => import('@/views/permission/record'),
        name: 'Record',
        meta: { title: '登录历史', icon: 'lock', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
