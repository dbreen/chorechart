import { 
  getStandardChores, 
  createChore, 
  deleteChore, 
  getRandomUniqueChores,
  potentialUniqueChores
} from 'src/data/chores'
import { supabase } from 'boot/supabase'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { installQuasarPlugin } from '../quasar-plugin'

// Install Quasar plugin
installQuasarPlugin()

// Mock the Supabase client
vi.mock('boot/supabase', () => {
  const mockSupabase = {
    from: vi.fn(() => mockSupabase),
    select: vi.fn(() => mockSupabase),
    insert: vi.fn(() => mockSupabase),
    delete: vi.fn(() => mockSupabase),
    eq: vi.fn(() => mockSupabase),
    order: vi.fn(() => mockSupabase)
  };
  
  return {
    supabase: mockSupabase
  };
})

describe('Chores Data Module', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('getStandardChores', () => {
    it('fetches chores for a user successfully', async () => {
      // Mock successful response
      const mockData = [
        { id: 1, name: 'Vacuum', amount: 2.50, user_id: 'user-123' },
        { id: 2, name: 'Dishes', amount: 1.75, user_id: 'user-123' }
      ]
      
      supabase.select.mockImplementation(() => ({
        data: mockData,
        error: null
      }))
      
      const result = await getStandardChores('user-123')
      
      // Check if Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('chores')
      expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user-123')
      
      // Check if result matches mock data
      expect(result).toEqual(mockData)
    })

    it('returns empty array when no chores exist', async () => {
      // Mock empty response
      supabase.select.mockImplementation(() => ({
        data: null,
        error: null
      }))
      
      const result = await getStandardChores('user-123')
      
      // Check if result is an empty array
      expect(result).toEqual([])
    })

    it('throws error when database query fails', async () => {
      // Mock error response
      supabase.select.mockImplementation(() => ({
        data: null,
        error: new Error('Database error')
      }))
      
      // Check if function throws the error
      await expect(getStandardChores('user-123')).rejects.toThrow('Database error')
    })
  })

  describe('createChore', () => {
    it('creates a new chore successfully', async () => {
      // Mock chore data
      const choreData = {
        name: 'New Chore',
        amount: 3.00,
        user_id: 'user-123'
      }
      
      // Mock successful response
      const mockResponse = {
        ...choreData,
        id: 3
      }
      
      supabase.select.mockImplementation(() => ({
        data: [mockResponse],
        error: null
      }))
      
      const result = await createChore(choreData)
      
      // Check if Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('chores')
      expect(supabase.insert).toHaveBeenCalledWith(choreData)
      
      // Check if result matches mock response
      expect(result).toEqual(mockResponse)
    })

    it('throws error when chore creation fails', async () => {
      supabase.select.mockImplementation(() => ({
        data: null,
        error: new Error('Creation failed')
      }))
      
      // Check if function throws the error
      await expect(createChore({})).rejects.toThrow('Creation failed')
    })
  })

  describe('deleteChore', () => {
    it('deletes a chore successfully', async () => {
      // Mock successful response
      supabase.delete.mockImplementation(() => ({
        error: null
      }))
      
      await deleteChore(1)
      
      // Check if Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('chores')
      expect(supabase.delete).toHaveBeenCalled()
      expect(supabase.eq).toHaveBeenCalledWith('id', 1)
    })

    it('throws error when chore deletion fails', async () => {
      // Mock error response
      supabase.delete.mockImplementation(() => ({
        error: new Error('Deletion failed')
      }))
      
      // Check if function throws the error
      await expect(deleteChore(1)).rejects.toThrow('Deletion failed')
    })
  })

  describe('getRandomUniqueChores', () => {
    it('returns the requested number of random chores', () => {
      const result = getRandomUniqueChores(potentialUniqueChores, 3)
      
      // Check if result has correct length
      expect(result.length).toBe(3)
      
      // Check if all items are from the original list
      result.forEach(chore => {
        expect(potentialUniqueChores).toContain(chore)
      })
      
      // Check if all items are unique
      const uniqueItems = new Set(result)
      expect(uniqueItems.size).toBe(result.length)
    })

    it('handles requesting more chores than available', () => {
      // Create a small test list
      const testList = ['Chore 1', 'Chore 2']
      
      const result = getRandomUniqueChores(testList, 5)
      
      // Should return all available chores
      expect(result.length).toBe(2)
      expect(result).toContain('Chore 1')
      expect(result).toContain('Chore 2')
    })

    it('uses default list when no list is provided', () => {
      const result = getRandomUniqueChores(null, 3)
      
      // Check if result has correct length
      expect(result.length).toBe(3)
      
      // Check if all items are from the default list
      result.forEach(chore => {
        expect(potentialUniqueChores).toContain(chore)
      })
    })
  })
})
