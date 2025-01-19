<template>
  <div class="card-layout">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .card-layout {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 16px;
    row-gap: 16px;
  }
</style>
