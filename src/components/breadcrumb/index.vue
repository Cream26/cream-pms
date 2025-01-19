<template>
  <a-breadcrumb class="container-breadcrumb">
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <a-breadcrumb-item
      v-for="item in items"
      :key="item"
      @click="handlerClick(item)"
    >
      {{ item.label || item }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  defineProps({
    items: {
      type: Array as PropType<string[] | any[]>,
      default() {
        return [];
      },
    },
  });

  function handlerClick(item: any) {
    if (item.click) {
      item.click();
    }
  }
</script>

<style scoped lang="less">
  .container-breadcrumb {
    margin: 16px 0;
    :deep(.arco-breadcrumb-item) {
      cursor: pointer;
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
</style>
