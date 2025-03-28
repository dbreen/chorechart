<template>
  <q-page padding>
    <h5 class="q-mt-none q-mb-md">Weekly Chores</h5>
    
    <div class="row q-col-gutter-md">
      <div v-for="day in days" :key="day.name" class="col-12 col-sm-6 col-md-4">
        <q-card 
          :class="['day-card', day.allCompleted ? 'completed-day' : 'incomplete-day']"
          @click="$router.push(`/day/${day.name.toLowerCase()}`)">
          <q-card-section>
            <div class="text-h6">{{ day.name }}</div>
            <div class="text-subtitle2">{{ day.allCompleted ? 'Completed' : 'Incomplete' }}</div>
          </q-card-section>
          
          <q-card-section>
            <div class="text-body2">
              <div><q-badge :color="day.dailiesCompleted ? 'positive' : 'grey'"/> Daily chores</div>
              <div><q-badge :color="day.uniqueCompleted ? 'positive' : 'grey'"/> {{ day.uniqueChore }}</div>
              <div v-if="day.bonusAvailable">
                <q-badge :color="day.bonusCompleted ? 'positive' : 'amber'"/> Bonus: Dishwasher
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <div class="fixed-bottom-right q-ma-md">
      <q-btn
        round
        color="secondary"
        icon="summarize"
        size="lg"
        to="/summary"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  
  setup() {
    const $q = useQuasar()
    
    // Get data from local storage or initialize if not present
    const initializeWeek = () => {
      if (!$q.localStorage.has('choreData')) {
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
              bonusChore: { id: 5, name: 'Empty dishwasher', completed: false, available: false },
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
              bonusChore: { id: 5, name: 'Empty dishwasher', completed: false, available: false },
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
              bonusChore: { id: 5, name: 'Empty dishwasher', completed: false, available: false },
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
              bonusChore: { id: 5, name: 'Empty dishwasher', completed: false, available: false },
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
              bonusChore: { id: 5, name: 'Empty dishwasher', completed: false, available: false },
              dailiesCompleted: false,
              uniqueCompleted: false,
              bonusCompleted: false,
              bonusAvailable: false,
              allCompleted: false
            }
          ],
          lastResetDate: new Date().toISOString()
        }
        
        $q.localStorage.set('choreData', defaultData)
        return defaultData
      }
      
      return $q.localStorage.getItem('choreData')
    }
    
    const choreData = initializeWeek()
    
    // Format data for display
    const days = choreData.days.map(day => ({
      name: day.name,
      uniqueChore: day.uniqueChore.name,
      dailiesCompleted: day.dailiesCompleted,
      uniqueCompleted: day.uniqueCompleted,
      bonusCompleted: day.bonusCompleted,
      bonusAvailable: day.bonusAvailable,
      allCompleted: day.allCompleted
    }))
    
    return {
      days
    }
  }
})
</script>

<style lang="scss" scoped>
.fixed-bottom-right {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>