<template>
  <form @submit.prevent="submit">
    <cardModel>
      <template #header>
        <h2>Enter your username</h2>
      </template>

      <floatingInput
        v-model="userValue"
        autofocus="true"
        type="text"
        name="sender"
        id="sender"
        required="true"
        label="Username"
      ></floatingInput>

      <template #footer>
        <button class="button is-full">Login</button>
      </template>
    </cardModel>
  </form>
</template>

<script setup>
import cardModel from "@/components/cards/cardModal.vue";
import floatingInput from "@/components/form/floatingInput.vue";
import { defineProps, ref } from "vue";
import connector from "@/assets/js/peerInstance.js";

// get initial values from props
const props = defineProps({
  userID: {
    type: String,
    required: false,
  },
});

const userValue = ref(props.userID);

const submit = () => {
  connector.login(userValue.value);
};

// fire login and connect events if props are set
if (props.userID) {
  connector.login(props.userID);
}
</script>

<style lang="scss" scoped></style>
