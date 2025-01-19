<template>
  <div>
    <a-form label-align="left" :model="filterForm" layout="inline">
      <!-- <a-form-item label="类型:">
        <a-radio-group v-model="filterForm.type" type="button">
          <a-radio value="done">已完成</a-radio>
          <a-radio value="unDone">未完成</a-radio>
        </a-radio-group>
      </a-form-item> -->
      <a-form-item v-if="type === 'done'" label="时间:">
        <a-range-picker
          v-model="filterForm.date"
          value-format="timestamp"
          shortcuts-position="left"
          :shortcuts="shortcuts"
        />
      </a-form-item>
      <a-form-item label="成员:">
        <User-select
          v-model="filterForm.userList"
          multiple
          style="width: 400px"
        >
        </User-select>
      </a-form-item>
    </a-form>
    <Chart
      style="width: 100%; height: 400px; margin-top: 20px"
      :option="chartOption"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, reactive, onBeforeMount, watch } from 'vue';
  import useChartOption from '@/hooks/chart-option';
  import { EChartsOption } from 'echarts';
  import dayjs from 'dayjs';
  import { getMemberMap } from '@/api/member';
  import { getDoneTaskAnalysis } from '@/api/taskInfo';
  import { ToolTipFormatterParams } from '@/types/echarts';

  const props = withDefaults(
    defineProps<{
      type?: 'done' | 'unDone';
    }>(),
    {
      type: 'done',
    }
  );
  const shortcuts = [
    {
      label: '今天',
      value: () =>
        [
          dayjs(dayjs().format('YYYY-MM-DD 00:00:00')),
          dayjs(dayjs().format('YYYY-MM-DD 24:00:00')),
        ] as any,
    },
    {
      label: '本周',
      value: () =>
        [
          dayjs(
            dayjs()
              .subtract(+dayjs().format('d') || 7, 'day')
              .format('YYYY-MM-DD 00:00:00')
          ),
          dayjs(dayjs().add(7 - (+dayjs().format('d') || 7), 'day')).format(
            'YYYY-MM-DD 24:00:00'
          ),
        ] as any,
    },
  ];

  // const props = defineProps<{}>();

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
      ${(Number(el.value) || 0).toLocaleString()}
    </span>
  </div>`
      )
      .join('');
  };
  const filterForm = reactive<{
    date: number[];
    userList: string[];
    type: 'done' | 'unDone';
  }>({
    date: [],
    userList: [],
    type: 'done',
  });

  const taskXiaolvInfoList = ref<any[]>([]);

  const memberMap = ref<Record<string, any>>({});

  const taskMap = computed(() => {
    const data = taskXiaolvInfoList.value.reduce((map, item) => {
      if (!map[item.implementer]) {
        map[item.implementer] = {
          all: item.time,
          // eslint-disable-next-line no-underscore-dangle
          [item.projectInfo._id]: item.time,
        };
      } else {
        const old = map[item.implementer];
        map[item.implementer] = Object.assign(old, {
          all: old.all + item.time,
          // eslint-disable-next-line no-underscore-dangle
          [item.projectInfo._id]: (old[item.projectInfo._id] || 0) + item.time,
        });
      }
      return map;
    }, {});
    return data;
  });

  const projectList = computed(() => {
    return taskXiaolvInfoList.value.reduce((list, item) => {
      if (
        // eslint-disable-next-line no-underscore-dangle
        !list.some((pro: any) => pro.projectInfo._id === item.projectInfo._id)
      ) {
        list.push({ ...item.taskInfo, projectInfo: item.projectInfo });
      }
      return list;
    }, []);
  });
  console.log(taskMap, projectList);

  async function fetchMemberMap() {
    const map = await getMemberMap();
    memberMap.value = map;
    return map;
  }

  async function fetchXiaolvData() {
    const { data } = await getDoneTaskAnalysis({
      type: props.type,
      memberList: filterForm.userList,
      startTime: +dayjs(
        dayjs(filterForm.date[0]).format('YYYY-MM-DD 00:00:00')
      ),
      endTime: +dayjs(dayjs(filterForm.date[1]).format('YYYY-MM-DD 24:00:00')),
    });
    taskXiaolvInfoList.value = data;
  }

  watch(filterForm, (val) => {
    if (val.userList.length) {
      if (val.date[0]) {
        fetchXiaolvData();
      } else if (props.type === 'unDone') {
        fetchXiaolvData();
      }
    }
  });

  // const implementerList = computed<any[]>(() => {
  //   return props.taskInfoList.reduce(
  //     ({ list, map }, item) => {
  //       const { implementerInfo } = item;
  //       if (!map[implementerInfo.id]) {
  //         map[implementerInfo.id] = implementerInfo;
  //         list.push(implementerInfo);
  //       }
  //       return { list, map };
  //     },
  //     { list: [], map: {} }
  //   ).list;
  // });

  // const implementerInfoSum = computed<Record<string, number>>(() => {
  //   return props.taskInfoList.reduce((map, item) => {
  //     const { implementerInfo } = item;
  //     if (!map[implementerInfo.id]) {
  //       map[implementerInfo.id] = item.time;
  //     } else {
  //       map[implementerInfo.id] += item.time;
  //     }
  //     return map;
  //   }, {});
  // });
  const colorList = [
    '#4A7FF7',
    '#00B2FF',
    '#81E2FF',
    '#7bc616',
    '#165dff',
    '#ff7d00',
  ];

  const { chartOption } = useChartOption((isDark) => {
    return {
      // tooltip: {
      //   trigger: 'axis',
      //   axisPointer: {
      //     type: 'shadow',
      //   },
      // },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      grid: {
        left: '40',
        right: 20,
        top: '60',
        bottom: '60',
      },
      legend: {
        bottom: 0,
        textStyle: {
          color: '#4E5969',
        },
        icon: 'circle',
        data: [
          '全部',
          ...projectList.value.map((task: any) => {
            return task.projectInfo.name;
          }),
        ],
      },
      toolbox: {
        show: true,
        right: '20',
        top: '0',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['stack'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          data: filterForm.userList.map((item) => {
            return memberMap.value[item].name;
          }),
          axisLine: {
            lineStyle: {
              color: isDark ? '#3f3f3f' : '#A9AEB8',
            },
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
              color: '#86909C',
            },
          },
          axisLabel: {
            color: '#86909C',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          color: '#86909C',
          axisLabel: {
            show: 'true',
            formatter(value: any) {
              return `${value}H`;
            },
          },
          splitLine: {
            lineStyle: {
              color: isDark ? '#3F3F3F' : '#E5E6EB',
            },
          },
          // axisPointer: {
          //   show: true,
          //   snap: true,
          //   label: {
          //     show: true,
          //     // formatter({ value }: any) {
          //     //   // 假设此轴的 type 为 'time'。
          //     //   return today.add(value / 8, 'day').format('YYYY-MM-DD hh:mm');
          //     // },
          //   },
          // },
        },
      ],
      series: [
        // {
        //   name: '全部',
        //   type: 'bar',
        //   barGap: 0,
        //   // label: labelOption,
        //   emphasis: {
        //     focus: 'series',
        //   },
        //   data: filterForm.userList.map((id) => {
        //     const taskUserMap = taskMap.value[id] || {};
        //     // eslint-disable-next-line no-underscore-dangle
        //     return taskUserMap.all || '-';
        //   }),
        //   label: {
        //     show: true,
        //     position: 'inside',
        //     formatter: '{c}H',
        //   },
        // },
        ...projectList.value.map((task: any, index: number) => {
          return {
            // barWidth: 16,
            // eslint-disable-next-line no-underscore-dangle
            name: task.projectInfo.name,
            type: 'bar',
            // stack: 'task',
            // label: labelOption,
            barMaxWidth: 80,
            emphasis: {
              focus: 'series',
            },
            label: {
              show: true,
              position: 'inside',
              formatter(data: any) {
                return `${task.projectInfo.name}:${data.value}h`;
              },
            },
            itemStyle: {
              color: colorList[index],
              borderRadius: 2,
            },
            // data: [220, 182, 191, 234, 290],
            data: filterForm.userList.map((id) => {
              const taskUserMap = taskMap.value[id] || {};
              // eslint-disable-next-line no-underscore-dangle
              return taskUserMap[task.projectInfo._id] || '-';
            }),
          };
        }),
        // {
        //   name: 'Steppe',
        //   type: 'bar',
        //   // label: labelOption,
        //   emphasis: {
        //     focus: 'series',
        //   },
        //   data: [220, 182, 191, 234, 290],
        // },
        // {
        //   name: 'Desert',
        //   type: 'bar',
        //   // label: labelOption,
        //   emphasis: {
        //     focus: 'series',
        //   },
        //   data: [150, 232, 201, 154, 190],
        // },
        // {
        //   name: 'Wetland',
        //   type: 'bar',
        //   // label: labelOption,
        //   emphasis: {
        //     focus: 'series',
        //   },
        //   data: [98, 77, 101, 99, 40],
        // },
      ],
    } as EChartsOption;
  });

  // function goTaskDetail() {
  //   router.push({
  //     name: 'taskDetail',
  //     params: {
  //       id: props.taskId,
  //     },
  //   });
  // }
  onBeforeMount(() => {
    fetchMemberMap();
  });
</script>

<style lang="less" scoped></style>
