<template>
  <article class="chat">
    <picture class="is-blurry">
      <img src="@/assets/img/background.jpeg" alt="" />
    </picture>
    <header>
      <div class="container">
        <div class="header-container">
          <h2>
            <a :href="shareLink"> Chat with {{ ucfirst(connector.targetID) }} </a>
          </h2>
          <button class="button is-close is-white is-small" @click="connector.disconnect()"></button>
        </div>
      </div>
    </header>
    <section ref="messagesContainer">
      <div class="container">
        <div class="messages">
          <Message :message="message" v-for="(message, index) in messages" :key="index"></Message>
        </div>
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
import { ref, onMounted, watch } from "vue";
import ChatInput from "@/components/ChatInput.vue";
import Message from "@/components/Message.vue";

const messages = ref([]);
const messagesContainer = ref(null);
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

const ucfirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const scrollDown = () => {
  // scroll to bottom
  setTimeout(e => {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }, 20);
}
watch(messages.value, scrollDown);


connector.on("data:fileStart", (data) => {
  console.log('fileStart', data);
  messages.value.push({
    message: `Receiving file ${data.name}`,
    sender: connector.targetID,
    ...data,
    received: 0,
  });

});

connector.on("data:fileProgress", (e) => {
  const message = messages.value.find((m) => m.id === e.id);
  if (!message) return;
  message.received += 1;
});

connector.on("data:fileDone", (e) => {
  downloadFile(e);
});

connector.on("data:message", (data) => {
  console.log('message', data);
  messages.value.push({
    ...data,
    sender: connector.targetID,
  });
});

connector.on('data:messageSent', (data) => {
  console.log('message', data);
  messages.value.push({
    ...data,
    sender: 'me',
  });
});


// setup
</script>

<style lang="scss" scoped>
.chat {
  height: 100dvh;
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
    backdrop-filter: var(--content-blur);

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  >section {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
  }

  >footer {
    padding: 1rem 0;
    background-color: var(--color-white-50);
    backdrop-filter: var(--content-blur);
  }

  .messages {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }
}
</style>
