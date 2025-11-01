<template>
  <span class="number-badge" :aria-label="`Row number: ${props.value}`" role="status">
    {{ props.value }}
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number
  }>(),
  {
    value: 0,
  },
)
</script>

<style scoped>
.number-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 1rem;
  background: var(--nb-bg);
  color: var(--nb-fg);
  border-radius: 9999px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
  user-select: none;
}

.number-badge:where(:not(:has(> :first-child))) {
  padding-left: calc((var(--nb-size) - 1ch) / 2);
  padding-right: calc((var(--nb-size) - 1ch) / 2);
}
</style>
