<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '16px' }">
      <template #title> 需求甘特图 </template>
      <Chart style="width: 100%; height: 370px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryContentPeriodAnalysis } from '@/api/visualization';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useChartOption from '@/hooks/chart-option';
  import { EChartsOption } from 'echarts';

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${el.color}" class="tooltip-item-icon"></span>
          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">
        ${el.value}%
        </span>
      </div>`
      )
      .join('');
  };

  const { loading, setLoading } = useLoading(true);
  const xAxis = ref<string[]>([]);
  const textChartsData = ref<number[]>([]);
  const imgChartsData = ref<number[]>([]);
  const videoChartsData = ref<number[]>([]);
  const { chartOption } = useChartOption((_) => {
    // return {
    //   grid: {
    //     left: '40',
    //     right: 0,
    //     top: '20',
    //     bottom: '100',
    //   },
    //   legend: {
    //     bottom: 0,
    //     icon: 'circle',
    //     textStyle: {
    //       color: '#4E5969',
    //     },
    //   },
    //   xAxis: {
    //     type: 'category',
    //     data: xAxis.value,
    //     boundaryGap: false,
    //     axisLine: {
    //       lineStyle: {
    //         color: isDark ? '#3f3f3f' : '#A9AEB8',
    //       },
    //     },
    //     axisTick: {
    //       show: true,
    //       alignWithLabel: true,
    //       lineStyle: {
    //         color: '#86909C',
    //       },
    //       interval(idx: number) {
    //         if (idx === 0) return false;
    //         if (idx === xAxis.value.length - 1) return false;
    //         return true;
    //       },
    //     },
    //     axisLabel: {
    //       color: '#86909C',
    //       formatter(value: number, idx: number) {
    //         if (idx === 0) return '';
    //         if (idx === xAxis.value.length - 1) return '';
    //         return `${value}`;
    //       },
    //     },
    //   },
    //   yAxis: {
    //     type: 'value',
    //     axisLabel: {
    //       color: '#86909C',
    //       formatter: '{value}%',
    //     },
    //     splitLine: {
    //       lineStyle: {
    //         color: isDark ? '#3F3F3F' : '#E5E6EB',
    //       },
    //     },
    //   },
    //   tooltip: {
    //     show: true,
    //     trigger: 'axis',
    //     formatter(params) {
    //       const [firstElement] = params as ToolTipFormatterParams[];
    //       return `<div>
    //         <p class="tooltip-title">${firstElement.axisValueLabel}</p>
    //         ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
    //       </div>`;
    //     },
    //     className: 'echarts-tooltip-diy',
    //   },
    //   series: [
    //     {
    //       name: '纯文本',
    //       data: textChartsData.value,
    //       type: 'bar',
    //       smooth: true,
    //       showSymbol: false,
    //       color: isDark ? '#3D72F6' : '#246EFF',
    //       symbol: 'circle',
    //       symbolSize: 10,
    //       emphasis: {
    //         focus: 'series',
    //         itemStyle: {
    //           borderWidth: 2,
    //           borderColor: '#E0E3FF',
    //         },
    //       },
    //     },
    //     {
    //       name: '图文类',
    //       data: imgChartsData.value,
    //       type: 'bar',
    //       smooth: true,
    //       showSymbol: false,
    //       color: isDark ? '#A079DC' : '#00B2FF',
    //       symbol: 'circle',
    //       symbolSize: 10,
    //       emphasis: {
    //         focus: 'series',
    //         itemStyle: {
    //           borderWidth: 2,
    //           borderColor: '#E2F2FF',
    //         },
    //       },
    //     },
    //     {
    //       name: '视频类',
    //       data: videoChartsData.value,
    //       type: 'line',
    //       smooth: true,
    //       showSymbol: false,
    //       color: isDark ? '#6CAAF5' : '#81E2FF',
    //       symbol: 'circle',
    //       symbolSize: 10,
    //       emphasis: {
    //         focus: 'series',
    //         itemStyle: {
    //           borderWidth: 2,
    //           borderColor: '#D9F6FF',
    //         },
    //       },
    //     },
    //   ],
    //   dataZoom: [
    //     {
    //       bottom: 40,
    //       type: 'slider',
    //       left: 40,
    //       right: 14,
    //       height: 14,
    //       borderColor: 'transparent',
    //       handleIcon:
    //         'image://http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/1ee5a8c6142b2bcf47d2a9f084096447.svg~tplv-49unhts6dw-image.image',
    //       handleSize: '20',
    //       handleStyle: {
    //         shadowColor: 'rgba(0, 0, 0, 0.2)',
    //         shadowBlur: 4,
    //       },
    //       brushSelect: false,
    //       backgroundColor: isDark ? '#313132' : '#F2F3F5',
    //     },
    //     {
    //       type: 'inside',
    //       start: 0,
    //       end: 100,
    //       zoomOnMouseWheel: false,
    //     },
    //   ],
    // };
    return {
      title: {
        text: 'Accumulated Waterfall Chart',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params: any[]) {
          let tar: any;
          if (params[1] && params[1].value !== '-') {
            // eslint-disable-next-line prefer-destructuring
            tar = params[1];
          } else {
            // eslint-disable-next-line prefer-destructuring
            tar = params[2];
          }
          return tar && `${tar.name}<br/>${tar.seriesName} : ${tar.value}`;
        },
      },
      legend: {
        data: ['Expenses', 'Income', '潘子彦'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: {
        type: 'category',
        data: ['鲍小旺', '肖帅', '潘子彦'],
        axisTick: {
          alignWithLabel: true,
        },
      },
      xAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          silent: true,
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent',
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent',
            },
          },
          barWidth: 40,
          data: [100, 900, 1245],
        },
        {
          name: '肖帅',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'top',
          },
          data: [100],
        },
        {
          name: '鲍小旺',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'bottom',
          },
          data: ['-', 400],
        },
        {
          name: '潘子彦',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'bottom',
          },
          data: ['-', '-', 400],
        },
      ],
    } as EChartsOption;
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryContentPeriodAnalysis();
      xAxis.value = chartData.xAxis;
      chartData.data.forEach((el) => {
        if (el.name === '纯文本') {
          textChartsData.value = el.value;
        } else if (el.name === '图文类') {
          imgChartsData.value = el.value;
        }
        videoChartsData.value = el.value;
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
</style>
