<template>
  <div class="container">
    <Breadcrumb :items="['数据字典', '代码仓库']" />
    <a-card class="general-card" title="代码仓库">
      <template #extra>
        <a-button type="primary" @click="handleAdd">新增</a-button>
      </template>
      <a-table :columns="columns" :data="tableData">
        <template #operation="{ record }">
          <a-space>
            <a-button @click="handleEdit(record)">编辑</a-button>
            <a-button>查看</a-button>
            <a-button status="danger" @click="handleDelete(record)"
              >删除</a-button
            >
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
  <a-modal
    v-model:visible="codeStoreDictVisible"
    :mask-closable="false"
    :title="ModalTitle"
    @ok="sendCreateModal"
  >
    <a-form :model="codeStoreForm" label-align="left">
      <a-form-item required field="name" label="仓库名称">
        <a-input v-model="codeStoreForm.name" />
      </a-form-item>
      <a-form-item field="type" label="仓库类型">
        <a-select v-model="codeStoreForm.type" placeholder="请选择">
          <a-option value="Git">Git</a-option>
          <a-option value="SVN">SVN</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="address" label="仓库地址">
        <a-input v-model="codeStoreForm.address" />
      </a-form-item>
      <a-form-item field="owner" label="所有者">
        <a-input v-model="codeStoreForm.owner" />
      </a-form-item>
      <a-form-item field="description" label="仓库描述">
        <a-input v-model="codeStoreForm.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import {
    createCodeStore,
    getCodeStore,
    deleteCodeStore,
    updateCodeStore,
  } from '@/api/code_store';
  import { onMounted, reactive, ref } from 'vue';
  import { CodeStoreBase, CodeStore } from '@/type/code_store';
  import { Message, Modal } from '@arco-design/web-vue';

  const codeStoreDictVisible = ref(false);
  const ModalTitle = ref('新建仓库');
  const isEdit = ref(false);
  const initialFormState = {
    name: '',
    description: '',
    type: '',
    address: '',
    owner: '',
  };
  const codeStoreForm = reactive<CodeStoreBase>({ ...initialFormState });
  const editId = ref<string | null>(null);

  const columns = [
    {
      title: '仓库名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '仓库类型',
      dataIndex: 'type',
    },
    {
      title: '仓库地址',
      dataIndex: 'address',
    },
    {
      title: '所有者',
      dataIndex: 'owner',
    },
    {
      title: '操作',
      slotName: 'operation',
    },
  ];
  const tableData = ref<CodeStore[]>([]);

  const fetchTable = async () => {
    const data = await getCodeStore();
    tableData.value = data.data;
  };
  onMounted(async () => {
    fetchTable();
  });

  const handleAdd = () => {
    ModalTitle.value = '新建仓库';
    isEdit.value = false;
    Object.assign(codeStoreForm, initialFormState);
    codeStoreDictVisible.value = true;
  };
  const handleEdit = (record: CodeStore) => {
    ModalTitle.value = '编辑仓库';
    isEdit.value = true;
    Object.assign(codeStoreForm, {
      name: record.name,
      description: record.description,
      type: record.type,
      address: record.address,
      owner: record.owner,
    });
    editId.value = record.id;
    codeStoreDictVisible.value = true;
  };

  // 删除
  const handleDelete = (record: CodeStore) => {
    Modal.warning({
      title: '确认删除',
      content: `确定要删除仓库 "${record.name}" 吗？`,
      onOk: async () => {
        try {
          await deleteCodeStore(record.id);
          Message.success('删除成功');
          fetchTable();
        } catch (error) {
          Message.error('删除失败');
        }
      },
    });
  };

  const sendCreateModal = async () => {
    try {
      if (isEdit.value) {
        await updateCodeStore(editId.value as string, {
          ...codeStoreForm,
        });
        Message.success('更新成功');
      } else {
        await createCodeStore({ ...codeStoreForm });
        Message.success('创建成功');
      }
    } catch (error: any) {
      Message.error(error.message);
    } finally {
      codeStoreDictVisible.value = false;
      fetchTable();
    }
  };
</script>

<!-- <script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script> -->

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
