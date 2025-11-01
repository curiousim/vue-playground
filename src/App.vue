<script setup lang="ts">
import BoopButton from './components/Buttons/BoopButton.vue'
import ModalWindow from './components/Modal/ModalWindow.vue'
import IPGeolocationWidget from './widgets/IPGeolocationWidget/IPGeolocationWidget.vue'
import { ref } from 'vue'

const modalOpen = ref(false)
</script>

<template>
  <div id="app">
    <BoopButton @click="modalOpen = true" />
    <ModalWindow v-model:open="modalOpen" :showClose="true">
      <IPGeolocationWidget />
    </ModalWindow>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
