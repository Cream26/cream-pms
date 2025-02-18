<!-- eslint-disable no-underscore-dangle -->
<template>
  <div class="container">
    <Breadcrumb
      :items="[
        { label: `${projectDetail.name}`, click: goProject },
        taskDetail?.name || '',
      ]"
    />
    <a-space direction="vertical" :size="12" fill>
      <a-space direction="vertical" :size="16" fill>
        <div class="space-unit">
          <PublicOpinion />
        </div>
        <div>
          <a-grid :cols="24" :col-gap="16" :row-gap="16">
            <a-grid-item
              :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 16, xxl: 16 }"
            >
              <TaskTimeAnalysis
                :task-id="taskId"
                :task-info-list="taskInfoList"
                :task-detail="taskDetail"
              />
            </a-grid-item>
            <a-grid-item
              :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 8 }"
            >
              <PopularAuthor :task-id="taskId" :task-info-list="taskInfoList" />
            </a-grid-item>
          </a-grid>
        </div>
        <div>
          <!-- <ContentPeriodAnalysis /> -->
        </div>
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import PublicOpinion from './components/public-opinion.vue';
  import ContentPeriodAnalysis from './components/content-period-analysis.vue';
  import TaskTimeAnalysis from './components/task-time-analysis.vue';
  import PopularAuthor from './components/popular-author.vue';
  import { ref, onBeforeMount, watch } from 'vue';
  import { getTaskInfoByTaskId } from '@/api/task_info';
  import { useUserStore } from '@/store';
  import { useRoute } from 'vue-router';
  import { getTaskById } from '@/api/task';
  import { getProjectById } from '@/api/project';
  import router from '@/router';

  const route = useRoute();
  const taskDetail = ref<any>({});
  const userStore = useUserStore();
  const taskId = route.params.id.toString();
  const taskInfoList = ref<any[]>([]);

  async function fetchTaskInfoList() {
    const { data } = await getTaskInfoByTaskId(taskId);
    taskInfoList.value = data;
  }
  async function fetchTaskDetail() {
    const { data } = await getTaskById(taskId);
    taskDetail.value = data;
  }
  const projectDetail = ref<any>({});

  function goProject() {
    router.push({
      name: 'projectDetail',
      params: {
        // eslint-disable-next-line no-underscore-dangle
        id: projectDetail.value._id,
      },
    });
  }
  watch(taskDetail, async (val) => {
    if (val?.projectId) {
      const { data } = await getProjectById(val?.projectId);
      projectDetail.value = data;
    }
  });

  onBeforeMount(() => {
    fetchTaskInfoList();
    fetchTaskDetail();
  });
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
