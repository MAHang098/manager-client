import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'
import qs from 'qs'
import '../../global.js'

Vue.prototype.$axios = Axios
Vue.use(Router)

// Axios.defaults.baseURL = "https://www.zhongjubang.com/test/";
// Axios.defaults.baseURL = "https://www.zhongjubang.com/test/";

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
import tableRouter from './modules/table' // 新闻模块
// import nestedRouter from './modules/nested'
import user from './modules/user' // 用户管理模块
import brand from './modules/brand' // 品牌管理模块
import orderRecommand from './modules/orderRecommand' // 订单管理模块
import cash from './modules/cash' // 订单管理模块
import grabList from './modules/grabList' // 抢单管理模块
import topicList from './modules/topic' // 话题模块
import topicTypeRouter from './modules/topicType' // 话题 类型管理
import goodsListRouter from './modules/goods' // 商品模块
import designationRouter from './modules/designation' // 称号管理
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
icon: 'svg-name'             the icon show in the sidebar
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
  // {
  //   path: '/',
  //   redirect: '/table/complex-table',//设置默认指向的路径
  //   name: '新闻'
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () =>
        import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true
      }
    }]
  },

  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () =>
        import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () =>
      import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () =>
      import('@/views/error-page/401'),
    hidden: true
  },

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () =>
        import('@/views/profile/index'),
      name: 'Profile',
      meta: {
        title: 'Profile',
        icon: 'user',
        noCache: true
      }
    }]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  /** when your routing map is too long, you can split it into small modules **/

  tableRouter,
  // componentsRouter,
  user,
  brand,
  orderRecommand,
  cash,
  grabList,
  topicList,
  topicTypeRouter,
  goodsListRouter,
  designationRouter,
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  {
    path: '/Invitation',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Invitations',

    children: [
      {
        path: 'Invitation',
        component: () =>
          import('@/views/Invitation/Invitation'),
        name: 'Invitation',
        meta: {
          title: '邀请订单',
          icon: 'component'
        }
      }
    ]
  },
  {
    path: '/video',
    component: Layout,
    redirect: 'noRedirect',
    name: 'video',

    children: [
      {
        path: 'video',
        component: () =>
          import('@/views/video/index'),
        name: 'videoList',
        meta: {
          title: '视频列表',
          icon: 'component'
        }
      }
    ]
  },
  {
    path: '/G-circle',
    component: Layout,
    redirect: 'noRedirect',
    name: 'G_circle',

    children: [
      {
        path: 'G-circle',
        component: () =>
          import('@/views/G-circle/index'),
        name: 'G_circleList',
        meta: {
          title: '居圈列表',
          icon: 'component'
        }
      }
    ]
  }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
