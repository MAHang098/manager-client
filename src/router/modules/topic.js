import Layout from '@/layout'

const topicListRouter = {
  path: '/topic',
  component: Layout,
  redirect: 'noRedirect',
  name: 'topicList',
  meta: {
    title: '话题列表',
    icon: 'component'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/topic/index'),
      name: 'topicIndex',
      meta: {
        title: '话题列表'
      }
    },
    {
      path: 'edit',
      component: () => import('@/views/topic/edit'),
      name: 'editTopic',
      meta: {
        title: '编辑话题'
      },
      hidden: true
    }
  ]
}

export default topicListRouter
