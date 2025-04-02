// Mock for supabase
export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          data: [
            { id: 1, name: 'Test Chore 1', amount: 1.00 },
            { id: 2, name: 'Test Chore 2', amount: 2.00 }
          ],
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        data: [{ id: 3, name: 'New Chore', amount: 3.00 }],
        error: null
      })
    }),
    delete: () => ({
      eq: () => ({
        error: null
      })
    })
  })
};
