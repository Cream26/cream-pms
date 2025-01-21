<template>
  <div class="user-list">
    <a-card :bordered="false">
      <template #title>
        <a-row :gutter="16" class="action-row" justify="space-between">
          <!-- 添加用户 -->
          <a-col :span="4">
            <a-button type="primary" @click="() => showModel()"
              >添加用户</a-button
            >
          </a-col>
          <!-- 查找 -->
          <a-col flex="300px">
            <a-space>
              <a-input-search
                v-model="searchValue"
                :style="{ width: '320px' }"
                placeholder="请输入搜索内容"
                search-button
                @search="handleSearch"
                @keydown.enter="handleSearch"
              />
              <a-button type="text" @click="handleReset">
                重置
                <template #icon>
                  <icon-refresh />
                </template>
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>
      <a-spin dot :loading="loading" style="width: 100%">
        <a-table
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          @page-change="onPaginationChange({ page: $event })"
          @page-size-change="onPaginationChange({ pageSize: $event })"
        >
          <template #depart="{ record }">
            <a-tag v-if="record.depart?.name">{{ record.depart.name }}</a-tag>
            <span v-else></span>
          </template>
          <template #status="{ record }">
            <a-switch
              v-model="record.status"
              :checked-value="1"
              :unchecked-value="0"
              @change="(value) => handleStatusChange(Number(value), record)"
            />
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="showModel(record)">
                编辑
              </a-button>
              <a-button
                type="text"
                status="danger"
                size="small"
                @click="handleDelete(record)"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import {
    Message,
    PaginationProps,
    TableColumnData,
    Modal,
  } from '@arco-design/web-vue';
  import { Depart } from '@/type/depart';
  import { User, UserData } from '@/type/user';
  import useModelFrom from '@/utils/form';
  import {
    createUser,
    getUserList,
    updateUserStatus,
    deleteUser,
    updateUser,
  } from '@/api/user';
  import { ExtFormFieldItem } from '@/components/ext/type';

  const props = defineProps<{
    currentDepart: Depart;
  }>();

  const pageSizeDefault = 10;
  const pagination = ref<PaginationProps>({
    current: 1,
    pageSize: pageSizeDefault,
    total: 0,
    showTotal: true,
  });
  const tableData = ref([]);

  // 控制表格的loading
  const loading = ref(false);

  const searchValue = ref<string>('');

  const columns: TableColumnData[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '部门',
      dataIndex: 'depart',
      slotName: 'depart',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '操作',
      slotName: 'operations',
      width: 160,
      fixed: 'right',
    },
  ];
  // 获取数据
  const fetchData = async () => {
    loading.value = true;
    try {
      const params = {
        search: searchValue.value || '',
        page: pagination.value.current || 1,
        pageSize: pagination.value.pageSize || pageSizeDefault,
        departId: props.currentDepart?.id || null,
      };
      const res = await getUserList(params);
      tableData.value = res.data.list;
      pagination.value.total = res.data.total;
    } catch (error: any) {
      Message.error(error.message);
    } finally {
      loading.value = false;
    }
  };
  watch(
    () => props.currentDepart.id,
    async () => {
      pagination.value.current = 1;
      searchValue.value = '';
      await fetchData();
    }
  );

  // 搜索
  const handleSearch = async () => {
    pagination.value.current = 1;
    await fetchData();
  };
  // 重置
  const handleReset = async () => {
    searchValue.value = '';
    await fetchData();
  };

  // 添加修改用户
  const showModel = (record?: UserData) => {
    const formData = ref({
      name: record?.name || '',
      account: record?.account || '',
      password: '',
      phone: record?.phone || '',
      email: record?.email || '',
      status: record?.status ?? 1,
      departId: record?.depart?.id || '',
    });
    const isEdit = !!record?.name;
    const fields = [
      {
        label: '用户名',
        prop: 'name',
        rules: [{ required: true, message: '请输入用户名' }],
      },
      {
        label: '账号',
        prop: 'account',
        rules: [{ required: true, message: '请输入账号' }],
        fieldCopmProps: {
          readonly: isEdit,
        },
      },
      {
        label: '部门',
        prop: 'departId',
        type: 'departSelect',
        fieldCopmProps: {
          id: props.currentDepart.id,
        },
        rules: [{ required: true, message: '请选择部门' }],
      },
      {
        label: '手机号',
        prop: 'phone',
        rules: [
          { required: false, message: '电话不能为空' },
          {
            match: /^1[3-9]\d{9}$/,
            message: '电话格式不正确',
          },
        ],
      },
      {
        label: '邮箱',
        prop: 'email',
        rules: [{ required: false, message: '邮箱不能为空' }],
      },
    ];
    const passwordField = {
      label: '密码',
      prop: 'password',
      rules: [{ required: true, message: '请输入密码' }],
    };
    if (!isEdit) {
      fields.splice(2, 0, passwordField);
    }

    return useModelFrom({
      title: isEdit ? '编辑用户' : '添加用户',
      modelValue: formData,
      fields: fields as ExtFormFieldItem[],
      onBeforeValidateOk: async (done, modelValue) => {
        try {
          if (isEdit) {
            const { password, ...updateData } = modelValue as User;
            await updateUser(record.id, updateData);
            Message.success('更新成功');
          } else {
            await createUser(modelValue as User);
            Message.success('创建成功');
          }
          fetchData();
          done(true);
        } catch (error) {
          done(false);
        }
      },
    });
  };

  // 改变状态
  const handleStatusChange = async (value: number, record: UserData) => {
    try {
      await updateUserStatus(record.id, value);
      Message.success('修改状态成功');
    } catch (error: any) {
      // 如果失败，恢复原来的状态
      record.status = value ? 0 : 1;
      Message.error(error.message || '修改状态失败');
    }
  };
  // 删除用户
  const handleDelete = async (record: UserData) => {
    Modal.confirm({
      title: '提示',
      content: '确定删除该用户吗？',
      onOk: async () => {
        await deleteUser(record.id);
        Message.success('删除成功');
        fetchData();
      },
    });
  };

  function onPaginationChange({
    page,
    pageSize,
  }: {
    page?: number;
    pageSize?: number;
  }) {
    if (page) pagination.value.current = page;
    if (pageSize) pagination.value.pageSize = pageSize;
    fetchData();
  }
  onMounted(() => {
    fetchData();
  });
</script>

<style scoped lang="less">
  .user-list {
  }
</style>
