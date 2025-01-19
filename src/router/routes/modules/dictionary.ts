import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/dictionary',
  name: 'dictionary',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '数据字典',
    icon: 'icon-tool',
    requiresAuth: true,
    order: 10,
  },
  children: [
    {
      path: 'code-store',
      name: 'codeStore',
      component: () => import('@/views/dictionary/index.vue'),
      meta: {
        locale: '代码仓库',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USER;
