import { mount } from '@vue/test-utils'
import { useQuasar } from 'quasar'
import ManageChores from 'src/pages/ManageChores.vue'

// Mock dependencies
jest.mock('src/data/chores', () => ({
  createChore: jest.fn().mockResolvedValue({ id: 1, name: 'New Chore', amount: 2.50 }),
  getStandardChores: jest.fn().mockResolvedValue([]),
  deleteChore: jest.fn().mockResolvedValue({})
}))

// Mock Quasar hooks
jest.mock('quasar', () => ({
  useQuasar: jest.fn()
}))

describe('ManageChores.vue', () => {
  let wrapper;
  let mockQuasar;
  
  beforeEach(() => {
    // Setup Quasar mock
    mockQuasar = {
      notify: jest.fn(),
      dialog: jest.fn().mockReturnValue({ onOk: jest.fn(cb => cb()) })
    };
    useQuasar.mockReturnValue(mockQuasar);
    
    // Create wrapper with mocked dependencies
    wrapper = mount(ManageChores, {
      global: {
        provide: {
          userSession: { value: { user: { id: 'test-user' } } }
        }
      }
    });
  });
  
  test('submits valid chore form', async () => {
    const { createChore } = require('src/data/chores');
    
    // Fill form
    await wrapper.findComponent({ ref: 'nameInput' }).setValue('New Chore');
    await wrapper.find('input[type="number"]').setValue(2.5);
    
    // Submit form
    await wrapper.find('form').trigger('submit');
    
    // Assertions
    expect(createChore).toHaveBeenCalledWith({
      name: 'New Chore',
      amount: '2.50',
      user_id: 'test-user'
    });
    
    // Form should be reset
    expect(wrapper.vm.newChore.name).toBe('');
    expect(wrapper.vm.newChore.amount).toBe(1.00);
    
    // Notification should be shown
    expect(mockQuasar.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'positive',
        message: 'Chore added successfully!'
      })
    );
  });
  
  test('shows validation errors for empty form', async () => {
    const { createChore } = require('src/data/chores');
    
    // Submit empty form
    await wrapper.find('form').trigger('submit');
    
    // createChore should not be called
    expect(createChore).not.toHaveBeenCalled();
  });
  
  test('deletes chore after confirmation', async () => {
    const { deleteChore, getStandardChores } = require('src/data/chores');
    
    // Mock chores data
    wrapper.vm.chores = [{ id: 1, name: 'Test Chore', amount: 1.00 }];
    
    // Trigger delete
    await wrapper.find('button[icon="delete"]').trigger('click');
    
    // Confirm dialog should be shown
    expect(mockQuasar.dialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Confirm Deletion',
        message: expect.stringContaining('Test Chore')
      })
    );
    
    // deleteChore should be called
    expect(deleteChore).toHaveBeenCalledWith(1);
    
    // Chores should be reloaded
    expect(getStandardChores).toHaveBeenCalled();
    
    // Notification should be shown
    expect(mockQuasar.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'positive',
        message: 'Chore deleted successfully!'
      })
    );
  });
});
