<template>
  <form @submit.prevent="submit">
    <cardModel>
      <template #header>
        <div class="hstack justify-between align-center">
          <h2>Welcome {{ username }}</h2>
          <span
            class="button is-small is-white is-close"
            @click.prevent="connector.logout()"
          ></span>
        </div>
      </template>

      <floatingInput
        autofocus
        type="text"
        name="receiver"
        label="Receiver Name"
        required="true"
        v-model="targetValue"
      />

      <template #footer>
        <button class="button is-full">Connect</button>
      </template>
    </cardModel>
  </form>
</template>

<script setup>
import cardModel from "@/components/cards/cardModal.vue";
import Row from "@/components/Row.vue";
import { ref, defineProps, onMounted } from "vue";
import connector from "@/assets/js/peerInstance.js";
import floatingInput from "./form/floatingInput.vue";

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

const targetValue = ref(props.targetID);

const submit = () => {
  connector.connect(targetValue.value);
};

// fire login and connect events if props are set
if (props.targetID) {
  connector.connect(props.targetID);
}
</script>

<style lang="scss" scoped></style>
