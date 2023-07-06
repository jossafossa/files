<template>
  <article class="chat">
    <picture class="is-blurry">
      <img src="@/assets/img/background.jpeg" alt="">
    </picture>
    <header>
      <div class="container">
        <h2>
          <a :href="shareLink"> Chat {{ connector.targetID }} </a>
        </h2>
        <button @click="connector.disconnect()">x</button>
      </div>
    </header>
    <section>
      <div class="container">
        <stack vertical>
          <div class="messages" v-for="message in messages">
            <div class="message">
              <h2>{{ message.message }}</h2>
              <hr />
              <span>From: {{ message.sender }}</span>
              <progress v-if="message?.total" :value="message?.received" :max="message?.total"></progress>
            </div>
          </div>
        </stack>
      </div>
    </section>
    <footer>
      <div class="container">
        <ChatInput> </ChatInput>
      </div>
    </footer>
  </article>
</template>

<script setup>
import connector from "@/assets/js/peerInstance.js";
import { ref } from "vue";
import ChatInput from "@/components/ChatInput.vue";
import stack from "@/components/stack.vue";

const messages = ref([]);
let shareLink = ref("");

// get base url without query params
let url = window.location.origin + window.location.pathname;

// add userID and targetID to url
const params = new URLSearchParams(window.location.search);
params.set("userID", connector.userID);
params.set("targetID", connector.targetID);
shareLink.value = `${url}?${params.toString()}`;

const downloadFile = ({ file, name, size }) => {
  const url = window.URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
};

const formatBytes = (size) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
};

connector.on("data:chunk", (e) => {
  console.log(e);
  if (e.order === 0) {
    messages.value.push({
      message: `Receiving file ${e.name} (${formatBytes(e.size)})`,
      sender: connector.targetID,
      id: e.id,
      total: e.total,
      received: 0,
    });
  }

  const message = messages.value.find((m) => m.id === e.id);
  message.received += 1;
});

connector.on("data:file", (e) => {
  downloadFile(e);
});

connector.on("data:message", (e) => {
  messages.value.push({
    message: e.message,
    sender: connector.targetID,
  });
});

// setup
</script>

<style lang="scss" scoped>
.chat {
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: whitesmoke;
  position: relative;
  isolation: isolate;

  >picture {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }

  >header {
    padding: 1rem 0;
    background-color: var(--color-white-50);
  }

  >section {
    flex: 1;
    padding: 1rem 0;
  }

  >footer {
    padding: 1rem 0;
    background-color: var(--color-secondary);
  }
}
</style>
