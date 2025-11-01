import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import IPGeolocationWidget from '../IPGeolocationWidget.vue'

// Helper to wait for MSW response delay
const waitForMsw = () => new Promise((resolve) => setTimeout(resolve, 350))

describe('IPGeolocationWidget', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(IPGeolocationWidget)
  })

  it('renders initial structure correctly', () => {
    expect(wrapper.find('.geolocation-widget--title').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('.geolocation-widget--ip-list').exists()).toBe(true)
  })

  it('shows loading spinner when looking up IP address', async () => {
    const input = wrapper.find('input')
    await input.setValue('8.8.8.8')
    await input.trigger('blur')

    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.find('.spinner').attributes('role')).toBe('status')
  })

  it('shows geolocation data after successful IP lookup', async () => {
    const input = wrapper.find('input')
    await input.setValue('8.8.8.8')
    await input.trigger('blur')
    await waitForMsw()

    // Spinner should be gone
    expect(wrapper.find('.spinner').exists()).toBe(false)

    // Geolocation data should be shown
    expect(wrapper.find('.country-flag').exists()).toBe(true)
    expect(wrapper.find('.lc-time').exists()).toBe(true)
    expect(wrapper.find('.country-flag').attributes('src')).toBe(
      'https://ipgeolocation.io/static/flags/us_64.png',
    )
  })

  it('adds new IP address rows when clicking the add button', async () => {
    // Initially there should be one row
    expect(wrapper.findAll('.geolocation-row--container').length).toBe(1)

    // First row should have badge number 1
    expect(wrapper.find('.number-badge').text()).toBe('1')

    // Click add button
    const addButton = wrapper.find('button')
    await addButton.trigger('click')

    // Should now have two rows
    const rows = wrapper.findAll('.geolocation-row--container')
    expect(rows.length).toBe(2)

    // Verify badge numbers are sequential
    const badges = wrapper.findAll('.number-badge')
    expect(badges[0]?.text()).toBe('1')
    expect(badges[1]?.text()).toBe('2')
  })
})
