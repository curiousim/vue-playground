<template>
  <div class="dialog-frame">
    <header class="dialog-header">
      <h2 class="dialog-title">{{ title }}</h2>
    </header>

    <div class="dialog-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.dialog-frame {
  background: white;
  border-radius: 5px;
  width: 750px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
}

.dialog-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #111;
}

.dialog-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #444;
}

.dialog-close:hover {
  color: #000;
}

.dialog-body {
  padding: 1rem;
  background: #fff;
}
</style>
