import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';
import overview from '@/views/project/card/index.vue';

const project: AppRouteRecordRaw = {
  path: '/project',
  name: 'project',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '项目管理',
    requiresAuth: true,
    icon: 'icon-list',
    order: 0,
  },
  children: [
    {
      path: 'overview',
      name: 'overview',
      component: () => import('@/views/project/card/index.vue'),
      meta: {
        locale: '项目概览',
        requiresAuth: true,
        roles: ['*'],
        ignoreCache: true,
      },
    },
    {
      path: 'list',
      name: 'projectList',
      component: () => import('@/views/project/table/index.vue'),
      meta: {
        locale: '项目集合',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'task-list',
    //   name: 'projectTaskList',
    //   component: () => import('@/views/project/search-table/index.vue'),
    //   meta: {
    //     locale: '任务列表',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'detail/:id',
      name: 'projectDetail',
      component: () => import('@/views/project/detail/index.vue'),
      meta: {
        locale: '项目详情',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default project;
