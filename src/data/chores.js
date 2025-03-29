
// Define the standard daily chores that repeat every day
export const standardDailyChores = [
  { id: 1, name: 'Empty backpack' },
  { id: 2, name: 'Dishes in sink' },
  { id: 3, name: 'Change dog water' }
];

// Define the pool of potential unique chores for the week
export const potentialUniqueChores = [
  'Vacuum living room',
  'Dust shelves',
  'Sort laundry',
  'Wipe bathroom sink',
  'Clean bedroom floor',
  'Take out trash',
  'Wipe kitchen counters'
  // Add more potential chores here
];

// Define the bonus chore (can be expanded later if needed)
export const bonusChore = { id: 5, name: 'Empty dishwasher' };

// Helper function to get N random unique chores from the potential list
// Ensures no duplicates within the returned list
export function getRandomUniqueChores(list, count) {
  if (count > list.length) {
    console.warn("Requested more unique chores than available. Returning all available.");
    count = list.length;
  }
  // Shuffle the array using Fisher-Yates algorithm
  const shuffled = list.slice(); // Create a copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Return the first 'count' items
  return shuffled.slice(0, count);
}
