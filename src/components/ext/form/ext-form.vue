<template>
  <a-form ref="formRef" auto-label-width :model="modelValue" :rules="rules">
    <a-form-item
      v-for="field in fields"
      :key="field.prop"
      :label="field.label"
      :field="field.prop"
    >
      <component
        :is="getRenderComp(field.type)"
        v-bind="field.fieldCopmProps"
        v-model="modelValue[field.prop]"
      >
      </component>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { FieldRule, FormInstance } from '@arco-design/web-vue';
  import { ExtSubformFieldItem } from '../type';
  import getRenderComp from '../index';

  const props = withDefaults(
    defineProps<{
      fields?: Array<ExtSubformFieldItem>;
    }>(),
    {
      fields: () => [],
    }
  );

  const rules = computed(() => {
    return props.fields.reduce<Record<string, FieldRule[]>>((acc, cur) => {
      acc[cur.prop] = cur.rules || [];
      return acc;
    }, {});
  });

  const modelValue = defineModel<Record<string, any>>({
    default: () => ({}),
  });

  const formRef = ref<FormInstance>();
  defineExpose({
    validate(...args: Parameters<FormInstance['validate']>) {
      return formRef.value?.validate(...args);
    },
  });
</script>

<style scoped></style>
