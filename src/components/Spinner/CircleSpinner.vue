<template>
  <span
    class="spinner"
    :style="{
      '--size': size + 'px',
      '--stroke': strokeWidth + 'px',
      '--color': color,
      '--duration': duration + 's',
    }"
    role="status"
    :aria-label="label"
    aria-live="polite"
  >
    <svg class="spinner__svg" viewBox="0 0 50 50" focusable="false" aria-hidden="true">
      <circle class="spinner__track" cx="25" cy="25" r="20" />
      <circle class="spinner__arc" cx="25" cy="25" r="20" />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number // px
    strokeWidth?: number // px
    color?: string // any CSS color (default uses current text color)
    duration?: number // seconds per spin
    label?: string // accessible label
  }>(),
  {
    size: 24,
    strokeWidth: 3,
    color: '--color-accent',
    duration: 0.8,
    label: 'Loading…',
  },
)
</script>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--size);
  height: var(--size);
  color: var(--color-accent);
}

.spinner__svg {
  width: 100%;
  height: 100%;
}

.spinner__track,
.spinner__arc {
  fill: none;
  stroke-linecap: round;
  stroke-width: var(--stroke);
}

.spinner__track {
  /* faint background ring */
  stroke: color-mix(in oklab, var(--color-accent), transparent 80%);
}

.spinner__arc {
  stroke: var(--color-accent);
  stroke-dasharray: 126; /* ~2πr where r=20 */
  stroke-dashoffset: 95; /* visible arc */
  transform-origin: 50% 50%;
  animation: spin var(--duration) linear infinite;
}

/* Smooth rotation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .spinner__arc {
    animation: none;
    stroke-dashoffset: 60;
  }
}

/* Screen-reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
