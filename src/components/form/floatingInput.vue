<template>
  <div class="floating-input" :class="{ 'is-textarea': textarea }">
    <input v-if="!textarea" v-bind="{ ...$attrs, ...$props }" :value="modelValue" :id="id" :placeholder="label"
      @input="updateModelValue($event.target.value)" ref="input" />
    <textarea v-if="textarea" v-bind="{ ...$attrs, ...$props }" :value="modelValue" :id="id" :placeholder="label"
      @input="updateModelValue($event.target.value)" ref="input">

    </textarea>
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";

const props = defineProps({
  label: String,
  type: String,
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const textarea = props.type === 'textarea';
const input = ref(null);
const id = ref(Math.random().toString(36).substring(2));

// Create a computed property to synchronize prop value
const computedModelValue = ref(props.modelValue);

// Emit the updated value when the input changes
const updateModelValue = (value) => {
  computedModelValue.value = value;
  emit("update:modelValue", value);
};

// autofucs on mount
onMounted(() => {
  let intputRaw = input.value;
  if (intputRaw.hasAttribute("autofocus")) intputRaw.focus();
});
</script>

<style lang="scss" scoped>
.floating-input {
  --_height: var(--fl-height, 50px);
  --_padding-x: var(--fl-padding-x, 16px);
  --_padding-y: var(--fl-padding-y, 8px);
  --_label-size: var(--fl-label-size, 12px);
  --_label-height: var(--fl-label-height, 16px);
  --_label-color: var(--fl-label-color, rgba(0, 0, 0, 0.5));
  --_radius: var(--fl-radius, 100px);
  --_background: var(--fl-background, white);
  --_color: var(--fl-color, black);
  --_border-color: var(--fl-border-color, rgba(0, 0, 0, 0.2));
  --_outline-color: var(--fl-outline-color, #{rgba(blue, 0.2)});
  --_outline-width: var(--fl-outline-width, 4px);

  // active
  --_active-border-color: var(--fl-active-border-color, blue);
  --_active-label-color: var(--fl-active-label-color, black);

  background-color: var(--_background);
  color: var(--_color);
  border-radius: var(--_radius);
  position: relative;
  min-height: var(--_height);

  transition: var(--transition-base);
  box-shadow: 0 0 0 1px var(--_border-color);

  &:focus-within {
    --_border-color: var(--_active-border-color);
  }

  > :where(input, textarea),
  >label {
    transition: var(--transition-base);
    padding: var(--_padding-y) var(--_padding-x);
    height: 100%;
  }

  > :where(input, textarea) {
    border: none;
    background-color: transparent;
    font: inherit;
    width: 100%;
    padding-top: calc(var(--_padding-y) + var(--_label-height));
    border-radius: var(--_radius);
    outline: 0px solid var(--_outline-color);

    &::placeholder {
      color: transparent;
    }
  }

  &.is-textarea {
    --_radius: calc(var(--_height) / 2);
  }

  >label {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    height: var(--_height);
    pointer-events: none;
    color: var(--_label-color);
  }

  >:where(input, textarea):focus+label,
  >:where(input, textarea):not(:placeholder-shown)+label {
    font-size: var(--_label-size);
    height: calc(var(--_label-height) + var(--_padding-y) * 2);

    color: var(--_active-label-color);
  }

  >:where(input, textarea):focus {
    outline-width: var(--_outline-width);
  }
}
</style>
