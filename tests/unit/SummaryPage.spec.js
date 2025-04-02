import { mount } from '@vue/test-utils'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import SummaryPage from 'src/pages/SummaryPage.vue'
import { getStandardChores, getRandomUniqueChores } from 'src/data/chores'

// Mock dependencies
jest.mock('src/data/chores', () => ({
  getStandardChores: jest.fn().mockResolvedValue([]),
  getRandomUniqueChores: jest.fn(),
  potentialUniqueChores: ['Clean bathroom', 'Vacuum living room']
}));

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}));

jest.mock('quasar', () => ({
  useQuasar: jest.fn()
}));

jest.mock('canvas-confetti', () => jest.fn());

describe('SummaryPage.vue', () => {
  let wrapper;
  let mockQuasar;
  let mockRouter;
  
  beforeEach(() => {
    // Setup mock data
    const mockChoreData = {
      days: [
        {
          name: 'Monday',
          dailyChores: [{ id: 1, name: 'Make bed', completed: true }],
          uniqueChore: { name: 'Clean bathroom', completed: true },
          bonusChore: { name: 'Empty dishwasher', completed: false },
          bonusAvailable: true,
          bonusCompleted: false,
          dailiesCompleted: true,
          uniqueCompleted: true,
          allCompleted: false,
          extraChores: [
            { id: 101, name: 'Extra chore 1', completed: true },
            { id: 102, name: 'Extra chore 2', completed: false }
          ]
        },
        {
          name: 'Tuesday',
          dailyChores: [{ id: 1, name: 'Make bed', completed: false }],
          uniqueChore: { name: 'Vacuum living room', completed: false },
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
    };
    
    // Setup Quasar mock
    mockQuasar = {
      notify: jest.fn(),
      dialog: jest.fn().mockReturnValue({ onOk: jest.fn(cb => cb()) }),
      localStorage: {
        getItem: jest.fn().mockReturnValue(mockChoreData),
        set: jest.fn()
      }
    };
    useQuasar.mockReturnValue(mockQuasar);
    
    // Setup Router mock
    mockRouter = {
      push: jest.fn()
    };
    useRouter.mockReturnValue(mockRouter);
    
    // Mock getRandomUniqueChores
    getRandomUniqueChores.mockReturnValue(['New Chore 1', 'New Chore 2']);
    
    // Create wrapper with mocked dependencies
    wrapper = mount(SummaryPage, {
      global: {
        provide: {
          userSession: { value: { user: { id: 'test-user' } } }
        }
      }
    });
  });
  
  test('calculates totals correctly', () => {
    // Check computed totals
    expect(wrapper.vm.dailiesTotal).toBe(1);
    expect(wrapper.vm.uniqueTotal).toBe(1);
    expect(wrapper.vm.bonusTotal).toBe(0);
    expect(wrapper.vm.extraTotal).toBe(1);
    expect(wrapper.vm.totalEarned).toBe(3);
  });
  
  test('calculates daily total correctly', () => {
    const day = {
      dailiesCompleted: true,
      uniqueCompleted: true,
      bonusAvailable: true,
      bonusCompleted: false,
      extraChores: [
        { completed: true },
        { completed: false }
      ]
    };
    
    expect(wrapper.vm.calculateDailyTotal(day)).toBe(3);
  });
  
  test('resets week with new chores', async () => {
    // Setup custom chores
    getStandardChores.mockResolvedValue([
      { id: 1, name: 'Custom Chore 1' },
      { id: 2, name: 'Custom Chore 2' }
    ]);
    
    // Trigger reset
    await wrapper.find('button[label="Reset Week"]').trigger('click');
    
    // Dialog should be shown
    expect(mockQuasar.dialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Reset Week'
      })
    );
    
    // Custom chores should be fetched
    expect(getStandardChores).toHaveBeenCalledWith('test-user');
    
    // Random chores should be generated
    expect(getRandomUniqueChores).toHaveBeenCalledWith(
      ['Custom Chore 1', 'Custom Chore 2'],
      2
    );
    
    // LocalStorage should be updated
    expect(mockQuasar.localStorage.set).toHaveBeenCalled();
    
    // Notification should be shown
    expect(mockQuasar.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Week has been reset successfully with new chores',
        color: 'positive'
      })
    );
    
    // Should navigate home
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
