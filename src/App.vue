<script setup lang="ts">
import ModalWindow from './components/Modal/ModalWindow.vue'
import IPGeolocationWidget from './widgets/IPGeolocationWidget/IPGeolocationWidget.vue'
import { ref } from 'vue'

const modalOpen = ref(false)
</script>

<template>
  <div id="app">
    <button class="open-modal-button" @click="modalOpen = true">Open Modal</button>
    <ModalWindow v-model:open="modalOpen" :showClose="true">
      <IPGeolocationWidget />
    </ModalWindow>
  </div>
</template>

<style scoped>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.open-modal-button {
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.open-modal-button:hover {
  background-color: darken(var(--color-primary), 5%);
}
</style>
