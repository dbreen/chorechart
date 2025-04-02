import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock Quasar components
const mockQuasar = {
  QLayout: {
    name: 'QLayout',
    template: '<div class="q-layout"><slot /></div>'
  },
  QPage: {
    name: 'QPage',
    template: '<div class="q-page"><slot /></div>'
  },
  QPageContainer: {
    name: 'QPageContainer',
    template: '<div class="q-page-container"><slot /></div>'
  },
  QHeader: {
    name: 'QHeader',
    template: '<div class="q-header"><slot /></div>'
  },
  QFooter: {
    name: 'QFooter',
    template: '<div class="q-footer"><slot /></div>'
  },
  QDrawer: {
    name: 'QDrawer',
    template: '<div class="q-drawer"><slot /></div>'
  },
  QToolbar: {
    name: 'QToolbar',
    template: '<div class="q-toolbar"><slot /></div>'
  },
  QToolbarTitle: {
    name: 'QToolbarTitle',
    template: '<div class="q-toolbar-title"><slot /></div>'
  },
  QBtn: {
    name: 'QBtn',
    template: '<button class="q-btn"><slot /></button>'
  },
  QIcon: {
    name: 'QIcon',
    template: '<i class="q-icon"><slot /></i>'
  },
  QList: {
    name: 'QList',
    template: '<div class="q-list"><slot /></div>'
  },
  QItem: {
    name: 'QItem',
    template: '<div class="q-item"><slot /></div>'
  },
  QItemSection: {
    name: 'QItemSection',
    template: '<div class="q-item-section"><slot /></div>'
  },
  QItemLabel: {
    name: 'QItemLabel',
    template: '<div class="q-item-label"><slot /></div>'
  },
  QCard: {
    name: 'QCard',
    template: '<div class="q-card"><slot /></div>'
  },
  QCardSection: {
    name: 'QCardSection',
    template: '<div class="q-card-section"><slot /></div>'
  },
  QCardActions: {
    name: 'QCardActions',
    template: '<div class="q-card-actions"><slot /></div>'
  },
  QInput: {
    name: 'QInput',
    template: '<input class="q-input" />',
    props: ['modelValue'],
    emits: ['update:modelValue']
  },
  QSelect: {
    name: 'QSelect',
    template: '<select class="q-select"><slot /></select>',
    props: ['modelValue', 'options'],
    emits: ['update:modelValue']
  },
  QCheckbox: {
    name: 'QCheckbox',
    template: '<input type="checkbox" class="q-checkbox" />',
    props: ['modelValue'],
    emits: ['update:modelValue']
  },
  QToggle: {
    name: 'QToggle',
    template: '<input type="checkbox" class="q-toggle" />',
    props: ['modelValue'],
    emits: ['update:modelValue']
  },
  QBanner: {
    name: 'QBanner',
    template: '<div class="q-banner"><slot /></div>'
  },
  QDialog: {
    name: 'QDialog',
    template: '<div class="q-dialog"><slot /></div>',
    props: ['modelValue'],
    emits: ['update:modelValue', 'hide']
  },
  QForm: {
    name: 'QForm',
    template: '<form class="q-form"><slot /></form>',
    methods: {
      validate: vi.fn().mockResolvedValue(true),
      resetValidation: vi.fn()
    }
  }
}

// Install Quasar plugin for Vue Test Utils
export function installQuasarPlugin() {
  // Register Quasar components globally
  for (const [name, component] of Object.entries(mockQuasar)) {
    config.global.components[name] = component
  }

  // Add Quasar directives
  config.global.directives = {
    ...config.global.directives,
    ripple: () => {}
  }

  // Add Quasar config
  config.global.provide = {
    ...config.global.provide,
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
}
