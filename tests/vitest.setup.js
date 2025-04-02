// Mock Quasar plugins
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock Quasar components globally
config.global.mocks = {
  $q: {
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
}

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    params: { dayName: 'monday' }
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

// Mock nextTick globally
global.nextTick = vi.fn().mockImplementation(fn => Promise.resolve().then(fn))

// Mock canvas-confetti
vi.mock('canvas-confetti', () => vi.fn())

// Mock Supabase
vi.mock('boot/supabase', () => {
  const mockData = [
    { id: 1, name: 'Test Chore 1', amount: 1.00 },
    { id: 2, name: 'Test Chore 2', amount: 2.00 }
  ]
  
  return {
    supabase: {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockImplementation(() => ({
        data: mockData,
        error: null
      })),
      then: vi.fn().mockReturnThis()
    }
  }
})

// Mock DOM APIs used by Quasar
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn()
}
