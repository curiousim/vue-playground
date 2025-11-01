<template>
  <Teleport to="body">
    <Transition name="modal-fade" @after-leave="onAfterLeave">
      <div v-if="open" class="modal-root" @keydown.self.stop @keydown="onKeydown">
        <div class="modal-backdrop" @click="onBackdropClick"></div>

        <div
          class="modal-dialog"
          :role="role"
          aria-modal="true"
          :aria-labelledby="ariaLabelledby || undefined"
          :aria-describedby="ariaDescribedby || undefined"
          ref="dialogRef"
          tabindex="-1"
          @click.stop
        >
          <button
            v-if="showClose"
            class="modal-close"
            type="button"
            aria-label="Close modal"
            @click="close()"
          >
            ×
          </button>

          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    closeOnEsc?: boolean
    closeOnBackdrop?: boolean
    preventScroll?: boolean
    restoreFocus?: boolean
    ariaLabelledby?: string | null
    ariaDescribedby?: string | null
    role?: 'dialog' | 'alertdialog'
    showClose?: boolean
  }>(),
  {
    closeOnEsc: true,
    closeOnBackdrop: true,
    preventScroll: true,
    restoreFocus: true,
    role: 'dialog',
    showClose: false,
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const dialogRef = ref<HTMLElement | null>(null)
let restoreEl: Element | null = null

function close() {
  emit('update:open', false)
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (props.closeOnEsc && e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (e.key === 'Tab') {
    trapTabKey(e)
  }
}

function onBackdropClick() {
  if (props.closeOnBackdrop) close()
}

/** Focus management */
function getFocusable(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
  )
}

function trapTabKey(e: KeyboardEvent) {
  const root = dialogRef.value
  if (!root) return
  const focusable = getFocusable(root)
  if (focusable.length === 0) {
    e.preventDefault()
    root.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement as HTMLElement | null

  if (!e.shiftKey && active === last) {
    e.preventDefault()
    first?.focus()
  } else if (e.shiftKey && active === first) {
    e.preventDefault()
    last?.focus()
  }
}

/** Lock body scroll */
function lockScroll() {
  document.documentElement.style.overflow = 'hidden'
}
function unlockScroll() {
  document.documentElement.style.overflow = ''
}

/** When leaving transition finishes, optionally restore focus */
function onAfterLeave() {
  if (props.restoreFocus && restoreEl instanceof HTMLElement) {
    ;(restoreEl as HTMLElement).focus?.()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      // store current focused
      restoreEl = document.activeElement
      if (props.preventScroll) lockScroll()
      await nextTick()
      // focus dialog or first focusable
      const el = dialogRef.value
      if (el) {
        const focusable = getFocusable(el)
        if (focusable.length > 0) focusable[0]?.focus()
        else el.focus()
      }
    } else {
      if (props.preventScroll) unlockScroll()
    }
  },
)

onMounted(() => {
  if (props.open && props.preventScroll) lockScroll()
})
onUnmounted(() => {
  unlockScroll()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}
.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: saturate(120%) blur(1.5px);
}
.modal-dialog {
  position: relative;
  background: #fff;
  color: #111;
  border-radius: 5px;
  box-shadow:
    0 10px 15px rgba(0, 0, 0, 0.15),
    0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(0) scale(1);
  animation: modal-scale-in 150ms ease;
  overflow: auto;
}
@media (prefers-color-scheme: dark) {
  .modal-dialog {
    background: #171717;
    color: #f3f3f3;
  }
}
@keyframes modal-scale-in {
  from {
    transform: translateY(4px) scale(0.98);
    opacity: 0.98;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.modal-close {
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;
  font-size: 1.5rem;
  line-height: 1;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  z-index: 10;
}
.modal-close:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
