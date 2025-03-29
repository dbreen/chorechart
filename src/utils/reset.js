/**
 * Utility to reset the application
 */

export function resetApp() {
  // Clear localStorage
  localStorage.clear();
  
  // Initialize with default data
  const defaultData = {
    days: [
      {
        name: 'Monday',
        dailyChores: [
          { id: 1, name: 'Empty backpack', completed: false },
          { id: 2, name: 'Dishes in sink', completed: false },
          { id: 3, name: 'Change dog water', completed: false }
        ],
        uniqueChore: { id: 4, name: 'Vacuum living room', completed: false },
        bonusChore: { id: 5, name: 'Empty dishwasher', completed: false },
        dailiesCompleted: false,
        uniqueCompleted: false,
        bonusCompleted: false,
        bonusAvailable: false,
        allCompleted: false
      },
      {
        name: 'Tuesday',
        dailyChores: [
          { id: 1, name: 'Empty backpack', completed: false },
          { id: 2, name: 'Dishes in sink', completed: false },
          { id: 3, name: 'Change dog water', completed: false }
        ],
        uniqueChore: { id: 4, name: 'Dust shelves', completed: false },
        bonusChore: { id: 5, name: 'Empty dishwasher', completed: false },
        dailiesCompleted: false,
        uniqueCompleted: false,
        bonusCompleted: false,
        bonusAvailable: false,
        allCompleted: false
      },
      {
        name: 'Wednesday',
        dailyChores: [
          { id: 1, name: 'Empty backpack', completed: false },
          { id: 2, name: 'Dishes in sink', completed: false },
          { id: 3, name: 'Change dog water', completed: false }
        ],
        uniqueChore: { id: 4, name: 'Sort laundry', completed: false },
        bonusChore: { id: 5, name: 'Empty dishwasher', completed: false },
        dailiesCompleted: false,
        uniqueCompleted: false,
        bonusCompleted: false,
        bonusAvailable: false,
        allCompleted: false
      },
      {
        name: 'Thursday',
        dailyChores: [
          { id: 1, name: 'Empty backpack', completed: false },
          { id: 2, name: 'Dishes in sink', completed: false },
          { id: 3, name: 'Change dog water', completed: false }
        ],
        uniqueChore: { id: 4, name: 'Wipe bathroom sink', completed: false },
        bonusChore: { id: 5, name: 'Empty dishwasher', completed: false },
        dailiesCompleted: false,
        uniqueCompleted: false,
        bonusCompleted: false,
        bonusAvailable: false,
        allCompleted: false
      },
      {
        name: 'Friday',
        dailyChores: [
          { id: 1, name: 'Empty backpack', completed: false },
          { id: 2, name: 'Dishes in sink', completed: false },
          { id: 3, name: 'Change dog water', completed: false }
        ],
        uniqueChore: { id: 4, name: 'Clean bedroom', completed: false },
        bonusChore: { id: 5, name: 'Empty dishwasher', completed: false },
        dailiesCompleted: false,
        uniqueCompleted: false,
        bonusCompleted: false,
        bonusAvailable: false,
        allCompleted: false
      }
    ],
    lastResetDate: new Date().toISOString()
  };
  
  localStorage.setItem('choreData', JSON.stringify(defaultData));
  
  // Reload with cache busting
  const timestamp = Date.now();
  window.location.href = `${window.location.pathname}?t=${timestamp}`;
}

// Make it available globally for browser console use
if (typeof window !== 'undefined') {
  window.resetChoreChart = resetApp;
}