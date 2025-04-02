import { config } from '@vue/test-utils'

// Mock Quasar components globally
config.global.mocks = {
  $q: {
    dialog: jest.fn().mockReturnValue({ onOk: jest.fn() }),
    notify: jest.fn(),
    localStorage: {
      getItem: jest.fn(),
      setItem: jest.fn()
    }
  }
}
