<template>
  <div class="geolocation-row--container">
    <NumberBadge :value="rowNumber" />
    <div class="validated-input">
      <InputField
        v-bind="$attrs"
        :error="hasError"
        v-model="inner"
        :placeholder="placeholder"
        @paste="onPaste"
        @blur="onBlur"
        @keydown.enter.prevent="onEnter"
        :disabled="isLoading"
        aria-describedby="vi-error"
      />

      <p v-if="hasError && errorMessage" id="vi-error" class="vi-error">
        {{ errorMessage }}
      </p>
      <p v-if="actionError" class="vi-error">{{ actionError }}</p>
    </div>

    <CircleSpinner v-if="isLoading" />
    <CountryFlag
      v-else-if="lookupResult"
      :src="lookupResult.location.country_flag"
      :country="`${lookupResult.location.country_name} / ${lookupResult.location.city}`"
    />
    <LocalClock
      v-if="lookupResult"
      :lat="lookupResult.location.latitude"
      :lon="lookupResult.location.longitude"
    />
  </div>
</template>

<script setup lang="ts">
import { isIP } from 'is-ip'
import { ref, watchEffect } from 'vue'
import { useIpGeoLookup } from '@/composables/useIpGeoLookup'
import InputField from '@/components/InputField/InputField.vue'
import NumberBadge from '@/components/NumberBadge/NumberBadge.vue'
import CircleSpinner from '@/components/Spinner/CircleSpinner.vue'
import CountryFlag from './CountryFlag/CountryFlag.vue'
import LocalClock from './LocalClock/LocalClock.vue'

const props = withDefaults(
  defineProps<{
    rowNumber: number
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: '',
  },
)

const inner = ref(props.modelValue ?? '')
const hasError = ref(false)
const errorMessage = ref('')
const { isLoading, error: actionError, lookup, result: lookupResult } = useIpGeoLookup()

function validate(input: string) {
  const value = input.trim()
  if (!value) {
    hasError.value = false
    errorMessage.value = ''
    return { ok: false, value }
  }
  const ok = isIP(value)
  hasError.value = !ok
  errorMessage.value = ok ? '' : 'Invalid IP address'
  return { ok, value }
}

async function runActionIfValid(value: string) {
  if (isLoading.value) return

  lookup(value)
}

function onPaste() {
  // Let paste complete, then validate
  requestAnimationFrame(() => {
    const { ok, value } = validate(inner.value)
    if (ok) runActionIfValid(value)
  })
}
function onBlur() {
  const { ok, value } = validate(inner.value)
  if (ok) runActionIfValid(value)
}
function onEnter() {
  const { ok, value } = validate(inner.value)
  if (ok) runActionIfValid(value)
}

watchEffect(() => {
  // Reset error states on input change
  hasError.value = false
  errorMessage.value = ''
  actionError.value = ''
})
</script>

<style scoped>
.geolocation-row--container {
  display: flex;
  width: 100%;
  align-items: center;
  gap: var(--space-md);
}

.validated-input {
  position: relative;
  width: 350px;
  min-width: 350px;
}

.vi-error {
  margin: 0;
  width: 630px;
  font-size: 0.8125rem;
  color: var(--color-error, #ef4444);
  position: absolute;
  top: 90%;
  left: 5px;
}

.vi-success {
  margin: 0;
  font-size: 0.8125rem;
  color: #065f46;
}
</style>
