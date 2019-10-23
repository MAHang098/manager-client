import Layout from '@/layout'

const orderRecommand = {
  path: '/order-recommand',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '订单管理',
    icon: 'component'
  },
  children: [
    {
      path: 'recommand',
      component: () => import('@/views/order-manager/recommend'),
      name: 'recommand',
      meta: { title: '推荐订单' }
    },
    {
      path: 'vipPay',
      component: () => import('@/views/order-manager/vipPay'),
      name: 'vipPay',
      meta: { title: '会员支付订单' }
    },
  ]
}

export default orderRecommand