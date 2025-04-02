import { mount, flushPromises, config } from '@vue/test-utils'
import { Notify, Dialog, LocalStorage } from 'quasar'
import ManageChores from 'src/pages/ManageChores.vue'
import * as choreModule from 'src/data/chores'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { installQuasarPlugin } from '../quasar-plugin'

// Install Quasar plugin
installQuasarPlugin()

// Mock the chores module
vi.mock('src/data/chores', () => ({
  getStandardChores: vi.fn(),
  createChore: vi.fn(),
  deleteChore: vi.fn()
}))

describe('ManageChores.vue', () => {
  let wrapper
  const mockUserSession = {
    value: {
      user: {
        id: 'test-user-id'
      }
    }
  }

  const mockChores = [
    { id: 1, name: 'Vacuum', amount: 2.50, user_id: 'test-user-id' },
    { id: 2, name: 'Dishes', amount: 1.75, user_id: 'test-user-id' }
  ]

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock the getStandardChores to return test data
    choreModule.getStandardChores.mockResolvedValue(mockChores)
    
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
        getItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn(),
        removeItem: vi.fn()
      }
    }
    
    // Create the wrapper with global properties
    wrapper = mount(ManageChores, {
      global: {
        provide: {
          userSession: mockUserSession
        },
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
          QForm: {
            template: '<form><slot /></form>',
            methods: {
              validate: vi.fn().mockResolvedValue(true),
              resetValidation: vi.fn()
            }
          }
        }
      }
    })
    
    // Mock form and input refs
    wrapper.vm.formRef = {
      validate: vi.fn().mockResolvedValue(true),
      resetValidation: vi.fn()
    }
    wrapper.vm.nameInput = {
      resetValidation: vi.fn(),
      focus: vi.fn()
    }
  })

  it('loads and displays chores on mount', async () => {
    // Wait for promises to resolve
    await flushPromises()
    
    // Check if getStandardChores was called with the correct user ID
    expect(choreModule.getStandardChores).toHaveBeenCalledWith('test-user-id')
    
    // Check if chores are displayed
    const choreItems = wrapper.findAll('.q-item')
    expect(choreItems.length).toBe(2)
    
    // Verify chore content
    expect(wrapper.text()).toContain('Vacuum')
    expect(wrapper.text()).toContain('Dishes')
    expect(wrapper.text()).toContain('$2.50')
    expect(wrapper.text()).toContain('$1.75')
  })

  it('shows welcome banner when no chores exist', async () => {
    // Mock empty chores array
    choreModule.getStandardChores.mockResolvedValue([])
    
    // Remount the component
    wrapper = mount(ManageChores, {
      global: {
        provide: {
          userSession: mockUserSession
        },
        stubs: {
          QForm: {
            template: '<form><slot /></form>',
            methods: {
              validate: vi.fn().mockResolvedValue(true),
              resetValidation: vi.fn()
            }
          }
        }
      }
    })
    
    await flushPromises()
    
    // Check if welcome banner is displayed
    const banner = wrapper.find('.q-banner')
    expect(banner.exists()).toBe(true)
    expect(banner.text()).toContain('Welcome!')
  })

  it('adds a new chore successfully', async () => {
    await flushPromises()
    
    // Mock successful chore creation
    choreModule.createChore.mockResolvedValue({ id: 3, name: 'New Chore', amount: 3.00 })
    
    // Set form values directly on the component
    await wrapper.setData({
      newChore: {
        name: 'New Chore',
        amount: 3.00
      }
    })
    
    // Call the addChore method directly
    await wrapper.vm.addChore()
    await flushPromises()
    
    // Check if createChore was called with correct data
    expect(choreModule.createChore).toHaveBeenCalledWith({
      name: 'New Chore',
      amount: '3.00',
      user_id: 'test-user-id'
    })
    
    // Check if chores were reloaded
    expect(choreModule.getStandardChores).toHaveBeenCalledTimes(2)
    
    // Check if form was reset
    expect(wrapper.vm.newChore.name).toBe('')
    expect(wrapper.vm.newChore.amount).toBe(1.00)
  })

  it('deletes a chore after confirmation', async () => {
    await flushPromises()
    
    // Mock dialog confirmation
    Dialog.create = vi.fn().mockImplementation(() => {
      return {
        onOk: callback => callback()
      }
    })
    
    // Mock successful deletion
    choreModule.deleteChore.mockResolvedValue({})
    
    // Call confirmDelete directly with a mock chore
    await wrapper.vm.confirmDelete({ id: 1, name: 'Vacuum' })
    await flushPromises()
    
    // Check if dialog was shown
    expect(Dialog.create).toHaveBeenCalled()
    
    // Check if deleteChore was called with correct ID
    expect(choreModule.deleteChore).toHaveBeenCalledWith(1)
    
    // Check if chores were reloaded
    expect(choreModule.getStandardChores).toHaveBeenCalledTimes(2)
  })

  it('shows error notification when loading chores fails', async () => {
    // Mock error in getStandardChores
    choreModule.getStandardChores.mockRejectedValue(new Error('Failed to load'))
    
    // Spy on Notify.create
    const notifySpy = vi.spyOn(Notify, 'create')
    
    // Remount the component
    wrapper = mount(ManageChores, {
      global: {
        provide: {
          userSession: mockUserSession
        }
      }
    })
    
    await flushPromises()
    
    // Check if error notification was shown
    expect(notifySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'negative',
        message: expect.stringContaining('Failed to load')
      })
    )
  })
})
