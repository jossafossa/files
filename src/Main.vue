<template>
  <div class="main">
    <Setup v-if="state !== 'connected'"> </Setup>

    <Chat v-if="state === 'connected'"> </Chat>

    <!-- <Log :logs="errors"> </Log> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import connector from "@/assets/js/peerInstance.js";
import Setup from "@/components/Setup.vue";
import Chat from "@/components/Chat.vue";
import Log from "@/components/Log.vue";

const state = ref("login");
connector.on("state", (e) => {
  console.log('state changed to ', e);
  state.value = e;
});
const logs = ref([]);
const errors = ref([]);

const formatLog = (message, type = false) => {
  type = type ? `[${type}]` : "";
  return [type, message];
};

const errorLog = (message, type = false) => {
  console.log(...formatLog(type, message));
  errors.value.push(formatLog(type, message).join(" "));
};

const log = (message, type = false) => {
  console.log(...formatLog(type, message));
};

const removeQueryParam = (param) => {
  const url = new URL(window.location.href);

  // if url contains force bail
  if (url.searchParams.has("force")) return;

  url.searchParams.delete(param);
  window.history.replaceState({}, "", url);
};

// remove userID from url on connect
connector.on("login", (e) => removeQueryParam("userID"));
connector.on("connected", (e) => removeQueryParam("targetID"));

connector.on("login", (e) => log(`login as ${e.id}`, "login"));
connector.on("logout", (e) => log(`logout`, "logout"));
connector.on("retry", (e) => log(`retrying connection`, "retry"));
connector.on("loginError", (e) => errorLog(e, "loginError"));
connector.on("error", (e) => errorLog(e, "error"));
connector.on("connect", (name) => log(`connecting to ${name}...`, "connect"));
connector.on("connected", (e) => log("connected", "connected"));
connector.on("disconnect", (e) => errorLog("disconnect", "disconnected"));
connector.on("data:handshake", (e) => log("handshake", e));
// connector.on("data", (e) => log("data", e));
</script>

<style lang="scss">
@import "@/assets/scss/global.scss";

.main {
  width: 100vw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
