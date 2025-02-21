<!-- eslint-disable no-underscore-dangle -->
<template>
  <div class="container">
    <Breadcrumb
      :items="[
        { label: `${projectDetail?.name}`, click: goProject },
        `${taskDetail?.taskName}`,
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
      </a-space>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import PublicOpinion from './components/public-opinion.vue';
  import TaskTimeAnalysis from './components/task-time-analysis.vue';
  import PopularAuthor from './components/popular-author.vue';
  import { ref, watch, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { getProjectById } from '@/api/project';
  import router from '@/router';
  import { getTaskInfoById } from '@/api/task';
  import { getTaskDetailList } from '@/api/task_info';

  const route = useRoute();
  const taskDetail = ref<any>({});
  const taskId = route.params.id.toString();
  const taskInfoList = ref<any[]>([]);
  const projectDetail = ref<any>({});

  // 获取任务信息
  const fetchTaskInfo = async () => {
    const { data } = await getTaskInfoById(taskId);
    taskDetail.value = data;
  };
  // 获取任务明细列表
  const fetchTaskDetailList = async () => {
    const { data } = await getTaskDetailList(taskId);
    taskInfoList.value = data;
  };

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

  onMounted(() => {
    fetchTaskInfo();
    fetchTaskDetailList();
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
