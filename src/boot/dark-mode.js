import { boot } from 'quasar/wrappers'
import { Dark, LocalStorage } from 'quasar'

export default boot(() => {
  // Use a distinct key for user preference vs Quasar's internal state
  const userPreference = LocalStorage.getItem('darkModePreference')

  if (userPreference === 'dark') {
    Dark.set(true)
  } else if (userPreference === 'light') {
    Dark.set(false)
  } else {
    // No preference saved, or it's explicitly 'auto' (or invalid)
    // Default to Quasar's 'auto' mode which respects system preference
    Dark.set('auto')
  }
})
