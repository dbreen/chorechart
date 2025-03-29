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
// Change 1: Update imports
import { defineComponent, computed } from 'vue' // <-- Add computed
import { useQuasar } from 'quasar'
// Import chore data and helper
import { standardDailyChores, potentialUniqueChores, bonusChore, getRandomUniqueChores } from '../data/chores.js'

export default defineComponent({
  name: 'IndexPage',
  
  setup() {
    const $q = useQuasar()
    
    const initializeWeek = () => {
      if (!$q.localStorage.has('choreData')) {
        // Change 2: Build defaultData dynamically
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const selectedUniqueChores = getRandomUniqueChores(potentialUniqueChores, daysOfWeek.length);

        const defaultData = {
          days: daysOfWeek.map((dayName, index) => ({
            name: dayName,
            // Deep copy standard chores, add completed status
            dailyChores: JSON.parse(JSON.stringify(standardDailyChores)).map(chore => ({ ...chore, completed: false })),
            // Assign a unique chore from the selected list
            uniqueChore: {
              id: 4, // Keep a consistent ID structure if needed, or remove if name is enough
              name: selectedUniqueChores[index],
              completed: false
            },
            // Use the imported bonus chore definition
            bonusChore: {
              id: bonusChore.id,
              name: bonusChore.name,
              completed: false,
              available: false // Keep availability logic separate
            },
            // Initialize status flags
            dailiesCompleted: false,
            uniqueCompleted: false,
            bonusCompleted: false,
            bonusAvailable: false, // Controlled on DayPage
            allCompleted: false
          })),
          lastResetDate: new Date().toISOString()
        };

        $q.localStorage.set('choreData', defaultData);
        return defaultData;
      }

      return $q.localStorage.getItem('choreData');
    }

    const choreData = initializeWeek();

    // Change 3: Update how 'days' for the template is derived (make computed)
    const days = computed(() => choreData.days.map(day => ({
      name: day.name,
      uniqueChore: day.uniqueChore.name, // Ensure this reads the name correctly
      dailiesCompleted: day.dailiesCompleted,
      uniqueCompleted: day.uniqueCompleted,
      bonusCompleted: day.bonusCompleted,
      bonusAvailable: day.bonusAvailable,
      allCompleted: day.allCompleted
    })))

    return {
      days // Return the computed property
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
