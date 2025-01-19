<template>
  <div class="container">
    <Breadcrumb :items="['数据分析', '效率统计']" />
    <a-card class="general-card">
      <template #title> 效率统计 </template>
      <XiaolvChart />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onBeforeMount } from 'vue';
  import { getTaskInfoByTaskId } from '@/api/taskInfo';
  import { useUserStore } from '@/store';
  import { useRoute } from 'vue-router';
  import { getTaskById } from '@/api/task';
  import XiaolvChart from '@/components/xiaolv-chart/xiaolv-chart.vue';
</script>

<script lang="ts">
  export default {
    name: 'DataAnalysis',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    margin-bottom: 20px;
  }

  .space-unit {
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  .title-fix {
    margin: 0 0 12px 0;
    font-size: 14;
  }
  :deep(.section-title) {
    margin: 0 0 12px 0;
    font-size: 14px;
  }
</style>
