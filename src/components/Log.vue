<template>
  <div @click="close()" class="container" :class="{ 'is-active': active }">
    <div class="logs">
      <span v-for="(log, index) in logs" :key="index">
        {{ log }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps({
  logs: {
    type: Array,
    required: true,
  },
});

const active = ref(false);
let timeout = null;

// when logs change, reset closed
watch(props.logs, () => open());

const open = () => {
  clearTimeout(timeout);
  active.value = true;
  timeout = setTimeout(() => {
    active.value = false;
  }, 5000);
};

const close = () => {
  clearTimeout(timeout);
  active.value = false;
};
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  backgound-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 100;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;

  &.is-active {
    display: flex;
  }
}

.logs {
  display: flex;
  flex-direction: column;
  max-width: 500px;
}
</style>
