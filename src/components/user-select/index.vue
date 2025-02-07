<template>
  <div class="user-select">
    <a-select
      v-model="modelRef"
      :multiple="multiple"
      placeholder="请选择"
      class="w-full"
    >
      <a-option
        v-for="member in memberList"
        :key="member.id"
        :value="member.id"
      >
        {{ member.name }}
      </a-option>
    </a-select>
  </div>
</template>

<script setup lang="ts" name="user-select">
  import { ref, onMounted } from 'vue';
  import { getAllUser } from '@/api/user';

  const memberList = ref<any[]>([]);

  const modelRef = defineModel<string | string[]>();

  const props = defineProps<{
    multiple?: boolean;
  }>();

  async function fetchMemberList() {
    const res = await getAllUser();
    memberList.value = res.data;
  }
  onMounted(() => {
    fetchMemberList();
  });

  // 添加组件名称
  defineOptions({
    name: 'UserSelect',
  });
</script>

<style lang="less">
  .user-select {
    width: 100%;
  }
</style>
