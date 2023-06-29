<template>
  <article class="message" :class="{
    'is-external': external
  }">
    <header>
      <span :style="{ 'color': hashedColor(from) }">
        {{ from }}
      </span>
    </header>

    <section>
      <p>
        {{ message }}
      </p>
    </section>

    <footer>
      <span>
        {{ formatTimestamp(timestamp, now) }}
      </span>
    </footer>

  </article>
</template>

<script setup>

import { defineProps, ref } from 'vue';
import { hashedColor } from '@/assets/js/utils.js';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const from = ref(props.message.sender);
const message = ref(props.message.message);
const timestamp = ref(props.message.timestamp);
const external = ref(props.message.sender === 'me' ? false : true);

const now = ref(new Date());

// keep updating now every second
setInterval(() => {
  now.value = new Date();
}, 1000);



/**
 * Returns a string representation of the time elapsed between a given timestamp and now.
 * @param {number} timestamp - The timestamp to format.
 * @param {Date} now - The current date and time.
 * @returns {string} A string representing the time elapsed between the timestamp and now.
 */
const formatTimestamp = (timestamp, now = new Date()) => {
  const diff = now.getTime() - timestamp;

  // Define the time intervals in milliseconds, along with their labels and durations.
  const intervals = [
    { label: 'year', duration: 365 * 24 * 60 * 60 * 1000 },
    { label: 'month', duration: 30 * 24 * 60 * 60 * 1000 },
    { label: 'week', duration: 7 * 24 * 60 * 60 * 1000 },
    { label: 'day', duration: 24 * 60 * 60 * 1000 },
    { label: 'hour', duration: 60 * 60 * 1000 },
    { label: 'minute', duration: 60 * 1000 },
    { label: 'second', duration: 1000 }
  ];

  // Loop through the time intervals and return the appropriate string.
  for (const { label, duration } of intervals) {
    if (diff >= duration) {
      const count = Math.floor(diff / duration);
      return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  // If the timestamp is less than a second ago, return "just now".
  return 'just now';
};

</script>

<style lang="scss" scoped>
.message {
  background-color: white;
  border-radius: .5rem;
  display: inline-flex;
  flex-direction: column;
  border-end-start-radius: 0;
  padding: .5rem;
  min-width: 500px;
  max-width: calc(100vw - 10rem);
  position: relative;
  animation: messageEnter .5s ease;

  @keyframes messageEnter {
    from {
      opacity: 0;
      transform: translateY(.5rem);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:before {
    --size: .25rem;
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    border: var(--size) solid transparent;
    border-color: transparent white white transparent;
    transform: translate(-100%, 0);
  }

  * {
    margin: 0;
    line-height: 1;
  }

  >header {
    display: flex;
    justify-content: space-between;
    font-size: 80%;
    font-weight: bold;
    margin-bottom: .5rem;
  }

  >section>p {
    line-height: 1.3;
  }

  >footer {
    font-size: 70%;
    align-self: flex-end;
    font-weight: medium;
    opacity: .5;
  }

  &.is-external {
    align-self: flex-end;
    border-radius: .5rem;
    border-end-end-radius: 0;

    // move the arrow to the right
    &:before {
      transform: translate(100%, 0) rotate(90deg);
      right: 0;
      left: auto;

    }
  }
}
</style>