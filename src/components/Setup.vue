<template>
  <div class="setup">
    <picture class="is-blurry">
      <img src="@/assets/img/background.jpeg" alt="">
    </picture>

    <login v-if="state === 'login'" @login="login" :userID="userID"></login>
    <Connector v-if="state === 'connect'" :targetID="targetID"></Connector>
  </div>
</template>

<script setup>
import connector from "@/assets/js/peerInstance.js";
import login from "@/components/login.vue";
import Connector from "@/components/Connector.vue";
import { ref } from "vue";

const state = ref("login");


// get initial values from query params
const params = new URLSearchParams(window.location.search);
const userID = ref(params.get("userID"));
const targetID = ref(params.get("targetID"));

// manage state
connector.on("login", (e) => (state.value = "connect"));
connector.on("logout", (e) => (state.value = "login"));
</script>

<style lang="scss" scoped>
.setup {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  >picture {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }
}
</style>