<template>
  <a-tag color="blue" size="small">
    <template #icon>
      <icon-user />
    </template>
    {{ name }}
  </a-tag>
</template>

<script setup lang="ts">
  defineProps<{
    id: string;
    name: string;
  }>();
</script>

<script lang="ts">
  export default {
    name: 'UserTag',
  };
</script>

<style lang="less" scoped></style>
