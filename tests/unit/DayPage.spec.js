import { mount, flushPromises, config } from '@vue/test-utils'
import { useRoute } from 'vue-router'
import DayPage from 'src/pages/DayPage.vue'
import confetti from 'canvas-confetti'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { installQuasarPlugin } from '../quasar-plugin'

// Install Quasar plugin
installQuasarPlugin()

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))
vi.mock('canvas-confetti')

// Mock localStorage data
const mockChoreData = {
  days: [
    {
      name: 'Monday',
      dailyChores: [
        { id: 1, name: 'Make bed', completed: false },
        { id: 2, name: 'Clean room', completed: false },
        { id: 3, name: 'Take out trash', completed: false }
      ],
      uniqueChore: { name: 'Vacuum living room', completed: false },
      bonusChore: { name: 'Empty dishwasher', completed: false },
      bonusAvailable: false,
      extraChores: []
    }
  ]
}

describe('DayPage.vue', () => {
  beforeEach(() => {
    // Reset mocks
    confetti.mockReset()
    useRoute.mockImplementation(() => ({
      params: { dayName: 'monday' }
    }))
    
    // Set mock localStorage data
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 
      JSON.stringify(mockChoreData)
    )
    vi.spyOn(Storage.prototype, 'setItem')
    
    // Mock $q.localStorage
    config.global.mocks.$q = {
      platform: {
        is: {
          mobile: false,
          desktop: true
        },
        has: {
          touch: false
        }
      },
      screen: {
        width: 1024,
        height: 768
      },
      dark: {
        isActive: false
      },
      dialog: vi.fn().mockReturnValue({ onOk: vi.fn() }),
      notify: vi.fn(),
      localStorage: {
        getItem: vi.fn().mockReturnValue(mockChoreData),
        setItem: vi.fn(),
        clear: vi.fn(),
        removeItem: vi.fn()
      }
    }
  })

  it('loads correct day data', async () => {
    const wrapper = mount(DayPage, {
      global: {
        stubs: {
          QLayout: true,
          QPageContainer: true,
          QPage: true,
          QHeader: true,
          QFooter: true,
          QDrawer: true,
          QToolbar: true,
          QToolbarTitle: true,
          QBtn: true,
          QIcon: true,
          QList: true,
          QItem: true,
          QItemSection: true,
          QItemLabel: true,
          QCard: true,
          QCardSection: true,
          QCardActions: true,
          QInput: true,
          QSelect: true,
          QCheckbox: true,
          QToggle: true,
          QBanner: true,
          QDialog: true,
          QForm: true
        }
      }
    })
    await flushPromises()
    
    expect(wrapper.text()).toContain('Monday')
    expect(wrapper.text()).toContain('Make bed')
    expect(wrapper.text()).toContain('Vacuum living room')
  })

  it('shows error for invalid day', async () => {
    useRoute.mockImplementation(() => ({
      params: { dayName: 'invalid-day' }
    }))
    
    const wrapper = mount(DayPage)
    await flushPromises()
    
    expect(wrapper.text()).toContain('Day not found')
    expect(wrapper.findComponent({ name: 'QBtn' }).exists()).toBe(true)
  })

  it('toggles Dad Mode correctly', async () => {
    const wrapper = mount(DayPage)
    await flushPromises()
    
    const toggle = wrapper.findComponent({ name: 'QToggle' })
    await toggle.trigger('click')
    
    expect(wrapper.vm.isDadMode).toBe(true)
    expect(wrapper.find('input[label="Edit Special Chore Name"]').exists()).toBe(true)
  })

  it('completes daily chores and updates total', async () => {
    const wrapper = mount(DayPage)
    await flushPromises()
    
    // Complete first daily chore
    const checkbox = wrapper.findAllComponents({ name: 'QCheckbox' })[0]
    await checkbox.trigger('click')
    
    // Check confetti was triggered
    expect(confetti).toHaveBeenCalled()
    
    // Check localStorage update
    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1])
    expect(savedData.days[0].dailyChores[0].completed).toBe(true)
    expect(wrapper.vm.calculateDailyTotal()).toBe(1)
  })

  it('adds and removes extra chores in Dad Mode', async () => {
    const wrapper = mount(DayPage)
    await flushPromises()
    
    // Enable Dad Mode
    await wrapper.findComponent({ name: 'QToggle' }).trigger('click')
    
    // Add extra chore
    const addButton = wrapper.find('button:contains("Add Extra Chore")')
    await addButton.trigger('click')
    
    // Mock dialog input
    const mockDialog = vi.spyOn(wrapper.vm.$q, 'dialog')
    mockDialog.mockImplementation((options) => {
      options.onOk('New Extra Chore')
      return { onOk: vi.fn() }
    })
    
    await wrapper.vm.addExtraChore()
    await flushPromises()
    
    // Check new chore added
    expect(wrapper.text()).toContain('New Extra Chore')
    
    // Delete chore
    const deleteButton = wrapper.findComponent({ name: 'QBtn' })
    await deleteButton.trigger('click')
    expect(wrapper.vm.day.extraChores.length).toBe(0)
  })

  it('calculates daily totals correctly', async () => {
    const wrapper = mount(DayPage)
    await flushPromises()
    
    // Complete all chores
    wrapper.vm.day.dailiesCompleted = true
    wrapper.vm.day.uniqueCompleted = true
    wrapper.vm.day.bonusAvailable = true
    wrapper.vm.day.bonusCompleted = true
    wrapper.vm.day.extraChores = [
      { id: 1, name: 'Extra 1', completed: true },
      { id: 2, name: 'Extra 2', completed: true }
    ]
    
    expect(wrapper.vm.calculateDailyTotal()).toBe(5) // 1 + 1 + 1 + 2
  })
})
