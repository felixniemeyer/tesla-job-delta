import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Checklist from '../Checklist.vue'

describe('Checklist', () => {
  const mockLabels = {
    'item1': 'Item One',
    'item2': 'Item Two',
    'item3': 'Item Three',
    'item4': 'Another Item'
  }

  let mockChecklist: Record<string, boolean>

  beforeEach(() => {
    mockChecklist = {
      'item1': true,
      'item2': false,
      'item3': true,
      'item4': false
    }
  })

  const mountAndExpand = async (props: any) => {
    const wrapper = mount(Checklist, { props })
    await wrapper.vm.$nextTick()
    
    // Expand the checklist
    const toggleButton = wrapper.findAll('button').filter(b => b.text() === 'show')[0]
    await toggleButton.trigger('click')
    
    return wrapper
  }

  it('renders all items from labels when expanded', async () => {
    const wrapper = await mountAndExpand({
      labels: mockLabels,
      checklist: mockChecklist,
      name: 'Test Checklist'
    })

    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(4)
    expect(wrapper.text()).toContain('Item One')
    expect(wrapper.text()).toContain('Item Two')
    expect(wrapper.text()).toContain('Item Three')
    expect(wrapper.text()).toContain('Another Item')
  })

  it('reflects checklist state in checkboxes', async () => {
    const wrapper = await mountAndExpand({
      labels: mockLabels,
      checklist: mockChecklist,
      name: 'Test Checklist'
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(true) // item1
    expect((checkboxes[1].element as HTMLInputElement).checked).toBe(false) // item2
    expect((checkboxes[2].element as HTMLInputElement).checked).toBe(true) // item3
    expect((checkboxes[3].element as HTMLInputElement).checked).toBe(false) // item4
  })

  it('selects all items', async () => {
    const wrapper = await mountAndExpand({
      labels: mockLabels,
      checklist: mockChecklist,
      name: 'Test Checklist'
    })

    const selectAllButton = wrapper.findAll('button').filter(b => b.text() === 'Select All')[0]
    await selectAllButton.trigger('click')

    expect(mockChecklist.item1).toBe(true)
    expect(mockChecklist.item2).toBe(true)
    expect(mockChecklist.item3).toBe(true)
    expect(mockChecklist.item4).toBe(true)
  })

  it('deselects all items', async () => {
    const wrapper = await mountAndExpand({
      labels: mockLabels,
      checklist: mockChecklist,
      name: 'Test Checklist'
    })

    const selectNoneButton = wrapper.findAll('button').filter(b => b.text() === 'Select None')[0]
    await selectNoneButton.trigger('click')

    expect(mockChecklist.item1).toBe(false)
    expect(mockChecklist.item2).toBe(false)
    expect(mockChecklist.item3).toBe(false)
    expect(mockChecklist.item4).toBe(false)
  })

  it('inverts selection', async () => {
    const wrapper = await mountAndExpand({
      labels: mockLabels,
      checklist: mockChecklist,
      name: 'Test Checklist'
    })

    const invertButton = wrapper.findAll('button').filter(b => b.text() === 'Invert Selection')[0]
    await invertButton.trigger('click')

    expect(mockChecklist.item1).toBe(false) // was true
    expect(mockChecklist.item2).toBe(true)  // was false
    expect(mockChecklist.item3).toBe(false) // was true
    expect(mockChecklist.item4).toBe(true)  // was false
  })

  it('toggles collapse state', async () => {
    const wrapper = mount(Checklist, {
      props: {
        labels: mockLabels,
        checklist: mockChecklist,
        name: 'Test Checklist'
      }
    })

    await wrapper.vm.$nextTick()

    // Initially collapsed
    expect(wrapper.find('.boxes').exists()).toBe(false)

    // Expand
    let toggleButton = wrapper.findAll('button').filter(b => b.text() === 'show')[0]
    await toggleButton.trigger('click')
    expect(wrapper.find('.boxes').exists()).toBe(true)

    // Collapse again
    toggleButton = wrapper.findAll('button').filter(b => b.text() === 'hide')[0]
    await toggleButton.trigger('click')
    expect(wrapper.find('.boxes').exists()).toBe(false)
  })

  it('clears search', async () => {
    const wrapper = mount(Checklist, {
      props: {
        labels: mockLabels,
        checklist: mockChecklist,
        name: 'Test Checklist'
      }
    })

    await wrapper.vm.$nextTick()

    const searchInput = wrapper.find('input[placeholder="Search"]')
    await searchInput.setValue('One')
    expect((searchInput.element as HTMLInputElement).value).toBe('One')

    const clearButton = wrapper.findAll('button').filter(b => b.text() === 'X')[0]
    await clearButton.trigger('click')
    expect((searchInput.element as HTMLInputElement).value).toBe('')
  })
})