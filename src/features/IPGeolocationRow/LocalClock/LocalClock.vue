<template>
  <div class="lc-card" role="group" aria-label="Local time widget">
    <div class="lc-body" aria-live="polite" aria-atomic="true">
      <span v-if="err" class="lc-error">Failed to resolve timezone</span>
      <span v-else class="lc-time">{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocalClock } from '@/composables/useLocalClock'

const props = withDefaults(
  defineProps<{
    lat: number | string
    lon: number | string
    locale?: string
  }>(),
  {
    locale: 'en-GB',
  },
)

const { timeString, error } = useLocalClock(
  props.lat,
  props.lon,
  'en-GB', // to show 24 hour format
)

const time = computed(() => timeString.value)
const err = computed(() => error.value)
</script>

<style scoped>
.lc-card {
  width: 250px;
  max-width: 250px;
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-family-base);
}

.lc-body {
  display: flex;
  align-items: center;
  min-height: 2.25rem;
  width: 100%;
}

.lc-time {
  font-size: calc(var(--font-size-md));
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
}

.lc-error {
  color: var(--color-error);
  font-weight: var(--font-weight-semibold);
}

.lc-card,
.lc-tz {
  transition: all var(--transition-duration-fast) var(--transition-ease);
}
</style>
