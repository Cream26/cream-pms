import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';
import overview from '@/views/project/card/index.vue';

const project: AppRouteRecordRaw = {
  path: '/task',
  name: 'task',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '任务管理',
    requiresAuth: true,
    icon: 'icon-list',
    order: 0,
    hideInMenu: true,
  },
  children: [
    {
      path: 'task-analysis/:id',
      name: 'taskAnalysis',
      component: () => import('@/views/task/analysis/index.vue'),
      meta: {
        locale: '任务分析',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'detail/:id',
      name: 'taskDetail',
      component: () => import('@/views/task/detail/index.vue'),
      meta: {
        locale: '任务详情',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default project;
