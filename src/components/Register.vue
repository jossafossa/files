<template>
  <Step>
    <div class="container">
      <h2>Please enter your send and receive names</h2>

      <Row>
        <input
          @change="register($event.target.value)"
          :value="userID"
          type="text"
          name="sender"
          id="sender"
          placeholder="username"
        />
        <small>This name can be used on the receiver side to connect</small>
      </Row>
      <button>Login</button>

      <Log :logs="logs"> </Log>
    </div>
  </Step>
</template>

<script setup>
import Step from "@/components/Step.vue";
import Row from "@/components/Row.vue";
import Log from "@/components/Log.vue";
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

// emits
const emit = defineEmits(["connect"]);

const register = (value) => {
  connector.register(value);
};

const logs = ref([]);
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
