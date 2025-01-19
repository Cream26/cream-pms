<template>
  <div class="container">
    <Breadcrumb :items="['项目管理', '项目概览']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" title="项目概览">
          <template #extra>
            <a-button type="primary" @click="projectModalVisible = true">
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
                  <!-- <QualityInspection />
                  <TheService />
                  <RulesPreset /> -->
                  <CardLayout>
                    <projectCard
                      v-for="item in list"
                      :key="item.id"
                      :project="item"
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
            <a-input-search
              placeholder="请输入"
              style="width: 240px; position: absolute; top: 60px; right: 20px"
            />
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <ProjectFormModal
    v-model:visible="projectModalVisible"
    :form="projectForm"
    @confirm="sendCreateModal"
  ></ProjectFormModal>
</template>

<script lang="ts" setup>
  import ProjectFormModal from '@/components/project-form-modal/index.vue';

  import projectCard from './components/project-card.vue';
  import CardLayout from './components/card-layout.vue';
  import {
    createProject,
    getProjectPageList,
    updateProjectById,
  } from '@/api/project';
  import { ref, onBeforeMount, reactive, computed } from 'vue';
  import { useUserStore } from '@/store';

  const list = ref<any[]>([]);
  const projectForm = reactive({
    id: '',
    name: '',
    pmUser: '',
    feUser: '',
    beUser: '',
    envLink: '',
  });

  const userStore = useUserStore();
  const projectModalVisible = ref(false);

  async function fetchProjectList() {
    const { data } = await getProjectPageList();
    list.value = data.list;
  }

  const listMap = computed<any>(() => {
    const owner: any[] = [];
    const dev: any[] = [];
    const other: any[] = [];
    list.value.forEach((item) => {
      const { taskList } = item;
      const ownerPro = [item.pmUser, item.feUser, item.beUser].includes(
        userStore.id
      );
      const devPro = taskList.some((task: any) =>
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

  async function sendCreateModal(form: any) {
    if (form.id) {
      await updateProjectById(form.id, {
        ...form,
      });
    } else {
      await createProject({
        ...form,
      });
    }
    fetchProjectList();
  }

  onBeforeMount(() => {
    fetchProjectList();
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
