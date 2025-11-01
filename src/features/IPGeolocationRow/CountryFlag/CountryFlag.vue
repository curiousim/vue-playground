<template>
  <img
    v-if="src"
    class="country-flag"
    :src="src"
    :alt="country + ' flag'"
    :title="country"
    loading="lazy"
  />
</template>

<script setup lang="ts">
defineProps<{
  src: string
  country: string
}>()
</script>

<style scoped>
.country-flag {
  width: 38px;
  height: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  object-fit: cover;
  background-color: var(--color-background);
  transition: transform var(--transition-duration-fast) var(--transition-ease);
}

.country-flag:hover {
  transform: scale(1.05);
}
</style>
