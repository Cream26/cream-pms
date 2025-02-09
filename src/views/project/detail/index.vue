<template>
  <div class="container">
    <Breadcrumb :items="['项目集合', projectDetail.name || '']" />
    <a-space direction="vertical" fill>
      <a-card class="general-card" title="项目详情">
        <a-divider style="margin-top: 0" />
        <a-space direction="vertical" fill>
          <a-row>
            <a-col :span="2">项目名称: </a-col>
            <a-col :span="8">
              <a-tag color="#ff7d00">
                {{ projectDetail.name }}
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
                :id="projectDetail.projectPMInfo?.id"
                :name="projectDetail.projectPMInfo?.name"
              ></UserTag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="2">前端负责人: </a-col>
            <a-col :span="8">
              <UserTag
                :id="projectDetail.frontendLeadInfo?.id"
                :name="projectDetail.frontendLeadInfo?.name"
              >
              </UserTag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="2">后端负责人: </a-col>
            <a-col :span="8">
              <UserTag
                :id="projectDetail.backendLeadInfo?.id"
                :name="projectDetail.backendLeadInfo?.name"
              >
              </UserTag>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="2">项目环境配置： </a-col>
            <a-col :span="8"> {{ projectDetail.env }} </a-col>
          </a-row>
        </a-space>
      </a-card>
      <a-card class="general-card" title="代码仓库">
        <template #extra>
          <a-button type="primary" @click="addCodeStore">添加</a-button>
        </template>
        <a-row class="code-store" :gutter="[24, 12]">
          <a-col
            v-for="store in projectDetail.codeStoreList"
            :key="store.name"
            :span="8"
            class="code-store-item"
            @click="editorCodeStore(store)"
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
          <a-link @click="showTaskModal">新增</a-link>
        </template>
        <a-divider style="margin-top: 0" />
        <a-spin :loading="false" style="width: 100%">
          <a-table :data="taskList">
            <template #columns>
              <a-table-column title="序号" data-index="">
                <template #cell="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
              </a-table-column>
              <a-table-column title="任务类型" data-index="type">
                <template #cell="{ record }">
                  {{ taskTypeMap[record.type] }}
                </template>
              </a-table-column>
              <a-table-column title="任务名称" data-index="name" />
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
                data-index="jira"
              >
                <template #cell="{ record }">
                  <a-link
                    v-if="record.jira"
                    :href="record.jira"
                    icon
                    target="_blank"
                  >
                    {{ record.jira }}
                  </a-link>
                </template>
              </a-table-column>
              <a-table-column
                :ellipsis="true"
                :width="220"
                title="prd 地址"
                data-index="prd"
              >
                <template #cell="{ record }">
                  <a-link
                    v-if="record.prd"
                    :href="record.prd"
                    icon
                    target="_blank"
                  >
                    {{ record.prd }}
                  </a-link>
                </template>
              </a-table-column>
              <a-table-column title="创建时间" data-index="updateTime" />
              <a-table-column title="操作" :width="120" align="right">
                <template #cell="{ record }">
                  <a-button type="text" @click="goTaskDetail(record._id)">
                    查看
                  </a-button>
                  <a-button type="text" @click="updateTask(record)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    content="确定要删除改任务吗 ?"
                    @ok="deleteTask(record)"
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
  <!-- 项目涉及代码仓库 -->
  <a-modal
    v-model:visible="taskModalVisible"
    :mask-closable="false"
    :title="currentTask ? '编辑任务' : '创建任务'"
    @before-ok="sendCreateRequireModal"
  >
    <a-form ref="taskFormRef" :model="taskForm" label-align="left">
      <a-form-item
        asterisk-position="end"
        required
        field="name"
        label="任务名称"
      >
        <a-input v-model="taskForm.name" />
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        required
        field="type"
        label="任务类型"
      >
        <a-select v-model="taskForm.type">
          <a-option value="require">新增需求</a-option>
          <a-option value="bug">线上bug</a-option>
          <a-option value="other">其他</a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        required
        field="jira"
        label="jira  地址"
      >
        <a-input v-model="taskForm.jira">
          <template #suffix>
            <icon-link />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        required
        field="prd"
        label="prd  地址"
        :ellipsis="true"
      >
        <a-input v-model="taskForm.prd">
          <template #suffix>
            <icon-link />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="post" label="前端开发">
        <a-select v-model="taskForm.feUserList" multiple>
          <a-option
            v-for="member in memberList"
            :key="member._id"
            :value="member._id"
          >
            {{ member.name }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="post" label="后端开发">
        <a-select v-model="taskForm.beUserList" multiple>
          <a-option
            v-for="member in memberList"
            :key="member._id"
            :value="member._id"
          >
            {{ member.name }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="post" label="期望上线日期">
        <a-date-picker v-model="taskForm.expectDate" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
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
    updateTaskById,
    deleteTaskById,
    getByProjectId,
  } from '@/api/task';
  import router from '@/router';
  import { onMounted, ref, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import useModelForm from '@/utils/form';
  import { CodeStoreItem } from '@/type/project';
  import { ExtFormFieldItem } from '@/components/ext/type';
  import { Message } from '@arco-design/web-vue';
  import UUID from '@/utils/uuid';

  const route = useRoute();
  const projectId = route.params.id?.toString();
  const taskModalVisible = ref(false);
  const currentTask: any = ref(null);
  const taskList = ref([]);
  const projectDetail = ref<any>({});
  const memberList = ref<any[]>([]);
  const taskTypeMap: any = {
    require: '需求',
    bug: 'bug',
    other: '其他',
  };

  const taskForm = reactive({
    name: '',
    type: '',
    jira: '',
    prd: '',
    expectDate: undefined,
    feUserList: [],
    beUserList: [],
  });
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
  const addCodeStore = () => {
    showCodeStoreModal();
  };
  const editorCodeStore = (item: CodeStoreItem) => {
    showCodeStoreModal(item);
  };

  const showTaskModal = async () => {
    const taskForm1 = reactive({
      taskName: '',
      time: undefined,
    });
    return useModelForm({
      title: '测试',
      modelValue: taskForm1,
      fields: [
        {
          label: '与其时间',
          prop: 'time',
          type: 'datePicker',
        },
      ],
    });
  };

  function addTask() {
    currentTask.value = undefined;
    taskModalVisible.value = true;
    taskForm.name = '';
    taskForm.jira = '';
    taskForm.prd = '';
    taskForm.type = '';
    taskForm.expectDate = undefined;
    taskForm.feUserList = [];
    taskForm.beUserList = [];
  }
  function updateTask(row: any) {
    currentTask.value = row;
    taskForm.name = row.name;
    taskForm.jira = row.jira;
    taskForm.prd = row.prd;
    taskForm.type = row.type;
    taskForm.expectDate = row.expectDate;
    taskForm.feUserList = row.feUserList;
    taskForm.beUserList = row.beUserList;
    taskModalVisible.value = true;
  }
  async function fetchTaskList() {
    const { data } = await getByProjectId({ projectId });
    taskList.value = data.list.map((item: any) => {
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
          color,
          label,
        },
        ...item,
      };
    });
  }

  const taskFormRef = ref<any>();
  const sendCreateRequireModal = (done: any) => {
    //
    taskFormRef.value.validate(async (erro: any) => {
      if (!erro) {
        if (currentTask.value) {
          // eslint-disable-next-line no-underscore-dangle
          await updateTaskById(currentTask.value._id, {
            ...taskForm,
          });
        } else {
          await createTask({
            projectId,
            ...taskForm,
          });
        }

        fetchTaskList();
        done(true);
      }
    });
  };

  async function deleteTask(row: any) {
    // eslint-disable-next-line no-underscore-dangle
    await deleteTaskById(row._id);
    fetchTaskList();
  }
  function goTaskDetail(taskId: string) {
    router.push({
      name: 'taskDetail',
      params: {
        id: taskId,
      },
    });
  }

  onMounted(async () => {
    await fetchProjectDetail();
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
