import Layout from '@/layout'


const cash = {
  path: '/cash',
  component: Layout,
  redirect: 'noRedirect',
  name: 'cash',
  meta: {
    title: '提现审核',
    icon: 'component'
  },
  children: [
    {
      path: 'alipay',
      component: () => import('@/views/cash/alipay'),
      name: 'alipay',
      meta: { title: '支付宝' }
    },
    {
      path: 'bank',
      component: () => import('@/views/cash/bank'),
      name: 'bank',
      meta: { title: '银行支付' }
    }
    
  ]
}

export default cash