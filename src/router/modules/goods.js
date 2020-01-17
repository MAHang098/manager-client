import Layout from '@/layout'

const goodsListRouter = {
  path: '/goods',
  component: Layout,
  redirect: 'noRedirect',
  name: 'goodsList',
  meta: {
    title: '商品管理',
    icon: 'component'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/goods/index'),
      name: 'goodsIndex',
      meta: {
        title: '商品列表'
      }
    }
  ]
}

export default goodsListRouter
