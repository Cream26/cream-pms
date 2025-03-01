import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken, setToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

// 添加状态标记
let isRefreshing = false;
let isLogoutModalShown = false;
let isLoggingOut = false;

// 存储等待刷新token的请求队列
let waitingQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}> = [];

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.defaults.withCredentials = true;

// 统一处理登出逻辑
const handleLogout = async () => {
  if (isLoggingOut) return;

  isLoggingOut = true;
  try {
    const userStore = useUserStore();
    await userStore.logout();
    window.location.replace('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // 即使登出失败也跳转到登录页
    window.location.replace('/login');
  }
};

// 显示登出弹窗
const showLogoutModal = () => {
  if (isLogoutModalShown) return;

  isLogoutModalShown = true;
  Modal.error({
    title: '登录已过期',
    content: '您的登录已过期，请重新登录',
    okText: '重新登录',
    async onOk() {
      await handleLogout();
    },
    onCancel() {
      isLogoutModalShown = false;
    },
    onClose() {
      isLogoutModalShown = false;
    },
  });
};

// 刷新token的函数
const refreshToken = async () => {
  const response = await axios.get('/auth/refresh');
  const { token } = response.data;
  setToken(token);
  return token;
};

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 如果已经在登出过程中，取消后续请求
    if (isLoggingOut) {
      const error = new Error('Cancel request due to logging out');
      return Promise.reject(error);
    }

    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;

    if (res.code !== 200) {
      // access token 过期
      if (res.code === 401 && !response.config.url?.includes('/auth/refresh')) {
        const originalRequest = response.config;

        if (isRefreshing) {
          // 如果正在刷新token，将请求加入队列
          return new Promise((resolve, reject) => {
            waitingQueue.push({
              resolve,
              reject,
              config: originalRequest,
            });
          });
        }

        isRefreshing = true;

        // 尝试刷新token
        return new Promise((resolve, reject) => {
          refreshToken()
            .then((newToken) => {
              // 更新原始请求的 Authorization header
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }

              // 执行原始请求
              resolve(axios(originalRequest));

              // 处理队列中的请求
              waitingQueue.forEach(({ resolve: queuedResolve, config }) => {
                if (config.headers) {
                  config.headers.Authorization = `Bearer ${newToken}`;
                }
                queuedResolve(axios(config));
              });
              waitingQueue = [];
            })
            .catch((error) => {
              // 如果刷新token失败
              waitingQueue.forEach(({ reject: queuedReject }) => {
                queuedReject(error);
              });
              waitingQueue = [];
              showLogoutModal();
              reject(error);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      // 其他错误处理
      if (!response.config.url?.includes('/auth/logout')) {
        Message.error({
          content: res.message || 'Error',
          duration: 5 * 1000,
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    // 如果不是因为登出导致的请求取消，才显示错误消息
    if (!isLoggingOut) {
      Message.error({
        content:
          error.response?.data?.message || error.message || 'Request Error',
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
