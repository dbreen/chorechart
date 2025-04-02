import { 
  getStandardChores, 
  createChore, 
  deleteChore, 
  getRandomUniqueChores,
  potentialUniqueChores
} from 'src/data/chores'
import { supabase } from 'boot/supabase'

// Mock supabase
jest.mock('boot/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis()
  }
}));

describe('Chores Data Layer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getStandardChores', () => {
    test('fetches chores for a user', async () => {
      // Setup mock response
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [
            { id: 1, name: 'Chore 1', amount: 1.00 },
            { id: 2, name: 'Chore 2', amount: 2.00 }
          ],
          error: null
        })
      });
      
      // Call function
      const result = await getStandardChores('user-123');
      
      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('chores');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Chore 1');
    });
    
    test('returns empty array when no data', async () => {
      // Setup mock response
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      });
      
      // Call function
      const result = await getStandardChores('user-123');
      
      // Assertions
      expect(result).toEqual([]);
    });
    
    test('throws error when API fails', async () => {
      // Setup mock response
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'API error' }
        })
      });
      
      // Call function and expect error
      await expect(getStandardChores('user-123')).rejects.toEqual({ message: 'API error' });
    });
  });
  
  describe('createChore', () => {
    test('creates a new chore', async () => {
      // Setup mock response
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: [{ id: 1, name: 'New Chore', amount: 1.00 }],
          error: null
        })
      });
      
      // Call function
      const choreData = { name: 'New Chore', amount: 1.00, user_id: 'user-123' };
      const result = await createChore(choreData);
      
      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('chores');
      expect(result).toEqual({ id: 1, name: 'New Chore', amount: 1.00 });
    });
    
    test('throws error when API fails', async () => {
      // Setup mock response
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'API error' }
        })
      });
      
      // Call function and expect error
      const choreData = { name: 'New Chore', amount: 1.00, user_id: 'user-123' };
      await expect(createChore(choreData)).rejects.toEqual({ message: 'API error' });
    });
  });
  
  describe('deleteChore', () => {
    test('deletes a chore', async () => {
      // Setup mock response
      supabase.from.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null
        })
      });
      
      // Call function
      await deleteChore(1);
      
      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('chores');
    });
    
    test('throws error when API fails', async () => {
      // Setup mock response
      supabase.from.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: { message: 'API error' }
        })
      });
      
      // Call function and expect error
      await expect(deleteChore(1)).rejects.toEqual({ message: 'API error' });
    });
  });
  
  describe('getRandomUniqueChores', () => {
    test('returns random chores from list', () => {
      // Mock Math.random to get predictable results
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5);
      
      // Call function
      const result = getRandomUniqueChores(['A', 'B', 'C', 'D'], 2);
      
      // Restore Math.random
      Math.random = originalRandom;
      
      // Assertions
      expect(result).toHaveLength(2);
      expect(Array.isArray(result)).toBe(true);
    });
    
    test('handles count greater than list length', () => {
      const result = getRandomUniqueChores(['A', 'B'], 5);
      expect(result).toHaveLength(2);
    });
    
    test('uses default list when none provided', () => {
      const result = getRandomUniqueChores(undefined, 2);
      expect(result).toHaveLength(2);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
