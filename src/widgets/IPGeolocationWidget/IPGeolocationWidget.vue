<script setup lang="ts">
import DialogFrame from '../../components/DialogFrame/DialogFrame.vue'
import PrimaryButton from '../../components/Buttons/PrimaryButton.vue'
import IPGeolocationRow from '../../features/IPGeolocationRow/IPGeolocationRow.vue'

import { ref } from 'vue'

const ipRows = ref<{ id: number; ip?: string }[]>([{ id: 1, ip: '' }])

const addIpRow = () => {
  const newId = ipRows.value.length ? Math.max(...ipRows.value.map((row) => row.id)) + 1 : 1
  ipRows.value.push({ id: newId, ip: '' })
}

const removeIpRow = (id: number) => {
  ipRows.value = ipRows.value.filter((row) => row.id !== id)
}
</script>

<template>
  <DialogFrame title="IP Lookup">
    <div class="geolocation-widget--title">
      <p>Enter one or more IP addresses to look up their geolocation information.</p>
      <PrimaryButton text="Add IP Address" icon="＋" @click="addIpRow" />
    </div>
    <div class="geolocation-widget--ip-list">
      <IPGeolocationRow
        v-for="ipRow in ipRows"
        :row-number="ipRow.id"
        :key="ipRow.id"
        v-model="ipRow.ip"
        :placeholder="'Enter IP address'"
        @remove="removeIpRow(ipRow.id)"
      />
    </div>
  </DialogFrame>
</template>

<style scoped>
.geolocation-widget--title {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-md);
  color: var(--color-text);
}

.geolocation-widget--ip-list {
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);

  /* Border under each IP row except last one */
  & > .geolocation-row--container:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--space-md);
  }
}
</style>
