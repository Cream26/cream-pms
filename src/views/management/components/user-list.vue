<template>
  <div class="user-list">
    <a-card :bordered="false">
      <template #title>
        <a-row :gutter="16" class="action-row" justify="space-between">
          <!-- 添加用户 -->
          <a-col :span="4">
            <a-button type="primary">添加用户</a-button>
          </a-col>
          <!-- 查找 -->
          <a-col flex="300px">
            <a-space>
              <a-input-search
                v-model:searchValue="searchValue"
                :style="{ width: '320px' }"
                placeholder="请输入搜索内容"
                search-button
              />
              <a-button type="text">
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
        <a-table :columns="columns" />
      </a-spin>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';

  // 控制表格的loading
  const loading = ref(false);

  const searchValue = ref();

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
      dataIndex: 'department',
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
    },
    {
      title: '操作',
      slotName: 'action',
    },
  ];
</script>

<style scoped lang="less">
  .user-list {
  }
</style>
