import { ref, shallowRef, onMounted, onBeforeUnmount, toValue } from 'vue'
import tzLookup from 'tz-lookup'

type NumLike = number | string

export interface UseLocalClockOptions {
  format?: Intl.DateTimeFormatOptions
}

function toNum(v: NumLike): number | null {
  if (v == null || v === '') return null
  const n = typeof v === 'string' ? Number(v) : v
  return Number.isFinite(n) ? (n as number) : null
}

function scheduleToNextSecond(callback: () => void): number {
  const now = Date.now()
  const delay = 1000 - (now % 1000)
  return window.setTimeout(callback, delay)
}

export function useLocalClock(
  latRef: NumLike,
  lonRef: NumLike,
  locale: string = navigator.language,
  opts: UseLocalClockOptions = {},
) {
  const {
    format = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'longGeneric',
    },
  } = opts

  const timeZone = ref<string | null>(null)
  const timeString = ref<string>('')
  const error = shallowRef<Error | null>(null)
  const isRunning = ref(false)
  const formatter = ref<Intl.DateTimeFormat | null>(null)

  let timeoutId: number | null = null
  let rafId: number | null = null

  function clearTimers() {
    if (timeoutId != null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function formatNow() {
    if (formatter.value) timeString.value = formatter.value.format(new Date())
  }

  function tickAligned() {
    formatNow()
    timeoutId = scheduleToNextSecond(() => {
      rafId = requestAnimationFrame(() => tickAligned())
    })
  }

  async function buildFormatter() {
    error.value = null
    formatter.value = null
    timeZone.value = null

    const lat = toNum(toValue(latRef as NumLike))
    const lon = toNum(toValue(lonRef as NumLike))

    if (lat == null || lon == null) {
      error.value = new Error('Latitude/longitude must be numeric.')
      console.error(error.value)
      return
    }

    try {
      const tz = tzLookup(lat, lon)
      timeZone.value = tz
      formatter.value = new Intl.DateTimeFormat(locale, { timeZone: tz, ...format })
    } catch (e: unknown) {
      error.value = e instanceof Error ? e : new Error(String(e))
    }
  }

  async function start() {
    if (isRunning.value) return
    await buildFormatter()
    if (error.value || !formatter.value) return
    isRunning.value = true
    tickAligned()
  }

  function stop() {
    isRunning.value = false
    clearTimers()
  }

  onMounted(() => {
    start()
  })

  onBeforeUnmount(stop)

  return { timeString, timeZone, error, isRunning, start, stop }
}
