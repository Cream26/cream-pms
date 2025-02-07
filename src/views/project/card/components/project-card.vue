<template>
  <a-card :title="project.name" class="project-card" @click="goProDetail">
    <template #extra>
      <a-button type="text" @click.stop="handleEdit()">
        <template #icon>
          <icon-edit />
        </template>
      </a-button>
    </template>
    <a-space direction="vertical" fill>
      <a-row>
        <a-col :span="7">项目 PM:</a-col>
        <a-col :span="5">
          <UserTag
            :id="project.projectPMInfo?.id"
            :name="project.projectPMInfo?.name"
          ></UserTag>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="7">所属部门：</a-col>
        <a-col :span="7">
          {{ project.departInfo?.name }}
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="7">项目待办:</a-col>
        <a-col :span="5">{{ project.taskList?.length || 0 }}</a-col>
        <a-col :span="7">需求总量:</a-col>
        <a-col :span="5">{{ project.taskList?.length || 0 }}</a-col>
      </a-row>

      <a-row>
        <a-col :span="7">前端负责人:</a-col>
        <a-col :span="5">{{ project.frontendLeadInfo?.name }}</a-col>
        <a-col :span="7">后端负责人:</a-col>
        <a-col :span="5">{{ project.backendLeadInfo?.name }}</a-col>
      </a-row>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
  import router from '@/router';
  import { ProjectDetail } from '@/type/project';

  const props = defineProps<{
    project: ProjectDetail;
  }>();
  const emit = defineEmits(['edit']);
  const handleEdit = () => {
    emit('edit');
  };
  function goProDetail() {
    router.push({
      name: 'projectDetail',
      params: {
        id: props.project.id,
      },
    });
  }
</script>

<style lang="less" scoped>
  .project-card {
    &:hover {
      box-shadow: inset 0 0 0px 1px rgb(var(--primary-6));
    }
    cursor: pointer;
    :deep(.arco-card-header) {
      border: none;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
