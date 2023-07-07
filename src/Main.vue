<template>
  <div class="main">
    <Setup v-if="state !== 'connected'"> </Setup>

    <Chat v-if="state === 'connected'"> </Chat>
    <!-- <Log :logs="logs"> </Log> -->

    <Log :logs="logs"></Log>
  </div>
</template>

<script setup>
import { ref } from "vue";
import connector from "@/assets/js/peerInstance.js";
import Setup from "@/components/Setup.vue";
import Chat from "@/components/Chat.vue";
import Log from "@/components/Log.vue";

const state = ref("login");
const logs = ref([]);

const log = (message, type = false) => {
  type = type ? `[${type}] ` : "";
  let log = `${type} ${message}`;
  logs.value.push(log);
  console.log(log);
};

// save session data on connect
// connector.on("connected", (e) => {
//   userID.value = connector.id;
//   targetID.value = connector.targetID;
// });

connector.on("login", (e) => (state.value = "connect"));
connector.on("logout", (e) => (state.value = "login"));
connector.on("data:handshake", (e) => (state.value = "connected"));
connector.on("disconnect", (e) => (state.value = "connect"));

connector.on("login", (e) => log(`login as ${e.id}`, "login"));
connector.on("retry", (e) => log(`retrying connection`, "retry"));
connector.on("loginError", (e) => log(e, "loginError"));
connector.on("error", (e) => log(e, "error"));
connector.on("connect", (name) => log(`connecting to ${name}...`, "connect"));
connector.on("connected", (e) => log("connected", "connected"));
connector.on("disconnect", (e) => log("disconnected", "disconnect"));
</script>

<style lang="scss">
@import "@/assets/scss/global.scss";

.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
