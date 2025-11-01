import { ref } from 'vue'
import type { IpGeoResult } from '../types/ip-lookup.models'
import { IP_GEOLOCATION_URL } from '../config/api'

export function useIpGeoLookup() {
  const endpoint = IP_GEOLOCATION_URL

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<IpGeoResult | null>(null)

  let controller: AbortController | null = null

  async function lookup(ip: string): Promise<IpGeoResult> {
    if (controller) controller.abort()
    controller = new AbortController()

    isLoading.value = true
    error.value = null
    result.value = null

    try {
      const url = new URL(endpoint, window.location.origin)
      url.searchParams.set('ip', ip)

      const res = await fetch(url.toString(), {
        signal: controller.signal,
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Lookup failed (${res.status}): ${text || res.statusText}`)
      }

      const data = (await res.json()) as IpGeoResult
      if (!data.ip) data.ip = ip

      result.value = data
      return data
    } catch (e: unknown) {
      if ((e as { name?: string })?.name === 'AbortError') {
        throw e
      }
      const msg = (e as Error)?.message ?? 'Unexpected error'
      error.value = msg
      throw e
    } finally {
      if (controller && controller.signal.aborted) {
        // do nothing; a newer call has started
      } else {
        isLoading.value = false
        controller = null
      }
    }
  }

  function reset() {
    if (controller) controller.abort()
    isLoading.value = false
    error.value = null
    result.value = null
  }

  return { isLoading, error, result, lookup, reset }
}
