/**
 * A utility to forcefully reset the application's state and localStorage data
 */

// Function to completely reset the app data
export function resetAppData() {
  try {
    // Clear all localStorage
    localStorage.clear();
    
    // Create a fresh choreData structure
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
    
    // Store the fresh data
    localStorage.setItem('choreData', JSON.stringify(defaultData));
    
    console.log('App data has been reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting app data:', error);
    return false;
  }
}

// Add a reset button to the global window object 
// so it can be run from the console if needed
if (typeof window !== 'undefined') {
  window.resetChoreChartApp = resetAppData;
}