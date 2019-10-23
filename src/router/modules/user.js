import Layout from '@/layout'


const userRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '用户管理',
    icon: 'component'
  },
  children: [
    {
      path: 'balance',
      component: () => import('@/views/user/balance'),
      name: 'balance',
      meta: { title: '余额日志' }
    },
    {
      path: 'integral',
      component: () => import('@/views/user/integral'),
      name: 'integral',
      meta: { title: '积分日志' }
    },
    {
      path: 'identityAudit',
      component: () => import('@/views/user/identityAudit'),
      name: 'identityAudit',
      meta: { title: '身份审核' }
    },
    {
      path: 'identify',
      component: () => import('@/views/user/identify'),
      name: 'identify',
      meta: { title: '实名审核' }
    },
    {
      path: 'cash',
      component: () => import('@/views/user/cash'),
      name: 'cash',
      meta: { title: '提现审核' }
    },
    {
      path: '/cash',
      // component: () => import('@/views/user/balance'),
      name: 'test',
      redirect: 'Cash',
      component: () => import('@/views/user/cash'),
      meta: { title: '三级菜单' },
      children: [
        {
          path: 'bank',
          component: () => import('@/views/user/cash/bank'),
          name: 'bank',
          meta: { title: '银行' }
        },
        {
          path: 'alipay',
          component: () => import('@/views/user/cash/alipay'),
          name: 'alipay',
          meta: { title: '支付宝' }
        },
      ]
    },
  ]
}

export default userRouter