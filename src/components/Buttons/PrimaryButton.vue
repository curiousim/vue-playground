<template>
  <button class="add-button" type="button" @click="$emit('click')">
    <span v-if="icon" class="add-icon" :aria-hidden="true">{{ icon }}</span>
    <span
      ><slot>{{ text }}</slot></span
    >
  </button>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  icon?: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
.add-button {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  background-color: var(--color-primary);
  color: var(--color-text-bright);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  padding: var(--space-sm) var(--space-sm);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    transform 0.1s ease;
}

.add-button:hover {
  background-color: var(--color-primary-hover);
}

.add-button:active {
  transform: scale(0.97);
}

.add-icon {
  font-weight: 600;
  font-size: 1.1em;
  line-height: 1;
}
</style>
