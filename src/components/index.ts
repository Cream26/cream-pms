import { App } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
} from 'echarts/components';
import Chart from './chart/index.vue';
import Breadcrumb from './breadcrumb/index.vue';
import UserTag from '@/components/user-tag/index.vue';
import UserSelect from '@/components/user-select/index.vue';

import { Calendar, ConfigProvider } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// Manually introduce ECharts modules to reduce packing size

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
]);

export default {
  install(Vue: App) {
    Vue.component('Chart', Chart);
    Vue.component('Breadcrumb', Breadcrumb);
    Vue.component('UserTag', UserTag);
    Vue.component('AntCalendar', Calendar);
    Vue.component('AntConfigProvider', ConfigProvider);
    Vue.component('UserSelect', UserSelect);
  },
};
