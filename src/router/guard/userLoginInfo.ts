import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      if (userStore.id) {
        if (to.name === 'login') {
          next({
            path: '/',
          });
          return;
        }
        next();
      } else {
        try {
          await userStore.info();
          if (to.name === 'login') {
            next({
              path: '/',
            });
            return;
          }
          next();
        } catch (error) {
          await userStore.logout();
          next({
            path: '/login',
            query: {
              redirect: to.path,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.path,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
