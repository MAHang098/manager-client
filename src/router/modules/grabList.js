import Layout from '@/layout'

const grabListRouter = {
  path: '/grabList',
  component: Layout,
  redirect: 'noRedirect',
  name: 'grabLists',
  meta: {
    title: '抢单管理',
    icon: 'component'
  },
  children: [{
      path: 'grabList',
      component: () => import('@/views/grabSheet-list/grablist'),
      name: 'grabList',
      meta: {
        title: '抢单列表'
      }
    },
    {
        path: 'editGrab',
        component: () => import('@/views/grabSheet-list/editGrab'),
        name: 'editGrab',
        meta: { title: '添加抢单' },
        hidden: true
      },
    // {
    //   path: 'identityAudit',
    //   component: () => import('@/views/user/identityAudit'),
    //   name: 'identityAudit',
    //   meta: {
    //     title: '身份审核'
    //   }
    // },
    // {
    //   path: 'identify',
    //   component: () => import('@/views/user/identify'),
    //   name: 'identify',
    //   meta: {
    //     title: '实名审核'
    //   }
    // }


  ]
}

export default grabListRouter
