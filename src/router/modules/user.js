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
		path: 'userAdmin',
		component: () => import('@/views/user/userAdmin'),
		name: 'userAdmin',
		meta: {
		  title: '用户列表'
		}
	},
	{
		path: 'identityAudit',
		component: () => import('@/views/user/identityAudit'),
		name: 'identityAudit',
		meta: {
			title: '身份审核'
		}
    },
    {
		path: 'identify',
		component: () => import('@/views/user/identify'),
		name: 'identify',
		meta: {
			title: '实名审核'
		}
    },
    {
		path: 'balance',
		component: () => import('@/views/user/balance'),
		name: 'balance',
		meta: {
			title: '余额日志'
		}
    },
    {
		path: 'integral',
		component: () => import('@/views/user/integral'),
		name: 'integral',
		meta: {
			title: '积分日志'
		}
    }



  ]
}

export default userRouter
