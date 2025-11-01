import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import IPGeolocationRow from '../IPGeolocationRow.vue'

// Helper to wait for MSW response delay
const waitForMsw = () => new Promise((resolve) => setTimeout(resolve, 350))

describe('IPGeolocationRow', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(IPGeolocationRow, {
      props: {
        rowNumber: 1,
        modelValue: '',
        placeholder: 'Enter IP',
      },
    })
  })

  describe('Initial render', () => {
    it('renders with initial props', () => {
      expect(wrapper.find('.number-badge').exists()).toBe(true)
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter IP')
      expect(wrapper.find('.spinner').exists()).toBe(false)
    })
  })

  describe('Input validation', () => {
    it('shows error for invalid IP address', async () => {
      const input = wrapper.find('input')
      await input.setValue('invalid-ip')
      await input.trigger('blur')

      expect(wrapper.find('.vi-error').text()).toBe('Invalid IP address')
      expect(wrapper.find('.spinner').exists()).toBe(false)
    })

    it('accepts valid IPv4 address', async () => {
      const input = wrapper.find('input')
      await input.setValue('192.168.1.1')
      await input.trigger('blur')

      expect(wrapper.find('.vi-error').exists()).toBe(false)
      expect(wrapper.find('.spinner').exists()).toBe(true)
    })

    it('accepts valid IPv6 address', async () => {
      const input = wrapper.find('input')
      await input.setValue('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
      await input.trigger('blur')

      expect(wrapper.find('.vi-error').exists()).toBe(false)
      expect(wrapper.find('.spinner').exists()).toBe(true)
    })

    it('clears error when input is changed', async () => {
      const input = wrapper.find('input')
      await input.setValue('invalid-ip')
      await input.trigger('blur')
      expect(wrapper.find('.vi-error').exists()).toBe(true)

      await input.setValue('192.168.1.1')
      await input.trigger('blur')
      expect(wrapper.find('.vi-error').exists()).toBe(false)
    })
  })

  describe('Event handling', () => {
    it('triggers lookup on blur', async () => {
      const input = wrapper.find('input')
      await input.setValue('8.8.8.8')
      await input.trigger('blur')

      expect(wrapper.find('.spinner').exists()).toBe(true)
      await waitForMsw()
      expect(wrapper.find('.country-flag').exists()).toBe(true)
    })

    it('triggers lookup on enter', async () => {
      const input = wrapper.find('input')
      await input.setValue('8.8.8.8')
      await input.trigger('keydown.enter')

      expect(wrapper.find('.spinner').exists()).toBe(true)
      await waitForMsw()
      expect(wrapper.find('.country-flag').exists()).toBe(true)
    })

    it('triggers lookup on paste', async () => {
      const input = wrapper.find('input')
      await input.setValue('8.8.8.8')
      await input.trigger('paste')

      // Need to wait for requestAnimationFrame
      await new Promise((resolve) => requestAnimationFrame(resolve))

      expect(wrapper.find('.spinner').exists()).toBe(true)
      await waitForMsw()
      expect(wrapper.find('.country-flag').exists()).toBe(true)
    })
  })

  describe('Loading and success states', () => {
    it('shows spinner during request and result after', async () => {
      const input = wrapper.find('input')
      await input.setValue('8.8.8.8')
      await input.trigger('blur')

      // Check loading state
      expect(wrapper.find('.spinner').exists()).toBe(true)
      expect(wrapper.find('input').attributes('disabled')).toBe('')

      // Wait for mock response
      await waitForMsw()

      // Check success state
      expect(wrapper.find('.spinner').exists()).toBe(false)
      expect(wrapper.find('.country-flag').exists()).toBe(true)
      expect(wrapper.find('.lc-time').exists()).toBe(true)
      expect(wrapper.find('input').attributes('disabled')).toBeFalsy()
    })

    it('displays country and city information correctly', async () => {
      const input = wrapper.find('input')
      await input.setValue('8.8.8.8')
      await input.trigger('blur')
      await waitForMsw()

      const countryFlag = wrapper.find('.country-flag')
      expect(countryFlag.attributes('src')).toBe('https://ipgeolocation.io/static/flags/us_64.png')
      expect(countryFlag.attributes('alt')).toBe('United States / Mountain View flag')
      expect(countryFlag.attributes('title')).toBe('United States / Mountain View')
    })
  })

  describe('Multiple lookups', () => {
    it('allows multiple consecutive lookups', async () => {
      const input = wrapper.find('input')

      // First lookup
      await input.setValue('8.8.8.8')
      await input.trigger('blur')
      await waitForMsw()
      expect(wrapper.find('.country-flag').exists()).toBe(true)

      // Second lookup
      await input.setValue('1.1.1.1')
      await input.trigger('blur')
      expect(wrapper.find('.spinner').exists()).toBe(true)
      await waitForMsw()
      expect(wrapper.find('.country-flag').exists()).toBe(true)
    })
  })
})
