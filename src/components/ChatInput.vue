<template>
  <div class="chat-input">
    <textarea
      v-model="message"
      placeholder="message"
      @keyup.ctrl.enter="sendMessage(message)"
      @keyup.meta.enter="sendMessage(message)"
      rows="3"
    />
    <input type="file" @change="sendFiles" />
    <button class="button" @click="sendMessage(message)">Send</button>
  </div>
</template>

<script setup>
import connector from "@/assets/js/peerInstance.js";
import { ref } from "vue";

const message = ref("");

const sendFiles = (e) => {
  const file = e.target.files[0];
  connector.sendFile(file);
};

const sendMessage = (message) => {
  connector.sendMessage(message);
  messages.value.push({
    message: message,
    sender: connector.userID,
  });
};
</script>

<style lang="scss" scoped>
.chat-input {
  display: flex;
  gap: 1rem;

  > textarea {
    flex: 1;
  }
}
</style>
