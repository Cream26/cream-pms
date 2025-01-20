import { ExtFormFieldItem } from '@/components/ext/type';
import { Modal, ModalConfig } from '@arco-design/web-vue';
import { h, ref } from 'vue';
import ExtForm from '@/components/ext/form/ext-form.vue';

type UseModelFromOptions = Omit<ModalConfig, 'content'> & {
  'title'?: string;
  'content'?: ModalConfig['content'];
  'fields'?: ExtFormFieldItem[];
  'modelValue'?: Record<string, any>;
  'onUpdate:modelValue'?: (val: Record<string, any>) => void;
  'onBeforeValidateOk'?: (
    done: (value: boolean) => void,
    modelValue: Record<string, any>
  ) => void;
};
export default function useModelFrom(options: UseModelFromOptions) {
  const formRef = ref<InstanceType<typeof ExtForm>>();
  const modelValue = ref<Record<string, any>>(options.modelValue || {});
  return Modal.open({
    title: '编辑用户',
    content() {
      return h(ExtForm, {
        'ref': formRef,
        'fields': options.fields,
        'modelValue': modelValue.value,
        'onUpdate:modelValue': (val: Record<string, any>) => {
          modelValue.value = val;
          options['onUpdate:modelValue']?.(val);
        },
      });
    },
    onBeforeOk(done) {
      formRef.value?.validate((error) => {
        if (!error) {
          options.onBeforeValidateOk?.(done, modelValue.value);
        } else {
          done(false);
        }
      });
    },
    ...options,
  });
}
