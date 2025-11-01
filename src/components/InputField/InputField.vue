<template>
  <div class="input-wrapper" :class="{ error }">
    <input
      v-bind="$attrs"
      class="input-field"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :aria-invalid="error"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  error?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--color-background, #fff);
  border: 1px solid var(--color-input-border, #ddd);
  border-radius: var(--radius-md);
  padding: 0 var(--space-xs);
  transition: border-color var(--transition-fast);
}

/* Focused state — uses primary color */
.input-wrapper:focus-within {
  border-color: var(--color-focused-border);
}

/* Error state */
.input-wrapper.error {
  border-color: var(--color-error, #ef4444);
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text, #111);
  font-size: var(--font-size-base);
  padding: var(--space-xs) 0;
}

.input-field::placeholder {
  color: #aaa;
}
</style>
