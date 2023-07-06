<template>
  <article class="card-modal">
    <header>
      <slot name="header"></slot>
    </header>

    <section>
      <slot></slot>
    </section>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.card-modal {
  --padding-x: 1.5rem;
  --padding-y: 1.5rem;
  min-width: 300px;

  --padding: var(--padding-y) var(--padding-x);
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(3rem);

  >header {
    padding: 1rem var(--padding-x);
  }

  >section {
    padding: var(--padding);
    border: 1px solid var(--color-white-50);
    border-width: 1px 0;
  }

  >footer {
    padding: 1rem var(--padding-x);
  }
}
</style>