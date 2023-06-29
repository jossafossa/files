<template>
  <article class="chatroom">
    <section class="chatarea" ref="chatarea">
      <div class="messages" v-if="messages.length > 0">
        <TextMessage v-for="(message, index) in messages" :key="index" class="message" :message="message">
          {{ message }}
        </TextMessage>
      </div>
    </section>

    <footer class="chatform">
      <form @submit.prevent="send">
        <input name="message" v-model="messageRef" type="text" placeholder="Type your message here" />
        <button>Send</button>
      </form>
    </footer>
  </article>
</template>

<script setup>
import TextMessage from "@/components/TextMessage.vue";
import chatSystem from "@/assets/js/ChatSystem";
import { defineEmits, defineProps, ref, watch } from "vue";

// props
// --------------------------------------------------------
const props = defineProps({
  connection: {
    type: Object,
    required: true,
  },
});

// emits
// --------------------------------------------------------
const emit = defineEmits(["disconnect"]);

// data
// --------------------------------------------------------
const chatarea = ref(null);
const messageRef = ref("");
const connection = props.connection;

console.log(connection);

const messages = ref([
  // {
  //   sender: 'me',
  //   message: 'Hello World!',
  //   type: 'text',
  //   timestamp: Date.now() - 1000000,
  // },
  // {
  //   sender: 'me',
  //   message: 'Hello World! This is a longer message to test the wrapping of the text. This message is not long enough so a bit more text',
  //   type: 'text',
  //   timestamp: Date.now() - 10000
  // },
  // {
  //   sender: 'hansi',
  //   message: 'This is a message from hansi. Hansi is not me. I am me. I\'m sorry for the confusion. ',
  //   type: 'text',
  //   external: true,
  //   timestamp: Date.now()
  // },
]);

// methods
// ---------------------------------------------------------------------------------------------------------------
chatSystem.setConnection(connection);

// watch
watch(messages.value, async (newMessages, oldMessages) => {
  const chatareaElement = chatarea.value;
  const chatareaHeight = chatareaElement.clientHeight;
  const chatareaScrollHeight = chatareaElement.scrollHeight;
  const chatareaScrollTop = chatareaElement.scrollTop;

  if (chatareaScrollHeight - chatareaScrollTop === chatareaHeight) {
    chatareaElement.scrollTop = chatareaScrollHeight;
  }
});

const pushMessage = (message, sender = "me") => {
  messages.value.push({
    sender,
    message,
    type: "text",
    timestamp: Date.now(),
  });
};

const send = () => {
  if (messageRef.value.length > 0) {
    chatSystem.sendMessage(messageRef.value);
    messageRef.value = "";
    console.log("set value to empty string");
  }
};

// watch for incoming messages
chatSystem.on("data", (data) => {
  console.log("data received", data);
  pushMessage(data, connection.peer);
});

chatSystem.on("message", (message) => {
  console.log("message send", message);
  pushMessage(message);
});

chatSystem.on("disconnected", (error) => {
  console.log("disconnected", error);
  emit("disconnect");
});

// // DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
// // --------------------------------------------------------
// const randomMessage = () => {
//   const dummyMessages = [
//     'Hello World!',
//     'This is a longer message to test the wrapping of the text. This message is not long enough so a bit more text',
//     'This is a message from hansi. Hansi is not me. I am me. I\'m sorry for the confusion. ',
//     'Another random message',
//     'One more message, just for fun',
//     'Do you like this chat app?',
//     'I hope you do',
//     'I\'m not sure if I like it',
//     'DO YOU LIKE IT?',
//     'WHY ARE YOU YELLING? I\'M NOT YELLING! YOU\'RE YELLING! POOR COMMUNICATION SKILLS! STOP YELLING! NOOOOO YOU\'RE YELLING AGA'
//   ];

//   // a list of 50 of the most common unqiue boy names in the netherlands
//   const senders = ['hansi', 'me', 'hans', 'piet', 'jan', 'kees', 'peter', 'henk', 'frank', 'wim', 'martin', 'mark', 'robert', 'david', 'jeroen', 'michael', 'dennis', 'johan', 'arnold', 'frederik', 'jordi', 'jordy', 'jord', 'joris', 'jorik', 'jorn', 'jorrit']

//   const sender = senders[Math.floor(Math.random() * senders.length)];

//   const message = {
//     sender,
//     message: dummyMessages[Math.floor(Math.random() * dummyMessages.length)],
//     type: 'text',
//     timestamp: Date.now(),
//   };

//   if (sender === 'hansi') {
//     message.external = true;
//   }

//   messages.value.push(message);

//   // add another message in 1 to 3 seconds
//   setTimeout(randomMessage, Math.floor(Math.random() * 3000) + 1000);
// }

// randomMessage();
// // --------------------------------------------------------
// // END DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
</script>

<style lang="scss" scoped>
.chatroom {
  display: flex;
  flex-direction: column;
  background-color: rgb(20, 20, 30);
  width: 100vw;
  height: 100vh;

  >section {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }

  >footer {
    margin: 1rem;
    background-color: white;
    border-radius: 0.5rem;

    >form {
      display: flex;

      >input {
        flex: 1;
      }
    }
  }
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
</style>
