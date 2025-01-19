import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MANAGEMENT: AppRouteRecordRaw = {
  path: '/member',
  name: 'member',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '员工管理',
    icon: 'icon-user-group',
    requiresAuth: true,
    order: 1,
  },
  children: [
    {
      path: 'list',
      name: 'memberList',
      component: () => import('@/views/management/index.vue'),
      meta: {
        locale: '员工列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'role',
    //   name: 'memberRole',
    //   component: () => import('@/views/member/list/index.vue'),
    //   meta: {
    //     locale: '角色管理',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
  ],
};

export default MANAGEMENT;
