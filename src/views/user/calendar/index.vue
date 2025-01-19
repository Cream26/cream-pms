<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.setting']" />
    <a-card title="我的日历">
      <!-- <a-calendar v-model="calendar" /> -->
      <AntConfigProvider :locale="zhCN">
        <AntCalendar v-model:value="value" class="user-calendar">
          <template #dateCellRender="{ current }">
            <ul class="events">
              <li v-for="item in getListData(current)" :key="item.content">
                <!-- <a-badge :status="item.type" :text="item.content" /> -->
                {{ item.content }}
              </li>
            </ul>
          </template>
          <template #monthCellRender="{ current }">
            <div v-if="getMonthData(current)" class="notes-month">
              <section>{{ getMonthData(current) }}</section>
              <span>Backlog number</span>
            </div>
          </template>
        </AntCalendar>
      </AntConfigProvider>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import 'dayjs/locale/zh-cn';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';

  dayjs.locale('zh-cn');

  const value = ref<Dayjs>();

  const getListData = (value: Dayjs) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: '宝石花' },
          { type: 'success', content: '上海电器' },
        ];
        break;
      case 10:
        listData = [
          { type: 'warning', content: '宝石花' },
          { type: 'success', content: '上海电器' },
        ];
        break;
      case 15:
        listData = [
          { type: 'warning', content: '宝石花' },
          { type: 'success', content: '上海电器' },
        ];
        break;
      default:
    }
    return listData || [];
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
    return 0;
  };
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
  .user-calendar {
    // border: 1px solid rgba(5, 5, 5, 0.06);
  }
</style>
