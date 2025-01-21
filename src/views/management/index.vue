<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
    <a-divider margin="5px" />
    <a-split
      v-model:size="size"
      :style="{
        height: '100%',
        width: '100%',
      }"
      min="280px"
      max="380px"
    >
      <template #first>
        <a-card title="部门列表" class="container-depart">
          <a-tree
            default-expand-all
            :data="treeData"
            :default-selected-keys="[rootDepartKey]"
            :default-expanded-keys="[rootDepartKey]"
            :field-names="{
              children: 'children',
              key: 'id',
              title: 'name',
            }"
            block-node
            @select="handleDepartSelect"
          >
            <template #extra="nodeData">
              <a-dropdown v-if="nodeData.id !== rootDepartKey">
                <icon-more />
                <template #content>
                  <a-doption @click="handleDepartEdit(nodeData)"
                    >编辑部门信息</a-doption
                  >
                  <a-doption @click="addDepart('down', nodeData)"
                    >添加下级部门</a-doption
                  >
                  <a-doption @click="addDepart('up', nodeData)"
                    >添加上级部门</a-doption
                  >
                  <a-doption @click="adjustDepart(nodeData)"
                    >调整上下级关系</a-doption
                  >
                  <a-doption
                    style="color: red"
                    @click="handleDepartDelete(nodeData)"
                    >删除部门</a-doption
                  >
                </template>
              </a-dropdown>
            </template>
          </a-tree>
        </a-card>
      </template>
      <template #second>
        <div class="container-right">
          <div class="container-right-header">
            <div class="container-right-header-title">{{
              currentDepart.name || '斯坦福大学'
            }}</div>
            <span>
              <a-button
                v-if="currentDepart.id !== rootDepartKey"
                type="text"
                @click="addDepart('up')"
              >
                添加上级部门
              </a-button>
              <a-divider direction="vertical" />
              <a-button type="text" @click="addDepart('down')">
                添加下级部门
              </a-button>
            </span>
          </div>
          <div class="container-right-content">
            <UserList :current-depart="currentDepart" />
          </div>
        </div>
      </template>
    </a-split>
  </div>
</template>

<script lang="ts" setup>
  import { computed, h, reactive, ref, onMounted } from 'vue';
  import { Depart } from '@/type/depart';
  import UserList from './components/user-list.vue';
  import { Modal, Form, Input, Message, Textarea } from '@arco-design/web-vue';
  import { rootDepartKey } from '@/constant';
  import useModelFrom from '@/utils/form';
  import {
    addDepartByType,
    getDepartTreeById,
    updateDepart,
    adjustDepartment,
    deleteDepart,
  } from '@/api/depart';

  const size = ref(280);
  const rootDepart = {
    name: '斯坦福大学',
    description: '斯坦福大学',
    key: rootDepartKey,
    id: rootDepartKey,
    children: [],
  };
  const currentDepart = ref<Depart>(rootDepart);

  const departList = ref<Depart[]>([]);

  const treeData = computed(() => {
    return [
      {
        ...rootDepart,
        children: departList.value || [],
      },
    ];
  });
  // 获取部门树
  const fetchTree = async () => {
    const res = await getDepartTreeById();
    departList.value = res.data;
  };
  // 选中当前树节点
  const handleDepartSelect = (selectedKeys: (string | number)[], node: any) => {
    if (!node.node) {
      currentDepart.value = rootDepart;
      return;
    }
    currentDepart.value = node.node;
  };

  // 编辑部门信息
  const handleDepartEdit = (nodeData: Depart) => {
    const formData = reactive({
      name: nodeData.name,
      description: nodeData.description || '',
    });
    const formInstance = ref<typeof Form | null>(null);
    Modal.open({
      title: '编辑部门信息',
      content: () =>
        h('div', [
          h(
            Form,
            {
              model: formData,
              ref: formInstance,
              labelColProps: { span: 6 },
              wrapperColProps: { span: 18 },
            },
            {
              default: () => [
                h(
                  Form.Item,
                  {
                    label: '部门名称',
                    required: true,
                    field: 'name',
                    rules: [
                      {
                        required: true,
                        message: '请输入部门名称',
                      },
                    ],
                  },
                  {
                    default: () => [
                      h(Input, {
                        'placeholder': '请输入部门名称',
                        'modelValue': formData.name,
                        'onUpdate:modelValue': (value: string) => {
                          formData.name = value;
                        },
                      }),
                    ],
                  }
                ),
                h(
                  Form.Item,
                  { label: '部门描述' },
                  {
                    default: () => [
                      h(Textarea, {
                        'placeholder': '请输入部门描述',
                        'modelValue': formData.description,
                        'onUpdate:modelValue': (value: string) => {
                          formData.description = value;
                        },
                      }),
                    ],
                  }
                ),
              ],
            }
          ),
        ]),
      onBeforeOk: async () => {
        try {
          // 调用表单校验
          const result = await formInstance.value?.validate();
          if (!result) {
            await updateDepart({
              id: nodeData.id,
              ...formData,
            });
            Message.success('更新成功');
            fetchTree(); // 刷新部门树
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
      onCancel: () => {
        formInstance.value?.resetFields();
      },
    });
  };

  const submitAdd = async (data: any) => {
    const { id, name, description, type } = data;
    const params = {
      currentDepartId: id,
      addDepart: {
        name,
        description,
      },
      type,
    };
    await addDepartByType(params);
  };
  // 添加上下级部门
  const addDepart = (type: 'up' | 'down', nodeData?: Depart) => {
    let currentDepartName = '';
    if (nodeData) {
      currentDepartName = nodeData.name;
    } else {
      currentDepartName = currentDepart.value.name;
    }
    const formData = reactive({
      currentDepart: currentDepartName,
      name: '',
      description: '',
    });
    const formInstance = ref<typeof Form | null>(null);
    Modal.open({
      title: type === 'up' ? '添加上级部门' : '添加下级部门',
      content: () =>
        h('div', [
          h(
            Form,
            {
              model: formData,
              ref: formInstance,
              labelColProps: { span: 6 },
              wrapperColProps: { span: 18 },
            },
            {
              default: () => [
                h(
                  Form.Item,
                  { label: '当前部门' },
                  {
                    default: () =>
                      h(Input, {
                        disabled: true,
                        modelValue: formData.currentDepart,
                      }),
                  }
                ),
                h(
                  Form.Item,
                  {
                    label: type === 'up' ? '上级部门名称' : '下级部门名称',
                    required: true,
                    field: 'name',
                    rules: [
                      {
                        required: true,
                        message: '请输入部门名称',
                      },
                    ],
                  },
                  {
                    default: () => [
                      h(Input, {
                        'placeholder': '请输入部门名称',
                        'modelValue': formData.name,
                        'onUpdate:modelValue': (value: string) => {
                          formData.name = value;
                        },
                      }),
                    ],
                  }
                ),
                h(
                  Form.Item,
                  { label: '部门描述' },
                  {
                    default: () => [
                      h(Textarea, {
                        'modelValue': formData.description,
                        'onUpdate:modelValue': (value: string) => {
                          formData.description = value;
                        },
                      }),
                    ],
                  }
                ),
              ],
            }
          ),
        ]),
      onBeforeOk: async () => {
        try {
          // 调用表单校验
          const result = await formInstance.value?.validate();
          if (!result) {
            const currentDepartId = nodeData
              ? nodeData.id
              : currentDepart.value.id;
            await submitAdd({
              id: currentDepartId,
              ...formData,
              type,
            });
            Message.success('添加成功');
            fetchTree();
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
      onCancel: () => {
        // 重置
        formInstance.value?.resetFields();
      },
    });
  };
  // 调整上下级关系
  const adjustDepart = (nodeData: Depart) => {
    const { id: childId, name } = nodeData;
    return useModelFrom({
      title: '调整上下级关系',
      modelValue: {
        childId,
        name,
        parentId: '',
      },
      fields: [
        {
          label: '当前部门',
          prop: 'name',
          fieldCopmProps: {
            readonly: true,
          },
        },
        {
          label: '变更到',
          prop: 'parentId',
          type: 'treeSelect',
          fieldCopmProps: {
            data: treeData,
            fieldNames: {
              children: 'children',
              key: 'id',
              title: 'name',
            },
          },
          rules: [{ required: true, message: '变更部门不能为空' }],
        },
      ],
      onBeforeValidateOk: async (done, modelValue) => {
        try {
          await adjustDepartment({
            departId: modelValue.childId,
            parentId: modelValue.parentId,
          });
          fetchTree();
          Message.success('调整成功');
          done(true);
        } catch (error) {
          done(false);
        }
      },
    });
  };
  // 删除部门
  const handleDepartDelete = (nodeData: Depart) => {
    Modal.confirm({
      title: '删除部门',
      content: '该部门下的所有子部门都将被删除，该部门下存在成员时无法删除',
      onBeforeOk: async () => {
        if (nodeData.id) {
          await deleteDepart(nodeData.id);
          await fetchTree();
          Message.success('删除部门成功');
          return true;
        }
        return false;
      },
    });
  };

  onMounted(() => {
    fetchTree();
  });
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    height: 100%;
    background-color: #fff;

    .container-depart {
      height: 100%;
      margin-right: 20px;
    }

    .container-right {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 20px;

      .container-right-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .container-right-header-title {
          color: #4080ff;
          font-size: 20px;
          font-weight: 600;
        }
      }

      .container-right-content {
        margin-top: 20px;
      }
    }
  }
</style>
