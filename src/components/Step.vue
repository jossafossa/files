<template>
  <div class="step">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.step {
  background-color: #f5f5f5;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  color: black;
  width: 100%;
  margin: 1rem;
  max-width: 400px;
  margin: auto;
}
</style>
