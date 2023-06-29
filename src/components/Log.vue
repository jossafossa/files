<template>
  <div class="logs">
    <span v-for="(log, index) in logs" :key="index">
      {{ log }}
    </span>
  </div>
</template>

<script setup>

  import { defineProps } from 'vue';

  const props = defineProps({
    logs: {
      type: Array,
      required: true,
    },
  });

</script>

<style lang="scss" scoped>
  .logs {
    padding:1rem;
    background-color:rgb(20,20,30);
    border-radius: 1rem;
    color:white;
    font-family: monospace;
    display: flex;
    flex-direction: column;
    gap: .5rem;

    &:empty {
      display: none;
    }
  }
</style>