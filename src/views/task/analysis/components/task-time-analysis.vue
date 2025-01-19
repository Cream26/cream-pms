<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '14px' }">
      <template #title> 需求人天分析 </template>
      <template #extra>
        <a-link @click="goTaskDetail">{{ $t('workplace.viewMore') }}</a-link>
      </template>
      <Chart style="width: 100%; height: 347px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useLoading from '@/hooks/loading';
  import {
    queryContentPublish,
    ContentPublishRecord,
  } from '@/api/visualization';
  import useChartOption from '@/hooks/chart-option';
  import { EChartsOption } from 'echarts';
  import dayjs, { Dayjs } from 'dayjs';
  import WorkDay from 'chinese-workday';
  import router from '@/router';

  (window as any).dayjs = dayjs;
  // (window as any).ww = WorkDay;

  const props = defineProps<{
    taskInfoList: any[];
    taskId: string;
    taskDetail: Record<string, any>;
  }>();

  const implementerList = computed<any[]>(() => {
    return props.taskInfoList.reduce(
      ({ list, map }, item) => {
        const { implementerInfo } = item;
        if (!map[implementerInfo.id]) {
          map[implementerInfo.id] = implementerInfo;
          list.push(implementerInfo);
        }
        return { list, map };
      },
      { list: [], map: {} }
    ).list;
  });

  const implementerMap = computed<any[]>(() => {
    return props.taskInfoList.reduce(
      ({ list, map }, item) => {
        const { implementerInfo } = item;
        if (!map[implementerInfo.id]) {
          map[implementerInfo.id] = implementerInfo;
          list.push(implementerInfo);
        }
        return { list, map };
      },
      { list: [], map: {} }
    ).map;
  });

  const developerMap = computed(() => {
    return props.taskDetail.developerMap || {};
  });

  function calcWorkday(start: number | Date, day: number) {
    //
    let sum = 0;
    let workDayCount = 0;
    for (let i = +start; workDayCount < day; i += 1000 * 60 * 60 * 24) {
      if (!(WorkDay as any).isWorkday(dayjs(i))) {
        sum += 1;
      } else {
        workDayCount += 1;
      }
    }
    return sum;
  }
  const implementerInfoSum = computed<Record<string, number>>(() => {
    return props.taskInfoList.reduce((map, item) => {
      const { implementerInfo } = item;
      if (!map[implementerInfo.id]) {
        map[implementerInfo.id] = item.time;
      } else {
        map[implementerInfo.id] += item.time;
      }

      return map;
    }, {});
  });

  const implementerInfoSumDay = computed<Record<string, number>>(() => {
    return Object.keys(implementerInfoSum.value).reduce<Record<string, number>>(
      (map, key) => {
        map[key] = implementerInfoSum.value[key] / 8;
        return map;
      },
      {}
    );
  });

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
    <p>
      <span style="background-color: ${
        el.color
      }" class="tooltip-item-icon"></span>
      <span>
      ${el.seriesName}
      </span>
    </p>
    <span class="tooltip-value">
      ${Number(el.value).toLocaleString()}
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
  // const today = dayjs(dayjs().format('YYYY-MM-DD 00:00:00'));

  const today = computed(() => {
    const startTime = Object.keys(developerMap.value).reduce((min, key) => {
      const item = developerMap.value[key];
      return Math.min(item.startDate, min);
    }, +dayjs(dayjs().format('YYYY-MM-DD 00:00:00')));
    return dayjs(startTime);
  });
  const todayString = today.value.format('YYYY-MM-DD HH:mm:ss');
  console.log('todayString', todayString);

  // const developerMap = computed(() => {
  //   return props.taskDetail.developerMap || {};
  // });
  const { chartOption } = useChartOption((isDark) => {
    return {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
          axis: 'y',
        },
        formatter(params: any[]) {
          const data = params[0] || params;
          console.log(data);
          if (data.seriesName === 'Placeholder') {
            return '';
          }
          const startDate = developerMap.value[data.seriesName]
            ? dayjs(developerMap.value[data.seriesName].startDate).format(
                'YYYY-MM-DD HH:mm'
              )
            : '-';
          const inputRatio = developerMap.value[data.seriesName]
            ? `${developerMap.value[data.seriesName].inputRatio}%`
            : '100%';
          return `
          总工时：${implementerInfoSum.value[data.seriesName]}h<br/>
          执行人：${data.name}<br/>
          投入比例${inputRatio}<br/>
          开始时间：${startDate}<br/>
          `;
          // 完成时间：${today
          //   .add((data.axisValue + data.data) / 8, 'day')
          //   .format('YYYY-MM-DD')}
        },
      },
      legend: {
        data: implementerList.value.map((item: any) => item.id),
        formatter(id: any) {
          return `${implementerMap.value[id]?.name || '-'}`;
        },
      },
      grid: {
        left: '20',
        right: '40',
        bottom: '10', // 60
        containLabel: true,
      },
      yAxis: {
        type: 'category',
        data: implementerList.value.map((item: any) => item.name),
        axisTick: {
          alignWithLabel: true,
        },
      },
      // dataZoom: [
      //   {
      //     show: true,
      //     height: 20,
      //     // zoomLock: true,
      //     filterMode: 'none',
      //   },
      // ],

      xAxis: {
        type: 'value',
        min: 0,
        minInterval: 8,
        interval: 8,
        axisLabel: {
          formatter(value: any) {
            return (
              today.value
                .add(value / 8, 'day')
                // .subtract(3, 'day')
                .format('YY-MM-DD')
            );
          },
          // rotate: -60,
        },
        axisPointer: {
          show: true,
          label: {
            show: true,
            formatter({ value }: any) {
              // 假设此轴的 type 为 'time'。
              return today.value
                .add(value / 8, 'day')
                .format('YYYY-MM-DD hh:mm');
            },
          },
        },
        // maxInterval: 8,
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
          // data: [8, 16, 24],
          data: implementerList.value.map((item) => {
            const devMap = props.taskDetail.developerMap || {};
            if (devMap[item.id]) {
              const { startDate } = devMap[item.id];
              return ((startDate - +today.value) / (1000 * 60 * 60 * 24)) * 8;
            }
            return 0;

            // return dayjs();
          }),
        },
        ...implementerList.value.map((user: any, index) => {
          // value: implementerInfoSum.value[item.id]
          const data = implementerList.value.map((item, i) => {
            if (index === i) {
              const startDay = developerMap.value[item.id]?.startDate || today;
              const inputRatio = developerMap.value[item.id]?.inputRatio || 100;
              debugger;
              const noWorkDaySum = calcWorkday(
                startDay,
                implementerInfoSum.value[item.id] / 8 / (inputRatio / 100)
              );
              return (
                implementerInfoSum.value[item.id] / (inputRatio / 100) +
                noWorkDaySum * 8
              );
            }
            return '-';
          });
          return {
            name: user.id,
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              position: 'top',
            },
            labelLine: {
              show: true,
            },
            data,
          };
        }),
        // {
        //   name: 'bxw',
        //   type: 'bar',
        //   stack: 'Total',
        //   label: {
        //     show: true,
        //     position: 'top',
        //   },
        //   data: [80],
        // },
        // {
        //   name: 'xs',
        //   type: 'bar',
        //   stack: 'Total',
        //   label: {
        //     show: true,
        //     position: 'bottom',
        //   },
        //   data: ['-', 40],
        // },
        // {
        //   name: 'pzy',
        //   type: 'bar',
        //   stack: 'Total',
        //   label: {
        //     show: true,
        //     position: 'bottom',
        //   },
        //   data: ['-', '-', 56],
        // },
      ],
    } as EChartsOption;
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryContentPublish();
      xAxis.value = chartData[0].x;
      chartData.forEach((el: ContentPublishRecord) => {
        if (el.name === '纯文本') {
          textChartsData.value = el.y;
        } else if (el.name === '图文类') {
          imgChartsData.value = el.y;
        }
        videoChartsData.value = el.y;
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  function goTaskDetail() {
    router.push({
      name: 'taskDetail',
      params: {
        id: props.taskId,
      },
    });
  }
  fetchData();
</script>

<style scoped lang="less"></style>
