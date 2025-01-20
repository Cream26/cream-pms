<template>
  <div class="depart-select">
    <a-tree-select
      v-model="departModel"
      :data="departList"
      show-line
      :field-names="{
        key: 'id',
        title: 'name',
        children: 'children',
      }"
    >
    </a-tree-select>
  </div>
</template>

<script setup lang="ts" name="depart-select">
  import { onMounted, ref } from 'vue';
  import { getDepartTreeById } from '@/api/depart';
  import { Depart } from '@/type/depart';

  const departList = ref<Depart[]>([]);

  const departModel = defineModel<string>();
  const props = defineProps<{
    id?: string;
  }>();

  onMounted(() => {
    getDepartTreeById(props.id).then((res) => {
      departList.value = res.data;
    });
  });

  defineOptions({
    name: 'UserSelect',
  });
</script>

<style lang="less">
  .depart-select {
    width: 100%;
  }
</style>
