<template>
  <Step>
    <stack vertical>
      <stack horizontal>
        <h2>Chat with {{ connector.targetID }}</h2>
        <button @click="connector.disconnect()">x</button>
      </stack>

      <div class="messages" v-for="message in messages">
        <div class="message">
          <h2>{{ message.message }}</h2>
          <hr />
          <span>From: {{ message.sender }}</span>
          <progress
            v-if="message?.total"
            :value="message?.received"
            :max="message?.total"
          ></progress>
        </div>
      </div>

      <textarea
        v-model="message"
        placeholder="message"
        @keyup.ctrl.enter="sendMessage(message)"
        @keyup.meta.enter="sendMessage(message)"
        rows="5"
      />
      <button @click="sendMessage(message)">Send</button>

      <input type="file" @change="sendFiles" />
    </stack>
  </Step>
</template>

<script setup>
import connector from "@/assets/js/PeerConnector.js";
import { ref } from "vue";
import Step from "@/components/Step.vue";
import stack from "@/components/stack.vue";

const message = ref("");
const messages = ref([]);

const downloadFile = ({ data, name, size }) => {
  const blob = new Blob([data], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
};

const sendFiles = (e) => {
  const file = e.target.files[0];
  connector.sendFile(file);
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

const sendMessage = (message) => {
  connector.sendMessage(message);
  messages.value.push({
    message: message,
    sender: connector.userID,
  });
};

// setup
</script>

<style lang="scss" scoped></style>
