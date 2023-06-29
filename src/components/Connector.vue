<template>
  <Step>
    <form id="step-1">
      <h2>Target connection</h2>

      <Row>
        <input
          type="text"
          id="receiver"
          name="receiver"
          placeholder="Receiver Name"
          @change="connect($event.target.value)"
          :value="targetID"
        />
        <small>The username of the client you want to send files to</small>
      </Row>
    </form>
  </Step>
</template>

<script setup>
import Step from "@/components/Step.vue";
import Row from "@/components/Row.vue";
import { ref, defineEmits, defineProps } from "vue";

import connector from "@/assets/js/PeerConnector.js";

// get initial values from props
const props = defineProps({
  userID: {
    type: String,
    required: false,
  },
  targetID: {
    type: String,
    required: false,
  },
});

// fire register and connect events if props are set
if (props.userID) {
  connector.register(props.userID);
}

if (props.targetID) {
  connector.connect(props.targetID);
}

// emits
const emit = defineEmits(["connect"]);

const connect = (value) => {
  connector.connect(value);
};

connector.on("connected", (conn) => emit("connect", conn));

const logs = ref([]);
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
