import { mount, flushPromises } from '@vue/test-utils'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { Notify, Dialog, LocalStorage } from 'quasar'
import SummaryPage from 'src/pages/SummaryPage.vue'
import * as choreModule from 'src/data/chores'
import confetti from 'canvas-confetti'

// Mock the chores module
jest.mock('src/data/chores', () => ({
  getStandardChores: jest.fn(),
  getRandomUniqueChores: jest.fn(),
  potentialUniqueChores: ['Chore 1', 'Chore 2', 'Chore 3']
}))

// Install Quasar plugin for testing
installQuasarPlugin({ plugins: { Notify, Dialog, LocalStorage } })

describe('SummaryPage.vue', () => {
  let wrapper
  const mockUserSession = {
    value: {
      user: {
        id: 'test-user-id'
      }
    }
  }

  const mockChoreData = {
    days: [
      {
        name: 'Monday',
        dailyChores: [
          { id: 1, name: 'Make bed', completed: true },
          { id: 2, name: 'Clean room', completed: true }
        ],
        uniqueChore: { name: 'Vacuum', completed: true },
        bonusChore: { name: 'Empty dishwasher', completed: false },
        bonusAvailable: true,
        bonusCompleted: false,
        dailiesCompleted: true,
        uniqueCompleted: true,
        allCompleted: false,
        extraChores: [
          { id: 101, name: 'Extra task', completed: true }
        ]
      },
      {
        name: 'Tuesday',
        dailyChores: [
          { id: 1, name: 'Make bed', completed: false },
          { id: 2, name: 'Clean room', completed: false }
        ],
        uniqueChore: { name: 'Mop floors', completed: false },
        bonusChore: { name: 'Empty dishwasher', completed: false },
        bonusAvailable: false,
        bonusCompleted: false,
        dailiesCompleted: false,
        uniqueCompleted: false,
        allCompleted: false,
        extraChores: []
      }
    ],
    lastResetDate: '2023-01-01T00:00:00.000Z'
  }

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Mock localStorage.getItem to return test data
    LocalStorage.getItem = jest.fn().mockReturnValue(mockChoreData)
    
    // Mock getStandardChores to return test data
    choreModule.getStandardChores.mockResolvedValue([
      { id: 1, name: 'Custom chore 1', amount: 1.00 },
      { id: 2, name: 'Custom chore 2', amount: 2.00 }
    ])
    
    // Mock getRandomUniqueChores
    choreModule.getRandomUniqueChores.mockReturnValue(['New chore 1', 'New chore 2'])
    
    // Create the wrapper with global properties
    wrapper = mount(SummaryPage, {
      global: {
        provide: {
          userSession: mockUserSession
        },
        stubs: ['router-link']
      }
    })
  })

  it('displays the weekly summary correctly', async () => {
    // Check if days are displayed
    expect(wrapper.text()).toContain('Monday')
    expect(wrapper.text()).toContain('Tuesday')
    
    // Check if totals are calculated correctly
    expect(wrapper.text()).toContain('Daily chores: $1')
    expect(wrapper.text()).toContain('Special chores: $1')
    expect(wrapper.text()).toContain('Bonus chores: $0')
    expect(wrapper.text()).toContain('Extra chores: $1')
    expect(wrapper.text()).toContain('Total Earnings')
    expect(wrapper.text()).toContain('$3')
  })

  it('shows confetti effect on mount', () => {
    // Check if confetti was called
    expect(confetti).toHaveBeenCalled()
  })

  it('resets the week when confirmed', async () => {
    // Mock dialog confirmation
    Dialog.create = jest.fn().mockImplementation(() => {
      return {
        onOk: callback => callback()
      }
    })
    
    // Mock router
    const mockRouter = {
      push: jest.fn()
    }
    wrapper.vm.$router = mockRouter
    
    // Click reset button
    await wrapper.find('button:contains("Reset Week")').trigger('click')
    
    // Check if dialog was shown
    expect(Dialog.create).toHaveBeenCalled()
    
    // Wait for promises to resolve
    await flushPromises()
    
    // Check if localStorage was updated
    expect(LocalStorage.set).toHaveBeenCalledWith('choreData', expect.any(Object))
    
    // Check if router.push was called
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })

  it('calculates daily totals correctly', () => {
    // Test the calculateDailyTotal method
    const monday = mockChoreData.days[0]
    const tuesday = mockChoreData.days[1]
    
    expect(wrapper.vm.calculateDailyTotal(monday)).toBe(3) // 1 for dailies, 1 for unique, 0 for bonus, 1 for extra
    expect(wrapper.vm.calculateDailyTotal(tuesday)).toBe(0) // Nothing completed
  })
})
