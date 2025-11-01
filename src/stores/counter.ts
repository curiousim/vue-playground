import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/*
For future endeavors, it's a playground and I will play
*/

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
