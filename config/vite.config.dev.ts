import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        // strict: true,
      },
      host: '0.0.0.0',
      proxy: {
        '/pms': {
          // target: 'https://neeko-design.com', // 接口基地址
          // target: 'http://127.0.0.1:7007',
          target: 'http://127.0.0.1:7001',
          // target: 'http://43.137.9.6:7007',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '/api'),
          // rewrite: (path) => {
          // console.log(path); // 打印[/api/userInfo] 这就是http-proxy要请求的url,我们基地址实际是没有/api 所以replace掉
          // return path.replace(/^\/api/, '');
          // },
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
