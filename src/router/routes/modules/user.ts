import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.user',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: 'info',
      name: 'Info',
      component: () => import('@/views/user/info/index.vue'),
      meta: {
        locale: '用户信息',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'setting',
    //   name: 'Setting',
    //   component: () => import('@/views/user/setting/index.vue'),
    //   meta: {
    //     locale: '信息设置',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'calendar',
      name: 'Calendar',
      component: () => import('@/views/user/calendar/index.vue'),
      meta: {
        locale: '我的日历',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USER;
