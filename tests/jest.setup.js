// Mock Quasar plugins
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

// Mock canvas-confetti
jest.mock('canvas-confetti', () => jest.fn())

// Mock Supabase
jest.mock('boot/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis()
  }
}))
