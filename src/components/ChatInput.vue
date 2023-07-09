<template>
  <form @submit.prevent="submit()" @keydown.ctrl.enter="submit()" @keydown.meta.enter="submit()">
    <div class="chat-input">

      <div class="show-for-md">
        <label class="button is-icon " for="file">
          <i class="fa-regular fa-file"></i>
        </label>
        <input type="file" hidden id="file" @change="sendFiles" />
      </div>

      <FloatingInput autofocus type="textarea" v-model="message" label="message" rows="3" />


      <div class="vstack">

        <button class="button is-icon">
          <i class="fa-regular fa-paper-plane"></i>
        </button>


        <div class=" hide-for-md">
          <label class="button is-icon" for="file">
            <i class="fa-regular fa-file"></i>
          </label>
        </div>

      </div>
    </div>
  </form>
</template>

<script setup>
import connector from "@/assets/js/peerInstance.js";
import FloatingInput from "./form/floatingInput.vue";
import { ref } from "vue";

const message = ref("");

const sendFiles = (e) => {
  const file = e.target.files[0];
  connector.sendFile(file);
};

const submit = () => {
  connector.sendMessage(message.value);
  message.value = "";
};
</script>

<style lang="scss" scoped>
.chat-input {
  display: flex;
  gap: 1rem;

  >.floating-input {
    flex: 1;
  }
}
</style>
