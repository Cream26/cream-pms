<template>
  <component :is="componentToRender" v-bind="$attrs" />
</template>

<script setup lang="ts" name="ext-custom">
  import { computed } from 'vue';

  defineOptions({
    name: 'ExtCustom',
    inheritAttrs: false,
  });

  const modelValue = defineModel<any>();

  interface Props {
    render?: ({
      value,
      change,
    }: {
      value: any;
      change: (e: any) => void;
    }) => any;
  }

  const props = defineProps<Props>();

  const componentToRender = computed(() => {
    if (typeof props.render === 'function') {
      return {
        render: () => {
          if (!props.render) return null;
          return props.render({
            value: modelValue.value,
            change: (e: any) => {
              modelValue.value = e;
            },
          });
        },
      };
    }
    return props.render;
  });
</script>
