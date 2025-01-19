<template>
  <router-view>
    <template #default="{ Component, route }">
      <!-- <transition name="fade" mode="out-in" appear>
        <component
          :is="Component"
          v-if="route.meta.ignoreCache"
          :key="route.fullPath"
        />
        <keep-alive v-else :include="cacheList">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition> -->
      <!-- v-if="route.meta.ignoreCache" -->

      <component :is="Component" :key="route.fullPath" />
    </template>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTabBarStore } from '@/store';

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less"></style>
