<template>
  <div class="project-form-modal">
    <a-modal
      v-model:visible="projectModalVisible"
      title="新建项目"
      :mask-closable="false"
      @before-ok="sendCreateModal"
    >
      <a-form
        ref="projectFormRef"
        auto-label-width
        :model="projectForm"
        label-align="left"
      >
        <a-form-item
          asterisk-position="end"
          required
          field="name"
          label="项目名称"
        >
          <a-input v-model="projectForm.name" placeholder="请输入项目名称" />
        </a-form-item>
        <a-form-item asterisk-position="end" required field="pmUser" label="PM">
          <!-- <a-select v-model="projectForm.pmUser" placeholder="请选择">
            <a-option
              v-for="member in memberList"
              :key="member._id"
              :value="member._id"
            >
              {{ member.name }}
            </a-option>
          </a-select> -->
          <User-select v-model="projectForm.pmUser"></User-select>
        </a-form-item>
        <a-form-item field="post" label="前端负责人">
          <!-- <a-select v-model="projectForm.feUser" placeholder="请选择">
            <a-option
              v-for="member in memberList"
              :key="member._id"
              :value="member._id"
            >
              {{ member.name }}
            </a-option>
          </a-select> -->
          <User-select v-model="projectForm.feUser"></User-select>
        </a-form-item>
        <a-form-item field="post" label="后端负责人">
          <!-- <a-select v-model="projectForm.beUser" placeholder="请选择">
            <a-option
              v-for="member in memberList"
              :key="member._id"
              :value="member._id"
            >
              {{ member.name }}
            </a-option>
          </a-select> -->
          <User-select v-model="projectForm.beUser"></User-select>
        </a-form-item>
        <a-form-item field="name" label="项目环境配置">
          <a-input
            v-model="projectForm.envLink"
            placeholder="vpn host 相关环境配置"
          >
            <template #suffix>
              <icon-link />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { cloneDeep } from 'lodash';

  const props = defineProps<{
    visible?: boolean;
    form: Record<string, any>;
  }>();

  const projectForm = ref<any>({});

  const emit = defineEmits<{
    (e: 'update:visible', d: boolean): void;
    (e: 'confirm', d: any): void;
  }>();
  const projectModalVisible = computed({
    get() {
      return !!props.visible;
    },
    set(d) {
      emit('update:visible', d);
    },
  });

  watch(
    () => props.visible,
    (val) => {
      if (val) {
        projectForm.value = cloneDeep(props.form);
      }
    }
  );
  const projectFormRef = ref();
  function sendCreateModal(done: any) {
    projectFormRef.value.validate(async (error: any) => {
      if (!error) {
        emit('confirm', projectForm.value);
        done(true);
      }
    });
  }
</script>

<style lang="less" scoped>
  .project-form-modal {
  }
</style>
