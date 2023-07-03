<template>
  <div class="vstack" :class="{
    'vertical': vertical,
  }">
    <slot></slot>
  </div>
</template>


<script setup>
import { defineProps } from "vue";

const props = defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.vstack {
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  &.vertical {
    flex-direction: column;
  }

}
</style>
