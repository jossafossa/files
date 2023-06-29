<template>
  <main>
    <Register
      v-if="state === 'register'"
      @register="register"
      :userID="userID"
    ></Register>
    <Connector v-if="state === 'connect'"></Connector>
    <Log :logs="logs"> </Log>
  </main>
</template>

<script setup>
import { ref } from "vue";
import Register from "@/components/Register.vue";
import Log from "@/components/Log.vue";
import connector from "@/assets/js/PeerConnector.js";
import Connector from "@/components/Connector.vue";

const state = ref("register");
const logs = ref([]);

// get initial values from query params
const params = new URLSearchParams(window.location.search);
const userID = ref(params.get("userID"));

const log = (message) => {
  logs.value.push(message);
};

connector.on("registered", (e) => (state.value = "connect"));
connector.on("connected", (e) => (state.value = "connected"));
connector.on("disconnect", (e) => (state.value = "register"));

connector.on("register", (name) => log(`registering as ${name}...`));
connector.on("registered", (e) => log(`registered as ${e.id}`));
connector.on("retry", (e) => log(`retrying connection`));
connector.on("registerError", (e) => log(e));
connector.on("error", (e) => log(e));
connector.on("connect", (name) => log(`connecting to ${name}...`));
connector.on("connected", (e) => log("connected"));
connector.on("disconnect", (e) => log("disconnected"));
</script>

<style lang="scss">
@import "@/assets/scss/global.scss";

main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
