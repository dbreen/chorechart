// Mock Quasar plugins
import { config } from '@vue/test-utils'

// Mock Quasar components globally
config.global.mocks = {
  $q: {
    dialog: jest.fn().mockReturnValue({ onOk: jest.fn() }),
    notify: jest.fn(),
    localStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    }
  }
}

// Mock nextTick globally
global.nextTick = jest.fn().mockImplementation(fn => Promise.resolve().then(fn))

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
    order: jest.fn().mockReturnThis(),
    then: jest.fn().mockReturnThis(),
    data: []
  }
}))

// Mock DOM APIs used by Quasar
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn()
}
