<template>
  <a-card class="general-card" title="我的任务">
    <template #extra>
      <a-link>查看全部</a-link>
    </template>
    <a-list :bordered="false">
      <a-list-item
        v-for="task in taskList"
        :key="task.id"
        action-layout="horizontal"
      >
        <template #actions>
          <a-button type="text" @click="goTaskDetail(task._id)">查看</a-button>
        </template>
        <a-skeleton
          v-if="loading"
          :loading="loading"
          :animation="true"
          class="skeleton-item"
        >
          <a-row :gutter="6">
            <a-col :span="2">
              <a-skeleton-shape shape="circle" />
            </a-col>
            <a-col :span="22">
              <a-skeleton-line :widths="['40%', '100%']" :rows="2" />
            </a-col>
          </a-row>
        </a-skeleton>
        <a-list-item-meta v-else :title="task.name" :description="task.jira">
          <template #avatar>
            <a-avatar> {{ task.projectInfo.name }} </a-avatar>
          </template>
          <template #description>
            <div class="list-item-right">
              <a-space fill direction="vertical" size="mini">
                <a-space fill>
                  <span :span="1">
                    项目PM:
                    <UserTag
                      :id="task.projectInfo.pmMember?.id"
                      :name="task.projectInfo.pmMember?.name"
                    />
                  </span>
                  <span> 期望完成时间: {{ task.expectDate }} </span>
                </a-space>
                <a-space fill>
                  <span :span="1">prd: </span>
                  <span :span="20">
                    <a-link icon target="_blank" :href="task.prd">
                      {{ task.prd }}
                    </a-link>
                  </span>
                </a-space>
                <a-space fill>
                  <span :span="1">jira: </span>
                  <span :span="20">
                    <a-link icon target="_blank" :href="task.jira">
                      {{ task.jira }}
                    </a-link>
                  </span>
                </a-space>
              </a-space>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { queryLatestActivity, LatestActivity } from '@/api/user-center';
  import useLoading from '@/hooks/loading';
  import { getByDevId } from '@/api/task';
  import { useUserStore } from '@/store';
  import router from '@/router';

  const userStore = useUserStore();

  const { loading, setLoading } = useLoading(true);
  const taskList = ref<any[]>(new Array(7).fill({}));
  const fetchData = async () => {
    try {
      const { data } = await getByDevId((userStore as any).id);
      taskList.value = data.list;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  function goTaskDetail(taskId: string) {
    router.push({
      name: 'taskDetail',
      params: {
        id: taskId,
      },
    });
  }
</script>

<style scoped lang="less">
  .latest-activity {
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .list-item-right {
    flex: 1;
    width: 100%;
    overflow-x: hidden;
  }
  .general-card :deep(.arco-list-item) {
    padding-left: 0;
    border-bottom: none;
    .arco-list-item-meta-content {
      flex: 1;
      padding-bottom: 27px;
      border-bottom: 1px solid var(--color-neutral-3);
    }
    .arco-list-item-meta-avatar {
      padding-bottom: 27px;
    }
    .skeleton-item {
      margin-top: 10px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--color-neutral-3);
    }
  }
</style>

<style lang="less">
  .arco-list-item-main {
    width: 0;
    overflow: hidden;
  }
  .arco-list-item-action {
    flex-shrink: 0;
  }
</style>
