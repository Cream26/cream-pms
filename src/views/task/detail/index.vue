<template>
  <div class="container">
    <Breadcrumb
      :items="[
        { label: `${projectDetail?.name}`, click: goProject },
        `${taskDetail?.taskName}`,
      ]"
    />
    <div class="task-container-body">
      <a-card class="general-card" title="任务详情">
        <template #title>
          <div class="task-title-block">
            <div class="task-name">
              <a-space>
                任务详情
                <a-button-group>
                  <a-button
                    title="分析"
                    size="mini"
                    type="text"
                    @click="goTaskAnalysis"
                  >
                    <icon-bar-chart />
                  </a-button>
                </a-button-group>
              </a-space>
            </div>
          </div>
        </template>
        <template #extra>
          <a-space>
            <!-- <a-button>转 交</a-button> -->
            <a-button
              v-if="
                projectDetail?.projectPMId === userStore.id &&
                taskInfoList.some((item) => item.confirmed !== true)
              "
              type="outline"
              @click="pmConfirm"
            >
              PM 确认
            </a-button>
            <a-button type="outline" @click="devConfirm"> 开发确认 </a-button>
            <a-button
              v-if="devStarting && !devDoneRef"
              type="primary"
              @click="devDoneClick"
            >
              开发完成
            </a-button>
            <a-button type="primary">上线完成</a-button>
          </a-space>
        </template>
        <a-space>
          <div> 任务名称: {{ taskDetail?.taskName }} </div>
          <a-divider direction="vertical" />
          <div>
            前端开发:
            <a-space>
              <UserTag
                v-for="item in taskDetail?.frontEndDevelops"
                :id="item.id"
                :key="item.id"
                :name="item.name"
              ></UserTag>
            </a-space>
          </div>
          <a-divider direction="vertical" />
          <div>
            后端开发:<a-space>
              <UserTag
                v-for="item in taskDetail?.backEndDevelops"
                :id="item.id"
                :key="item.id"
                :name="item.name"
              ></UserTag>
            </a-space>
          </div>
          <a-divider direction="vertical" />
          <div>
            期望上线时间:<a-space>
              {{ taskDetail?.expectLaunchTime }}
            </a-space>
          </div>
        </a-space>
      </a-card>
      <!-- 任务明细 -->
      <a-card class="general-card task-info-card" title="任务明细">
        <template #extra>
          <a-link @click="showTaskDetailModel()">新建</a-link>
        </template>
        <div class="task-info-detail">
          <div
            v-for="item in ['todo', 'doing', 'done']"
            :key="item"
            class="task-todo-list"
          >
            <div class="task-info-header"> {{ item }} </div>
            <VueDraggable
              v-model="listMap[item]"
              class="task-info-body"
              group="task"
              item-key="id"
              @add="(arg) => taskInfoChange(arg, item as 'todo' | 'doing' | 'done')"
            >
              <template #item="{ element: info }">
                <div
                  v-if="currentCheckImplementer.includes(info.implementer)"
                  class="task-info-item"
                  @click="showTaskDetailModel(info)"
                >
                  <div class="task-info-item-left">
                    <div class="task-info-name">
                      {{ info.name }}
                      <a-tag
                        :color="
                          info.confirmed
                            ? 'rgb(var(--green-6))'
                            : 'var(--color-neutral-4)'
                        "
                        size="small"
                      >
                        {{ info.confirmed ? '已确认' : '未确认' }}
                      </a-tag>
                    </div>
                    <div class="task-info-desc"> {{ info.desc }}</div>
                  </div>
                  <div class="task-info-item-right">
                    <div class="task-info-item-time"> {{ info.time }}h </div>
                    <div class="">
                      <UserTag
                        :id="info.implementerInfo.id"
                        :name="info.implementerInfo.name"
                      ></UserTag>
                    </div>
                  </div>
                </div>
              </template>
            </VueDraggable>
          </div>
          <div class="task-todo-list">
            <div class="task-info-header"> 执行人 </div>
            <div class="task-info-body">
              <a-checkbox-group
                v-model="currentCheckImplementer"
                direction="vertical"
              >
                <a-checkbox
                  v-for="member in implementerList"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                  <span
                    class="dev-info-block"
                    :class="{
                      'dev-info-block--confirmed':
                        developerMap[member.id]?.confirmed,
                    }"
                  >
                    (
                    {{
                      developerMap[member.id]?.startDate
                        ? dayjs(developerMap[member.id]?.startDate).format(
                            'YYYY-MM-DD'
                          )
                        : '未确认'
                    }}
                    |
                    {{
                      '投入:' +
                      (developerMap[member.id]?.inputRatio || 100) +
                      '%'
                    }}
                    )
                  </span>
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>

  <a-modal
    v-model:visible="devConfirmVisible"
    :mask-closable="false"
    title="开发确认"
    @ok="devConfirmOk"
  >
    <a-form auto-label-width :model="devConfirmForm">
      <a-form-item required field="startDate" label="开始时间">
        <a-date-picker
          v-model="devConfirmForm.startDate"
          value-format="timestamp"
          style="width: 100%"
        ></a-date-picker>
      </a-form-item>
      <a-form-item required field="post" label="投入比例">
        <a-input-number
          v-model="devConfirmForm.inputRatio"
          style="width: 100%"
          placeholder="请输入投入比例"
          :default-value="100"
          mode="button"
        >
          <template #suffix> % </template>
        </a-input-number>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { getProjectById } from '@/api/project';
  import {
    devDone,
    pmConfirmed,
    devConfirmed,
    getTaskInfoById,
  } from '@/api/task';
  import {
    createTaskInfo,
    getTaskDetailList,
    updateTaskInfoById,
    updateTaskInfoStatus,
  } from '@/api/task_info';
  import router from '@/router';
  import { useUserStore } from '@/store';
  import { TaskDetail } from '@/type/task';
  import { TaskInfo } from '@/type/task_info';
  import useModelFrom from '@/utils/form';
  import { Message, Modal } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import { watch, computed, reactive, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import VueDraggable from 'vuedraggable';
  import { ProjectDetail } from '@/type/project';

  const route = useRoute();
  const userStore = useUserStore();
  const taskId = route.params.id.toString();
  const devConfirmVisible = ref(false);
  const listMap = reactive<Record<string, TaskInfo[]>>({
    todo: [],
    doing: [],
    done: [],
  });
  const devConfirmForm = ref({
    startDate: +dayjs(dayjs().format('YYYY-MM-DD 00:00:00')),
    inputRatio: 100,
  });

  const currentCheckImplementer = ref<string[]>([]);

  const taskDetail = ref<TaskDetail>();
  const projectDetail = ref<ProjectDetail>();
  const taskInfoList = ref<TaskInfo[]>([]);
  const developerMap = computed(() => {
    return taskDetail.value?.developerMap || {};
  });

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
  // 面包屑跳转
  function goProject() {
    router.push({
      name: 'projectDetail',
      params: {
        id: projectDetail.value?.id,
      },
    });
  }
  // 获取项目详情
  watch(taskDetail, async (val) => {
    if (val?.projectId) {
      const { data } = await getProjectById(val?.projectId);
      projectDetail.value = data;
    }
  });

  // PM确认
  const pmConfirm = async () => {
    await pmConfirmed(taskDetail.value?.id as string);
    await fetchTaskDetailList();
    Message.success('确认成功');
  };

  // const needPmConfirm = computed(() => {
  //   return taskInfoList.value.some((item) => !item.confirmed);
  // });

  const devStarting = computed(() => {
    const devStartingMap = taskDetail.value?.developerMap || {};
    return devStartingMap[userStore.id as string];
  });

  const devDoneRef = computed(() => {
    const devDoneMap = taskDetail.value?.developerMap || {};
    return devDoneMap[userStore.id as string];
  });

  // 获取执行人的一个列表
  const implementerList = computed(() => {
    return taskInfoList.value.reduce(
      ({ list, map }: { list: any[]; map: Record<string, any> }, item) => {
        const { implementerInfo } = item;
        if (implementerInfo && !map[implementerInfo.id]) {
          map[implementerInfo.id] = implementerInfo;
          list.push(implementerInfo);
        }
        return { list, map };
      },
      { list: [], map: {} }
    ).list;
  });
  // 监听任务明细列表，从而将其进行分类
  watch(taskInfoList, (val = []) => {
    const todo: TaskInfo[] = [];
    const doing: TaskInfo[] = [];
    const done: TaskInfo[] = [];
    currentCheckImplementer.value = val.map((item) => item.implementer);

    val.forEach((item) => {
      if (item.status === 'done') {
        done.push(item);
      } else if (item.status === 'doing') {
        doing.push(item);
      } else {
        todo.push(item);
      }
    });
    listMap.todo = todo;
    listMap.doing = doing;
    listMap.done = done;
  });

  // 新建/编辑任务明细
  const showTaskDetailModel = (item?: TaskInfo) => {
    const taskDetailForm = ref<TaskInfo>({
      name: item?.name || '',
      desc: item?.desc || '',
      time: item?.time || 1,
      implementer: item?.implementer || (userStore.id as string),
      status: item?.status || 'todo',
      taskId,
    });
    return useModelFrom({
      title: item ? '编辑任务明细' : '新建任务明细',
      modelValue: taskDetailForm,
      fields: [
        {
          label: '名称',
          prop: 'name',
          rules: [{ required: true, message: '请输入名称' }],
          fieldCopmProps: {
            placeholder: '请输入名称',
          },
        },
        {
          label: '时间',
          prop: 'time',
          type: 'inputNumber',
          rules: [{ required: true, message: '请输入时间' }],
          fieldCopmProps: {
            placeholder: '请输入时间',
            min: 0.5,
            step: 0.5,
            mode: 'button',
          },
        },
        {
          label: '执行人',
          prop: 'implementer',
          type: 'userSelect',
          rules: [{ required: true, message: '请选择执行人' }],
          fieldCopmProps: {
            disabled: true,
          },
        },
        {
          label: '备注',
          prop: 'desc',
          type: 'textArea',
          fieldCopmProps: {
            placeholder: '请输入备注',
          },
        },
      ],
      onBeforeValidateOk: async (done, modelValue) => {
        if (item) {
          await updateTaskInfoById(item.id as string, {
            ...(modelValue as TaskInfo),
          });
          Message.success('更新成功');
        } else {
          await createTaskInfo({
            ...(modelValue as TaskInfo),
            taskId,
          });
          Message.success('创建成功');
        }
        await fetchTaskDetailList();

        done(true);
      },
    });
  };
  // 任务明细状态改变
  const taskInfoChange = async (
    arg: any,
    status: 'todo' | 'doing' | 'done'
  ) => {
    // eslint-disable-next-line no-underscore-dangle
    await updateTaskInfoStatus(arg.item.__draggable_context.element.id, status);
  };

  async function devConfirmOk() {
    // eslint-disable-next-line no-underscore-dangle
    await devConfirmed(taskDetail.value?.id as string, {
      ...devConfirmForm.value,
    });
    Message.success('确认成功');
  }
  async function devDoneClick() {
    Modal.confirm({
      title: '开发完成确认',
      content: '开发完成会自动完成所有任务明细，是否确认完成开发?',
      async onOk() {
        // eslint-disable-next-line no-underscore-dangle
        await devDone(taskDetail.value?.id as string);
      },
    });
  }

  async function devConfirm() {
    devConfirmVisible.value = true;
    devConfirmForm.value = {
      startDate: +dayjs(dayjs().format('YYYY-MM-DD 00:00:00')),
      inputRatio: 100,
      ...(developerMap.value[userStore.id as string] || {}),
    };
  }

  function goTaskAnalysis() {
    router.push({
      name: 'taskAnalysis',
      params: {
        id: taskId,
      },
    });
  }

  onMounted(() => {
    fetchTaskInfo();
    fetchTaskDetailList();
  });
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px 20px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .task-info-detail {
    display: grid;
    grid-template-columns: repeat(3, 1fr) 280px;
    min-height: calc(100% - 200px);
    column-gap: 20px;
  }
  .task-container-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .task-info-card {
    margin-top: 20px;
    // flex: 1;
    min-height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    :deep(.arco-card-body) {
      flex: 1;
    }
  }

  .task-info-detail {
    height: 100%;
  }
  .task-todo-list {
    height: 100%;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
  }
  .task-info-header {
    // line-height: 20px;
    margin-bottom: 10px;
    padding-left: 20px;
  }
  .task-info-body,
  .task-member-filter {
    flex: 1;
    border-radius: 6px;
    background-color: var(
      --color-fill-2
    ); //rgba(#eee, 0.2); //var(--color-fill-2);
    padding: 10px;
  }
  .task-member-filter-wrap {
    height: 100%;
  }
  .task-info-item {
    border-radius: 6px;
    padding: 10px 12px;
    background-color: #fff; // #e3e3e3;
    display: flex;
    margin-bottom: 10px;
    cursor: move;
    .task-info-name {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .arco-tag {
        margin-left: 10px;
        font-size: 12px;
      }
    }
    .task-info-item-left {
      flex: 1;
    }
    .task-info-item-right {
      height: auto;
      padding: 0 10px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 100%;
      flex-direction: column;
    }
    .task-info-item-right {
      height: auto;
    }
  }
  .task-title-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .task-name {
      display: flex;
      align-items: center;
    }
  }
  .dev-info-block {
    color: var(--color-neutral-4);
  }
  .dev-info-block--confirmed {
    color: rgb(var(--green-6));
  }
</style>
