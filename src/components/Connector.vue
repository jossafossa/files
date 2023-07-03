<template>
  <Step>
    <stack vertical>
      <h2>Welcome {{ username }}</h2>

      <Row>
        <input
          type="text"
          id="receiver"
          name="receiver"
          placeholder="Receiver Name"
          @keypress.enter="connector.connect($event.target.value)"
          :value="targetID"
        />
      </Row>

      <button @click="connector.logout()">Logout</button>
    </stack>
  </Step>
</template>

<script setup>
import Step from "@/components/Step.vue";
import Row from "@/components/Row.vue";
import { ref, defineProps, onMounted } from "vue";
import stack from "@/components/stack.vue";
import connector from "@/assets/js/PeerConnector.js";

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
