<template>
  <div class="container">
    <Breadcrumb :items="['项目管理', '项目概览']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" title="项目概览">
          <template #extra>
            <a-button type="primary" @click="showModel()">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
          </template>
          <a-row justify="space-between">
            <a-col :span="24">
              <a-tabs :default-active-tab="1" type="rounded">
                <a-tab-pane key="1" title="全部">
                  <CardLayout>
                    <projectCard
                      v-for="item in list"
                      :key="item.id"
                      :project="item"
                      @edit="handleEdit(item)"
                    />
                  </CardLayout>
                </a-tab-pane>
                <a-tab-pane key="2" title="我负责的">
                  <CardLayout>
                    <projectCard
                      v-for="item in listMap.owner"
                      :key="item.id"
                      :project="item"
                    />
                  </CardLayout>
                </a-tab-pane>
                <a-tab-pane key="3" title="我开发的">
                  <CardLayout>
                    <projectCard
                      v-for="item in listMap.dev"
                      :key="item.id"
                      :project="item"
                    />
                  </CardLayout>
                </a-tab-pane>
                <a-tab-pane key="4" title="其他">
                  <CardLayout>
                    <projectCard
                      v-for="item in listMap.other"
                      :key="item.id"
                      :project="item"
                    />
                  </CardLayout>
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import useModelFrom from '@/utils/form';
  import { Project, ProjectDetail } from '@/type/project';

  import projectCard from './components/project-card.vue';
  import CardLayout from './components/card-layout.vue';
  import {
    createProject,
    getAllProject,
    updateProjectById,
  } from '@/api/project';
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';

  const list = ref<ProjectDetail[]>([]);

  const userStore = useUserStore();

  const listMap = computed<any>(() => {
    const owner: any[] = [];
    const dev: any[] = [];
    const other: any[] = [];
    list.value.forEach((item) => {
      const { taskList } = item;
      const ownerPro = [
        item.projectPMId,
        item.frontendLeadId,
        item.backendLeadId,
      ].includes(userStore.id as string);
      const devPro = taskList?.some((task: any) =>
        task.feUserList?.includes(userStore.id)
      );
      if (ownerPro) {
        owner.push(item);
      }
      if (devPro) {
        dev.push(item);
      }
      if (!ownerPro && !devPro) {
        other.push(item);
      }
    });
    return {
      owner,
      dev,
      other,
    };
  });
  const fetchProjectList = async () => {
    const res = await getAllProject();
    list.value = res.data;
  };

  // 弹框显示
  const showModel = (project?: ProjectDetail) => {
    const formData = reactive<Project>({
      name: project?.name || '',
      departId: project?.departId || '',
      projectPMId: project?.projectPMId || '',
      frontendLeadId: project?.frontendLeadId || '',
      backendLeadId: project?.backendLeadId || '',
      env: project?.env || '',
    });
    const title = project ? '编辑项目' : '新建项目';
    return useModelFrom({
      title,
      modelValue: formData,
      fields: [
        {
          label: '项目名称',
          prop: 'name',
          rules: [{ required: true, message: '请输入项目名称' }],
        },
        {
          label: '所属部门',
          prop: 'departId',
          type: 'departSelect',
          rules: [{ required: true, message: '请选择所属部门' }],
        },
        {
          label: '项目PM',
          prop: 'projectPMId',
          type: 'userSelect',
          rules: [{ required: true, message: '请选择项目PM' }],
        },
        {
          label: '前端负责人',
          prop: 'frontendLeadId',
          type: 'userSelect',
          rules: [{ required: true, message: '请选择前端负责人' }],
        },
        {
          label: '后端负责人',
          prop: 'backendLeadId',
          type: 'userSelect',
          rules: [{ required: true, message: '请选择后端负责人' }],
        },
        {
          label: '项目环境配置',
          prop: 'env',
          type: 'input',
          rules: [{ required: false, message: '请输入环境' }],
        },
      ],
      onBeforeValidateOk: async (done, modelValue) => {
        try {
          if (project?.id) {
            await updateProjectById(project.id, modelValue as Project);
            Message.success('编辑项目成功');
          } else {
            await createProject(modelValue as Project);
            Message.success('创建项目成功');
          }
          done(true);
          await fetchProjectList();
        } catch (error: any) {
          Message.error(error.message);
          done(false);
        }
      },
    });
  };
  const handleEdit = (item: ProjectDetail) => {
    showModel(item);
  };
  onMounted(async () => {
    await fetchProjectList();
  });
</script>

<script lang="ts">
  export default {
    name: 'Card',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    :deep(.arco-list-content) {
      overflow-x: hidden;
    }

    :deep(.arco-card-meta-title) {
      font-size: 14px;
    }
  }
  :deep(.arco-list-col) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  :deep(.arco-list-item) {
    width: 33%;
  }

  :deep(.block-title) {
    margin: 0 0 12px 0;
    font-size: 14px;
  }
  :deep(.list-wrap) {
    // min-height: 140px;
    .list-row {
      align-items: stretch;
      .list-col {
        margin-bottom: 16px;
      }
    }
    :deep(.arco-space) {
      width: 100%;
      .arco-space-item {
        &:last-child {
          flex: 1;
        }
      }
    }
  }
</style>
