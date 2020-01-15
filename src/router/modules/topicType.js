import Layout from '@/layout'

const topicTypeRouter = {
  path: '/topicType',
  component: Layout,
  redirect: 'noRedirect',
  name: 'topicType',
  meta: {
    title: '话题列表',
    icon: 'component'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/topicType/index'),
      name: 'topicIndex',
      meta: {
        title: '话题类型列表'
      }
    },
    {
      path: 'edit',
      component: () => import('@/views/topicType/edit'),
      name: 'editTopic',
      meta: {
        title: '编辑话题类型'
      },
      hidden: true
    }
  ]
}

export default topicTypeRouter
