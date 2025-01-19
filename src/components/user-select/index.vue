<template>
  <a-select v-model="modelRef" :multiple="multiple" placeholder="请选择">
    <a-option
      v-for="member in memberList"
      :key="member._id"
      :value="member._id"
    >
      {{ member.name }}
    </a-option>
  </a-select>
</template>

<script setup lang="ts">
  import { getMemberByPage } from '@/api/member';
  import { computed, ref } from 'vue';

  const memberList = ref<any[]>([]);
  const props = defineProps<{
    multiple?: boolean;
    modelValue: string | string[];
  }>();
  const emit = defineEmits<{
    (e: 'update:model-value', d?: string | string[]): void;
  }>();

  const modelRef = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emit('update:model-value', val);
    },
  });

  async function fetchMemberList() {
    const { data } = await getMemberByPage();
    memberList.value = data.list;
  }

  fetchMemberList();
</script>

<style lang="less" scoped></style>
