import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ListingWrapper from '../ListingWrapper.vue'
import Listing from '../Listing.vue'
import type { Listing as ListingType, ListingInfo } from '../../status'

describe('ListingWrapper', () => {
  const mockListing: ListingType = {
    id: '12345',
    t: 'Software Engineer',
    dp: 'd1',
    f: '',
    l: 'l1',
    y: 'y1'
  }

  const mockInfo: ListingInfo = {
    location: 'Palo Alto, CA',
    department: 'Engineering',
    type: 'Full-time'
  }

  it('renders as a div when link prop is false', () => {
    const wrapper = mount(ListingWrapper, {
      props: {
        listing: mockListing,
        info: mockInfo,
        link: false
      }
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('renders as an anchor tag when link prop is true', () => {
    const wrapper = mount(ListingWrapper, {
      props: {
        listing: mockListing,
        info: mockInfo,
        link: true
      }
    })

    expect(wrapper.element.tagName).toBe('A')
    const anchor = wrapper.find('a')
    expect(anchor.exists()).toBe(true)
    expect(anchor.attributes('href')).toBe('https://www.tesla.com/careers/search/job/tjt-12345')
    expect(anchor.attributes('target')).toBe('_blank')
  })

  it('passes correct props to Listing component', () => {
    const wrapper = mount(ListingWrapper, {
      props: {
        listing: mockListing,
        info: mockInfo,
        link: false
      }
    })

    const listingComponent = wrapper.findComponent(Listing)
    expect(listingComponent.exists()).toBe(true)
    expect(listingComponent.props('listing')).toEqual(mockListing)
    expect(listingComponent.props('info')).toEqual(mockInfo)
  })

  it('generates correct Tesla careers URL', () => {
    const customListing = { ...mockListing, id: '98765' }
    const wrapper = mount(ListingWrapper, {
      props: {
        listing: customListing,
        info: mockInfo,
        link: true
      }
    })

    const anchor = wrapper.find('a')
    expect(anchor.attributes('href')).toBe('https://www.tesla.com/careers/search/job/tjt-98765')
  })
})