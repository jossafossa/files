<template>
  <Step>
    <stack vertical>
      <h2>Enter you username</h2>

      <Row @keypress.enter="connector.login(userValue)">
        <input
          v-model="userValue"
          type="text"
          name="sender"
          id="sender"
          placeholder="username"
        />
      </Row>

      <button class="button" @click="connector.login(userValue)">Login</button>
    </stack>
  </Step>
</template>

<script setup>
import Step from "@/components/Step.vue";
import Row from "@/components/Row.vue";
import stack from "@/components/stack.vue";
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
