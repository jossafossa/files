<template>
  <cardModel>

    <template #header>
      <h2>Enter your username</h2>
    </template>

    <Row @keypress.enter="connector.login(userValue)">
      <input autofocus v-model="userValue" type="text" name="sender" id="sender" placeholder="username" />
    </Row>

    <template #footer>
      <button class="button is-full" @click="connector.login(userValue)">Login</button>
    </template>

  </cardModel>
</template>

<script setup>
import cardModel from "@/components/cards/cardModal.vue";
import Row from "@/components/Row.vue";
import { defineProps, ref } from "vue";
import connector from "@/assets/js/peerInstance.js";

console.log("login loaded");

// get initial values from props
const props = defineProps({
  userID: {
    type: String,
    required: false,
  },
});

const userValue = ref(props.userID);

// fire login and connect events if props are set
if (props.userID) {
  console.log("login");
  connector.login(props.userID);
}
</script>

<style lang="scss" scoped></style>
