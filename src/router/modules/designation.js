import Layout from '@/layout'

const designationRouter = {
  path: '/designation',
  component: Layout,
  redirect: 'noRedirect',
  name: 'designationList',
  meta: {
    title: '称号管理列表',
    icon: 'component'
  },
  children: [
    {
      path: 'circle',
      component: () => import('@/views/designation/circle'),
      name: 'circleIndex',
      meta: {
        title: '居圈达人'
      }
    },
    {
        path: 'design',
        component: () => import('@/views/designation/design'),
        name: 'designIndex',
        meta: {
          title: '设计达人'
        }
    },
    // {
    //     path: 'index',
    //     component: () => import('@/views/designation/owner'),
    //     name: 'ownerIndex',
    //     meta: {
    //       title: '金牌业主'
    //     }
    // },
    // {
    //     path: 'circle',
    //     component: () => import('@/views/designation/circle'),
    //     name: 'circleIndex',
    //     meta: {
    //       title: '居圈达人'
    //     }
    // }
  ]
}

export default designationRouter
