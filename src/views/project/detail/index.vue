<template>
  <div class="container">
    <Breadcrumb :items="['项目集合', projectDetail?.name || '']" />
    <a-space direction="vertical" fill>
      <a-card class="general-card" title="项目详情">
        <a-divider style="margin-top: 0" />
        <a-space direction="vertical" fill>
          <a-row>
            <a-col :span="2">项目名称: </a-col>
            <a-col :span="8">
              <a-tag color="#ff7d00">
                {{ projectDetail?.name }}
              </a-tag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="2">所属部门： </a-col>
            <a-col :span="8">
              <a-tag v-if="projectDetail?.departInfo" color="#ff9300">
                {{ projectDetail.departInfo.name }}
              </a-tag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="2">项目 PM: </a-col>
            <a-col :span="8">
              <UserTag
                :id="projectDetail?.projectPMInfo?.id"
                :name="projectDetail?.projectPMInfo?.name"
              ></UserTag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="2">前端负责人: </a-col>
            <a-col :span="8">
              <UserTag
                :id="projectDetail?.frontendLeadInfo?.id"
                :name="projectDetail?.frontendLeadInfo?.name"
              >
              </UserTag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="2">后端负责人: </a-col>
            <a-col :span="8">
              <UserTag
                :id="projectDetail?.backendLeadInfo?.id"
                :name="projectDetail?.backendLeadInfo?.name"
              >
              </UserTag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="2">项目环境配置： </a-col>
            <a-col :span="8"> {{ projectDetail?.env }} </a-col>
          </a-row>
        </a-space>
      </a-card>
      <a-card class="general-card" title="代码仓库">
        <template #extra>
          <a-button type="primary" @click="showCodeStoreModal()">添加</a-button>
        </template>
        <a-row class="code-store" :gutter="[24, 12]">
          <a-col
            v-for="store in projectDetail?.codeStoreList || []"
            :key="store.uid"
            :span="8"
            class="code-store-item"
            @click="showCodeStoreModal(store)"
          >
            <a-space direction="vertical" fill>
              <div>仓库名：{{ store.storeName }}</div>
              <div>主分支：{{ store.mainBranch }}</div>
              <div class="flex-v-center">
                仓库地址：
                <a-link
                  v-if="store.storeAddress"
                  class="text-hidden"
                  style="flex: 1; justify-content: flex-start"
                  :href="store.storeAddress"
                  target="_blank"
                  icon
                  @click.stop
                >
                  {{ store.storeAddress }}
                </a-link>
              </div>
              <div class="flex-v-center">
                jenkins 地址：
                <a-link
                  v-if="store.storeAddress"
                  class="text-hidden"
                  style="flex: 1; justify-content: flex-start"
                  :href="store.storeAddress"
                  target="_blank"
                  icon
                  @click.stop
                >
                  {{ store.storeAddress }}
                </a-link>
              </div>
            </a-space>
          </a-col>
        </a-row>
      </a-card>
      <a-card class="general-card" title="任务集合">
        <template #extra>
          <a-button @click="showTaskModal()">新增</a-button>
        </template>
        <a-divider style="margin-top: 0" />
        <a-spin :loading="false" style="width: 100%">
          <a-table :data="taskList">
            <template #columns>
              <a-table-column title="序号">
                <template #cell="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
              </a-table-column>
              <a-table-column title="任务类型" data-index="type">
                <template #cell="{ record }">
                  {{ getTaskTypeName(record.taskType) }}
                </template>
              </a-table-column>
              <a-table-column title="任务名称" data-index="taskName" />
              <a-table-column title="状态">
                <template #cell="{ record }">
                  <a-tag :color="record.status.color">
                    {{ record.status.label }}
                  </a-tag>
                </template>
              </a-table-column>
              <a-table-column
                :ellipsis="true"
                :width="220"
                title="jira 地址"
                data-index="jiraAddress"
              >
                <template #cell="{ record }">
                  <a-link
                    v-if="record.jiraAddress"
                    :href="record.jiraAddress"
                    icon
                    target="_blank"
                  >
                    {{ record.jiraAddress }}
                  </a-link>
                </template>
              </a-table-column>
              <a-table-column
                :ellipsis="true"
                :width="220"
                title="prd 地址"
                data-index="prdAddress"
              >
                <template #cell="{ record }">
                  <a-link
                    v-if="record.prdAddress"
                    :href="record.prdAddress"
                    icon
                    target="_blank"
                  >
                    {{ record.prdAddress }}
                  </a-link>
                </template>
              </a-table-column>
              <a-table-column title="操作" :width="120" align="right">
                <template #cell="{ record }">
                  <a-button type="text" @click="goTaskDetail(record.id)">
                    查看
                  </a-button>
                  <a-button type="text" @click="showTaskModal(record)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    content="确定要删除改任务吗 ?"
                    @ok="deleteTask(record.id)"
                  >
                    <a-button type="text" status="danger"> 删除 </a-button>
                  </a-popconfirm>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-spin>
      </a-card>
    </a-space>
  </div>
</template>

<script setup lang="ts">
  import { getCodeStore } from '@/api/code_store';
  import {
    getProjectById,
    addCodeStoreById,
    updateCodeStoreById,
  } from '@/api/project';
  import {
    createTask,
    getTaskList,
    updateTaskById,
    deleteTaskById,
  } from '@/api/task';
  import { onMounted, ref, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import useModelForm from '@/utils/form';
  import { CodeStoreItem, ProjectDetail } from '@/type/project';
  import { ExtFormFieldItem } from '@/components/ext/type';
  import { Message } from '@arco-design/web-vue';
  import UUID from '@/utils/uuid';
  import { Task } from '@/type/task';
  import router from '@/router';

  const route = useRoute();
  const projectId = route.params.id?.toString();
  const taskList = ref<Task[]>([]);
  const projectDetail = ref<ProjectDetail | null>(null);
  // 获取项目详情信息
  const fetchProjectDetail = async () => {
    const { data } = await getProjectById(projectId);
    projectDetail.value = data;
  };
  // 代码仓库的创建和编辑
  const showCodeStoreModal = async (record?: CodeStoreItem) => {
    const newUid = UUID(6);
    const { data } = await getCodeStore();
    const storeList = (data || []).map((store: any) => ({
      label: store.name || store.storeName,
      value: store.name || store.storeName,
    }));
    const formData = ref<CodeStoreItem>({
      uid: record?.uid || newUid,
      storeName: record?.storeName || '',
      storeAddress: record?.storeAddress || '',
      mainBranch: record?.mainBranch || '',
      nodeVersion: record?.nodeVersion || '',
      remark: record?.remark || '',
      jenkins: record?.jenkins || '',
    });

    const fields = [
      {
        label: '仓库名称',
        prop: 'storeName',
        type: 'select',
        rules: [{ required: true, message: '请选择仓库名称' }],
        fieldCopmProps: {
          placeholder: '请选择仓库',
          options: storeList,
          allowClear: true,
          allowSearch: true,
        },
      },
      {
        label: '仓库地址',
        prop: 'storeAddress',
        rules: [{ required: true, message: '请输入仓库地址' }],
        fieldCopmProps: {
          placeholder: '请输入仓库地址',
        },
      },
      {
        label: '主分支名',
        prop: 'mainBranch',
        rules: [{ required: true, message: '请输入主分支名' }],
        fieldCopmProps: {
          placeholder: '请输入主分支',
        },
      },
      {
        label: 'node 版本',
        prop: 'nodeVersion',
        rules: [{ required: true, message: '请输入 node 版本' }],
        fieldCopmProps: {
          placeholder: '请输入 node 兼容版本',
        },
      },
      {
        label: 'jenkins 地址',
        prop: 'jenkins',
        fieldCopmProps: {
          placeholder: '请输入 jenkins 地址',
        },
      },
      {
        label: '项目备注',
        prop: 'remark',
        type: 'textarea',
        fieldCopmProps: {
          placeholder: '请输入备注',
        },
      },
    ];

    return useModelForm({
      title: record ? '编辑代码仓库' : '添加代码仓库',
      modelValue: formData,
      fields: fields as ExtFormFieldItem[],
      onBeforeValidateOk: async (done, modelValue) => {
        try {
          if (record?.uid) {
            await updateCodeStoreById({
              projectId,
              codeStoreItem: modelValue as CodeStoreItem,
            });
          } else {
            await addCodeStoreById({
              projectId,
              codeStoreItem: modelValue as CodeStoreItem,
            });
          }
          Message.success(record ? '更新成功' : '创建成功');
          fetchProjectDetail();
          done(true);
        } catch (error) {
          done(false);
        }
      },
    });
  };
  // 获取任务列表
  const fetchTaskList = async () => {
    const { data } = await getTaskList(projectId);
    taskList.value = data.map((item: any) => {
      const taskInfoList = item.taskInfoList || [];
      let label = '';
      let color = '#86909c';
      if (taskInfoList.length === 0) {
        label = '未开始';
        color = '#86909c';
      } else {
        const doneList = taskInfoList.filter(
          (info: any) => info.status === 'done'
        );
        if (doneList.length === taskInfoList.length) {
          label = '开发完成';
          color = '#00b42a';
        } else {
          label = '进行中';
          color = '#168cff';
        }
      }
      return {
        status: {
          label,
          color,
        },
        ...item,
      };
    });
  };

  const taskTypeOptions = [
    { label: '需求', value: 'feature' },
    { label: 'BUG', value: 'bug' },
    { label: '其他', value: 'other' },
  ];
  const getTaskTypeName = (type: string) => {
    return taskTypeOptions.find((item) => item.value === type)?.label;
  };

  const showTaskModal = async (item?: Task) => {
    const taskForm = reactive<Task>({
      taskName: item?.taskName || '',
      taskType: item?.taskType || undefined,
      jiraAddress: item?.jiraAddress || '',
      prdAddress: item?.prdAddress || '',
      frontEndDevelopsIds: item?.frontEndDevelopsIds || [],
      backEndDevelopsIds: item?.backEndDevelopsIds || [],
      expectLaunchTime: item?.expectLaunchTime || '',
    });
    return useModelForm({
      title: item?.id ? '编辑任务' : '新增任务',
      modelValue: taskForm,
      fields: [
        {
          label: '任务名称',
          prop: 'taskName',
          rules: [{ required: true, message: '请输入任务名称' }],
        },
        {
          label: '任务类型',
          prop: 'taskType',
          type: 'select',
          rules: [{ required: true, message: '请选择任务类型' }],
          fieldCopmProps: {
            options: taskTypeOptions,
          },
        },
        {
          label: 'jira 地址',
          prop: 'jiraAddress',
          rules: [{ required: true, message: '请输入 jira 地址' }],
        },
        {
          label: 'prd 地址',
          prop: 'prdAddress',
          rules: [{ required: true, message: '请输入 prd 地址' }],
        },
        {
          label: '前端开发',
          prop: 'frontEndDevelopsIds',
          type: 'userSelect',
          fieldCopmProps: {
            placeholder: '请选择前端开发',
            multiple: true,
          },
        },
        {
          label: '后端开发',
          prop: 'backEndDevelopsIds',
          type: 'userSelect',
          fieldCopmProps: {
            placeholder: '请选择后端开发',
            multiple: true,
          },
        },
        {
          label: '预期上线时间',
          prop: 'expectLaunchTime',
          type: 'datePicker',
          fieldCopmProps: {
            style: { width: '100%' },
          },
        },
      ],
      onBeforeValidateOk: async (done, modelValue) => {
        try {
          if (item?.id) {
            await updateTaskById({
              id: item.id,
              ...(modelValue as Task),
            });
            Message.success('更新成功');
          } else {
            await createTask({
              projectId,
              ...(modelValue as Task),
            });
            Message.success('创建成功');
          }
          fetchTaskList();
          done(true);
        } catch (error) {
          done(false);
        }
      },
    });
  };
  // 删除任务
  const deleteTask = async (id: string) => {
    await deleteTaskById(id);
    Message.success('删除成功');
    fetchTaskList();
  };
  // 查看任务详情
  const goTaskDetail = (taskId: string) => {
    router.push({
      name: 'taskDetail',
      params: {
        id: taskId,
      },
    });
  };

  onMounted(() => {
    fetchProjectDetail();
    fetchTaskList();
  });
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
  .code-store {
    & > .arco-col {
      & > div {
        padding: 20px;
        // background-color: var(--color-primary-light-4);
        border: 1px solid #eee;
        cursor: pointer;
        &:hover {
          transition: all 200ms;
          box-shadow: inset 0 0 0px 1px rgb(var(--primary-6));
        }
      }
    }
  }
</style>
