<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '14px' }">
      <template #title> 任务分布 </template>
      <template #extra>
        <a-link @click="goTaskDetail">{{ $t('workplace.viewMore') }}</a-link>
      </template>
      <Chart style="width: 100%; height: 347px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryPopularAuthor, PopularAuthorRes } from '@/api/visualization';
  import useChartOption from '@/hooks/chart-option';
  import router from '@/router';
  import { EChartsOption } from 'echarts';

  const props = defineProps<{
    taskInfoList: any[];
    taskId: string;
  }>();
  const { loading, setLoading } = useLoading();
  const tableData = ref<PopularAuthorRes>({ list: [] });
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await queryPopularAuthor();
      tableData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

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

  fetchData();

  const colorList = [
    '#00b42a',
    '#0fc6c2',
    '#ff7d00',
    '#eb0aa4',
    '#7bc616',
    '#165dff',
  ];
  const { chartOption } = useChartOption((_) => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: implementerList.value.map((item: any) => item.name),
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: 'true',
            formatter(value: any) {
              return `${value / 8}人/天`;
            },
          },
        },
      ],
      series: [
        {
          name: '工时',
          type: 'bar',
          barMaxWidth: '40px',
          data: implementerList.value.map((item, index) => {
            return {
              value: implementerInfoSum.value[item.id],
              itemStyle: {
                color: colorList[index],
              },
            };
          }),
        },
      ],
    } as EChartsOption;
  });

  function goTaskDetail() {
    router.push({
      name: 'taskDetail',
      params: {
        id: props.taskId,
      },
    });
  }
</script>

<style scoped lang="less">
  .general-card {
    max-height: 425px;
  }
</style>
