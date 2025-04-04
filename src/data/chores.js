import { supabase } from 'boot/supabase'

// Get all standard chores for a user from the database
export async function getStandardChores(userId) {
  const { data, error } = await supabase
    .from('chores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || [] // Ensure we always return an array even if data is null
}

// Create a new chore in the database
export async function createChore(choreData) {
  const { data, error } = await supabase
    .from('chores')
    .insert(choreData)
    .select()

  if (error) throw error
  return data[0]
}

// Delete a chore from the database
export async function deleteChore(choreId) {
  const { error } = await supabase
    .from('chores')
    .delete()
    .eq('id', choreId)

  if (error) throw error
}

// Define the bonus chore (can be expanded later if needed)
export const bonusChore = { id: 5, name: 'Empty dishwasher' };

// Default chores to use when database is empty or not yet loaded
export const standardDailyChores = [
  { id: 1, name: 'Make bed' },
  { id: 2, name: 'Clean room' },
  { id: 3, name: 'Take out trash' }
];

// Helper function to get N random unique chores from the potential list
// Ensures no duplicates within the returned list
export function getRandomUniqueChores(list, count) {
  if (!list || !list.length) {
    console.warn("No chores available. Using fallback chores.");
    list = ['Make bed', 'Clean room', 'Take out trash', 'Set table', 'Feed pet'];
  }
  
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
