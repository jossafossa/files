<template>
  <cardModel>
    <template #header>
      <div class="hstack justify-between align-center">
        <h2>Welcome {{ username }}</h2>
        <button class="button is-small is-white is-close" @click="connector.logout()"></button>
      </div>
    </template>

    <Row>
      <input autofocus type="text" id="receiver" name="receiver" placeholder="Receiver Name"
        @keypress.enter="connector.connect($event.target.value)" :value="targetID" />
    </Row>

    <template #footer>

      <button class="button is-full" @click="connector.connect($event.target.value)">Connect</button>


    </template>
  </cardModel>
</template>

<script setup>
import cardModel from "@/components/cards/cardModal.vue";
import Row from "@/components/Row.vue";
import { ref, defineProps, onMounted } from "vue";
import connector from "@/assets/js/peerInstance.js";

console.log("connector loaded");

const username = ref("");
username.value = connector.getName();
connector.on("login", (e) => (username.value = connector.getName()));

// get initial values from props
const props = defineProps({
  targetID: {
    type: String,
    required: false,
  },
});

// fire login and connect events if props are set
if (props.targetID) {
  console.log("connect");
  connector.connect(props.targetID);
}
</script>

<style lang="scss" scoped></style>
