import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Listing from '../Listing.vue'
import type { Listing as ListingType, ListingInfo } from '../../status'

describe('Listing', () => {
  const mockListing: ListingType = {
    id: '12345',
    t: 'Senior Software Engineer',
    dp: 'd1',
    f: '',
    l: 'l1',
    y: 1
  }

  const mockInfo: ListingInfo = {
    location: 'Austin, TX',
    department: 'Autopilot',
    type: 'Full-time'
  }

  it('renders all listing information', () => {
    const wrapper = mount(Listing, {
      props: {
        listing: mockListing,
        info: mockInfo
      }
    })

    expect(wrapper.find('.title').text()).toBe('Senior Software Engineer')
    expect(wrapper.find('.location').text()).toBe('Austin, TX')
    expect(wrapper.find('.department').text()).toBe('Autopilot')
    expect(wrapper.find('.type').text()).toBe('Full-time')
  })

  it('displays job ID', () => {
    const wrapper = mount(Listing, {
      props: {
        listing: mockListing,
        info: mockInfo
      }
    })

    expect(wrapper.find('.number').text().trim()).toBe('12345')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(Listing, {
      props: {
        listing: mockListing,
        info: mockInfo
      }
    })

    expect(wrapper.find('.id').exists()).toBe(true)
    expect(wrapper.find('.listing').exists()).toBe(true)
    expect(wrapper.find('.title').exists()).toBe(true)
    expect(wrapper.find('.location').exists()).toBe(true)
    expect(wrapper.find('.department').exists()).toBe(true)
    expect(wrapper.find('.type').exists()).toBe(true)
  })

  it('handles empty or missing info fields gracefully', () => {
    const incompleteInfo: ListingInfo = {
      location: '',
      department: '',
      type: ''
    }

    const wrapper = mount(Listing, {
      props: {
        listing: mockListing,
        info: incompleteInfo
      }
    })

    expect(wrapper.find('.location').text()).toBe('')
    expect(wrapper.find('.department').text()).toBe('')
    expect(wrapper.find('.type').text()).toBe('')
    // Title and ID should still be displayed
    expect(wrapper.find('.title').text()).toBe('Senior Software Engineer')
    expect(wrapper.find('.number').text().trim()).toBe('12345')
  })
})