<template>
  <button class="boop-btn" type="button" aria-label="Boop" @click="$emit('click')">
    <svg
      class="boop-svg"
      viewBox="0 0 640 200"
      role="img"
      aria-labelledby="boopTitle"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="boopTitle">BOOP</title>
      <defs>
        <linearGradient id="boopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff7a7a" />
          <stop offset="33%" stop-color="#ffcd3c" />
          <stop offset="66%" stop-color="#51e5a8" />
          <stop offset="100%" stop-color="#7aa7ff" />
        </linearGradient>

        <filter id="boopShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.35" />
        </filter>
      </defs>

      <text
        x="50%"
        y="52%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'"
        font-size="128"
        fill="none"
        stroke="black"
        stroke-opacity="0.25"
        stroke-width="20"
        filter="url(#boopShadow)"
      >
        BOOP
      </text>

      <text
        x="50%"
        y="52%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'"
        font-size="128"
        fill="url(#boopGradient)"
        stroke="white"
        stroke-width="4"
      >
        BOOP
      </text>
    </svg>
    <span aria-hidden="true" class="shine"></span>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
:host,
:root {
  --boop-radius: 48px;
  --boop-padding-y: 2rem;
  --boop-padding-x: 3rem;
  --boop-bg: conic-gradient(from 0deg, #7aa7ff, #51e5a8, #ffcd3c, #ff7a7a, #b678ff, #7aa7ff);
  --boop-text: #0b0b0b;
  --boop-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  --boop-ring: 0 0 0 8px rgba(26, 145, 255, 0.35);
  --boop-speed: 2.4s;
  --boop-pulse-speed: 1.5s;
}

/* Button shell */
.boop-btn {
  position: relative;
  display: inline-grid;
  place-items: center;
  gap: 0.25rem;
  padding: var(--boop-padding-y) var(--boop-padding-x);
  border: none;
  border-radius: var(--boop-radius);
  background: var(--boop-bg);
  background-size: 200% 200%;
  color: var(--boop-text);
  box-shadow: var(--boop-shadow);
  cursor: pointer;
  transform: translateZ(0);
  transition:
    transform 160ms cubic-bezier(0.2, 0.9, 0.3, 1.5),
    box-shadow 160ms ease;
  -webkit-tap-highlight-color: transparent;
  transform: translateZ(0);
  isolation: isolate;
}

.boop-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow:
    var(--boop-shadow),
    0 0 20px rgba(122, 167, 255, 0.4);
}

.boop-btn:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: var(--boop-shadow);
}

.boop-btn:focus-visible {
  outline: none;
  box-shadow: var(--boop-shadow), var(--boop-ring);
}

/* Animate the gradient gently */
@media (prefers-reduced-motion: no-preference) {
  .boop-btn {
    animation: boopGradient var(--boop-speed) linear infinite;
  }
}
@keyframes boopGradient {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

/* SVG sizing */
.boop-svg {
  width: 24rem;
  height: 8rem;
  display: block;
  pointer-events: none;
  z-index: 1;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* Glassy shine sweep */
.shine {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
}
.shine::before {
  content: '';
  position: absolute;
  top: -60%;
  left: -30%;
  width: 45%;
  height: 220%;
  transform: rotate(25deg);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  filter: blur(5px);
  opacity: 0.6;
  animation: shineSweep 4s linear infinite;
}

.shine::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  opacity: 0;
  animation: pulse var(--boop-pulse-speed) ease-in-out infinite;
}

@keyframes shineSweep {
  0% {
    transform: translateX(-120%) rotate(25deg);
  }
  100% {
    transform: translateX(520%) rotate(25deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.15;
    transform: scale(1.02);
  }
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes float1 {
    0% {
      transform: translate(0, 0) scale(0.6);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translate(12px, -10px) scale(1.1);
      opacity: 0;
    }
  }
  @keyframes float2 {
    0% {
      transform: translate(0, 0) scale(0.6);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translate(-10px, -8px) scale(1.1);
      opacity: 0;
    }
  }
  @keyframes float3 {
    0% {
      transform: translate(0, 0) scale(0.6);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translate(6px, -14px) scale(1.15);
      opacity: 0;
    }
  }
}
</style>
