<template>
  <div class="container">
    <Breadcrumb
      :items="[
        { label: `${projectDetail.name}`, click: goProject },
        `${taskDetail.name}`,
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
                  <a-button title="编辑" size="mini" type="text">
                    <icon-edit />
                  </a-button>
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
            <div class="task-action"> </div>
          </div>
        </template>
        <template #extra>
          <a-space>
            <a-button>转 交</a-button>
            <!-- v-if="needPmConfirm" -->
            <a-button
              v-if="taskDetail.pmMember?._id === userStore.id"
              type="outline"
              @click="pmConfirm"
            >
              PM 确认
            </a-button>

            <a-button type="outline" @click="devConfirm"> 开发确认 </a-button>

            <!-- <a-popconfirm
              content="确认开始开发后，需求会从当前开始计算完成时间，请确认?"
              position="rt"
              @ok="startDevClick"
            >
              <a-button v-if="!devStarting" type="outline"> 开始开发 </a-button>
            </a-popconfirm> -->

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
          <div> 任务名称: {{ taskDetail.name }} </div>
          <a-divider direction="vertical" />
          <div>
            前端开发:
            <a-space>
              <UserTag
                v-for="item in taskDetail.feMemberList"
                :id="item._id"
                :key="item._id"
                :name="item.name"
              ></UserTag>
            </a-space>
          </div>
          <a-divider direction="vertical" />
          <div>
            后端开发:<a-space>
              <UserTag
                v-for="item in taskDetail.beMemberList"
                :id="item._id"
                :key="item._id"
                :name="item.name"
              ></UserTag>
            </a-space>
          </div>
          <a-divider direction="vertical" />
          <div>
            期望上线时间:<a-space>
              {{ taskDetail.expectDate }}
            </a-space>
          </div>
        </a-space>
      </a-card>

      <a-card class="general-card task-info-card" title="任务明细">
        <template #extra>
          <a-link @click="addTaskInfo">新建</a-link>
        </template>
        <div class="task-info-detail">
          <div
            v-for="item in ['todo', 'doing', 'done']"
            :key="item"
            class="task-todo-list"
          >
            <div class="task-info-header"> {{ item }} </div>
            <!-- <div class="task-info-body"> -->
            <VueDraggable
              v-model="listMap[item]"
              class="task-info-body"
              group="task"
              item-key="id"
              @add="(arg) => taskInfoChange(arg, item as any)"
            >
              <template #item="{ element: info }">
                <div
                  v-if="currentCheckImplementer.includes(info.implementer)"
                  class="task-info-item"
                  @click="editorTaskInfo(info)"
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
            <!-- </div> -->
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
    v-model:visible="taskInfoModalVisible"
    :mask-closable="false"
    :title="taskInfoForm.id ? '修改任务明细' : '创建任务明细'"
    unmount-on-close
  >
    <a-form
      ref="taskInfoFormRef"
      auto-label-width
      :model="taskInfoForm"
      label-align="left"
    >
      <a-form-item asterisk-position="end" required field="name" label="名称">
        <a-input v-model="taskInfoForm.name" placeholder="请输入" />
      </a-form-item>

      <a-form-item asterisk-position="end" required field="time" label="时间">
        <a-input-number
          v-model="taskInfoForm.time"
          placeholder="请输入"
          :max="8"
          :min="0.5"
          mode="button"
          :step="0.5"
          style="width: 100%"
        >
          <template #suffix> h </template>
        </a-input-number>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        required
        field="implementer"
        label="执行人"
      >
        <user-select v-model="taskInfoForm.implementer"> </user-select>
      </a-form-item>
      <a-form-item field="desc" label="备注">
        <a-textarea
          v-model="taskInfoForm.desc"
          placeholder="请输入"
        ></a-textarea>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button status="danger" @click="deleteTaskInfo">删除</a-button>
        <a-button type="primary" @click="sendCreateTaskInfo">确认</a-button>
      </a-space>
    </template>
  </a-modal>

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
  import { devDone, getTaskById, pmConfirmed, devConfirmed } from '@/api/task';
  import {
    createTaskInfo,
    deleteTaskInfoById,
    getTaskInfoByTaskId,
    updateTaskInfoById,
  } from '@/api/taskInfo';
  import router from '@/router';
  import { useUserStore } from '@/store';
  import { Message, Modal } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import { watch, computed, reactive, onBeforeMount, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import VueDraggable from 'vuedraggable';

  const route = useRoute();
  const userStore = useUserStore();
  const taskId = route.params.id.toString();
  const devConfirmVisible = ref(false);
  const listMap = reactive<any>({
    todo: [],
    doing: [],
    done: [],
  });
  const devConfirmForm = ref({
    startDate: +dayjs(dayjs().format('YYYY-MM-DD 00:00:00')),
    inputRatio: 100,
  });

  const currentCheckImplementer = ref<string[]>([]);

  const taskDetail = ref<any>({});
  const projectDetail = ref<any>({});
  const taskInfoModalVisible = ref(false);
  const taskInfoList = ref<any[]>([]);
  const developerMap = computed(() => {
    return taskDetail.value.developerMap || {};
  });

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

  const needPmConfirm = computed(() => {
    return taskInfoList.value.some((item) => !item.confirmed);
  });

  const devStarting = computed(() => {
    const devStartingMap = taskDetail.value.devStartingMap || {};
    return devStartingMap[userStore.id as string];
  });

  const devDoneRef = computed(() => {
    const devDoneMap = taskDetail.value.devDoneMap || {};
    return devDoneMap[userStore.id as string];
  });

  const implementerList = computed(() => {
    return taskInfoList.value.reduce(
      ({ list, map }, item) => {
        const { implementerInfo } = item;
        if (!map[implementerInfo.id]) {
          map[implementerInfo.id] = implementerInfo;
          list.push(implementerInfo);
        }
        return { list, map };
      },
      { list: [], map: {} }
    ).list;
  });

  watch(taskInfoList, (val = []) => {
    const todo: any[] = [];
    const doing: any[] = [];
    const done: any[] = [];
    // if (!currentCheckImplementer.value.length) {
    currentCheckImplementer.value = val.map((item) => item.implementer);
    // }
    // currentCheckImplementer.value = [userStore.id as string];

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

  const taskInfoForm = reactive({
    id: '',
    taskId,
    name: '',
    desc: '',
    time: 1,
    implementer: '',
  });

  async function fetchTaskDetail() {
    const { data } = await getTaskById(taskId);
    taskDetail.value = data;
  }

  async function fetchTaskInfoList() {
    const { data } = await getTaskInfoByTaskId(taskId);
    taskInfoList.value = data;
  }

  async function addTaskInfo() {
    //
    taskInfoModalVisible.value = true;
    taskInfoForm.id = '';
    taskInfoForm.name = '';
    taskInfoForm.desc = '';
    taskInfoForm.implementer = `${userStore.id}`;
  }
  const currentTaskInfo = ref<any>({});
  function editorTaskInfo(item: any) {
    //
    currentTaskInfo.value = item;
    // eslint-disable-next-line no-underscore-dangle
    taskInfoForm.id = item.id || item._id;
    taskInfoForm.name = item.name;
    taskInfoForm.time = item.time;
    taskInfoForm.desc = item.desc;
    taskInfoForm.implementer = item.implementer;
    taskInfoModalVisible.value = true;
  }

  const taskInfoFormRef = ref<any>();
  function deleteTaskInfo() {
    taskInfoFormRef.value.validate(async (err: any) => {
      if (!err) {
        if (taskInfoForm.id) {
          await deleteTaskInfoById(taskInfoForm.id);
          taskInfoModalVisible.value = false;
          fetchTaskInfoList();
        }
      }
    });
  }
  function sendCreateTaskInfo() {
    taskInfoFormRef.value.validate(async (err: any) => {
      if (!err) {
        if (taskInfoForm.id) {
          const data: any = {};
          if (taskInfoForm.time !== currentTaskInfo.value.time) {
            data.confirmed = false;
          }
          await updateTaskInfoById(taskInfoForm.id, {
            ...taskInfoForm,
            ...data,
          });
        } else {
          await createTaskInfo({
            ...taskInfoForm,
            taskId,
          });
        }
        // done(true);
        taskInfoModalVisible.value = false;
        fetchTaskInfoList();
      } else {
        taskInfoModalVisible.value = true;
      }
      // done(false);
    });
  }
  function taskInfoChange(arg: any, status: 'todo' | 'doing' | 'done') {
    // eslint-disable-next-line no-underscore-dangle
    const item: any = arg.item.__draggable_context.element;
    // eslint-disable-next-line no-underscore-dangle
    updateTaskInfoById(item._id, {
      status,
    });
  }

  async function pmConfirm() {
    // eslint-disable-next-line no-underscore-dangle
    await pmConfirmed(taskDetail.value._id);
    await fetchTaskInfoList();
    await fetchTaskDetail();

    Message.success('确认成功');
  }
  // async function startDevClick() {
  //   // eslint-disable-next-line no-underscore-dangle
  //   await startDev(taskDetail.value._id);
  //   await fetchTaskDetail();
  //   Message.success('确认成功');
  // }
  async function devConfirmOk() {
    // eslint-disable-next-line no-underscore-dangle
    await devConfirmed(taskDetail.value._id, {
      ...devConfirmForm.value,
    });
    await fetchTaskDetail();
    Message.success('确认成功');
  }
  async function devDoneClick() {
    Modal.confirm({
      title: '开发完成确认',
      content: '开发完成会自动完成所有任务明细，是否确认完成开发?',
      async onOk() {
        // eslint-disable-next-line no-underscore-dangle
        await devDone(taskDetail.value._id);
        await fetchTaskDetail();
        await fetchTaskInfoList();
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
  onBeforeMount(() => {
    fetchTaskDetail();
    fetchTaskInfoList();
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
