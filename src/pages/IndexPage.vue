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
              <!-- Add indicator for extra chores -->
              <div v-if="day.extraChoresCount > 0">
                <q-badge color="info"/> {{ day.extraChoresCount }} Extra Chore(s)
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
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { bonusChore, getRandomUniqueChores, getStandardChores } from '../data/chores.js'
import { userSession } from 'boot/supabase'

export default defineComponent({
  name: 'IndexPage',
  
  setup() {
    const $q = useQuasar()
    const userChores = ref([])
    
    // Fetch user's chores when component mounts
    onMounted(async () => {
      if (userSession.value) {
        try {
          userChores.value = await getStandardChores(userSession.value.user.id)
        } catch (error) {
          console.error('Error loading chores:', error)
          $q.notify({ type: 'negative', message: 'Failed to load chores' })
        }
      }
    })
    
    const initializeWeek = () => {
      if (!$q.localStorage.has('choreData')) {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        // Use actual user chores from database or fallback to empty array if none loaded yet
        const availableChores = userChores.value.length > 0 
          ? userChores.value.map(c => c.name)
          : ['Make bed', 'Clean room', 'Take out trash', 'Set table', 'Feed pet'];
          
        const selectedUniqueChores = getRandomUniqueChores(availableChores, daysOfWeek.length);

        const defaultData = {
          days: daysOfWeek.map((dayName, index) => ({
            name: dayName,
            // We'll need to update this with actual daily chores later
            dailyChores: [
              { id: 1, name: 'Make bed', completed: false },
              { id: 2, name: 'Clean room', completed: false },
              { id: 3, name: 'Take out trash', completed: false }
            ],
            // Assign a unique chore from the selected list
            uniqueChore: {
              id: 4,
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
            allCompleted: false,
            extraChores: []
          })),
          lastResetDate: new Date().toISOString()
        };

        $q.localStorage.set('choreData', defaultData);
        return defaultData;
      }

      return $q.localStorage.getItem('choreData');
    }

    const choreData = initializeWeek();

    const days = computed(() => choreData.days.map(day => ({
      name: day.name,
      uniqueChore: day.uniqueChore.name, // Ensure this reads the name correctly
      dailiesCompleted: day.dailiesCompleted,
      uniqueCompleted: day.uniqueCompleted,
      bonusCompleted: day.bonusCompleted,
      bonusAvailable: day.bonusAvailable,
      allCompleted: day.allCompleted,
      extraChoresCount: day.extraChores ? day.extraChores.length : 0
    })))

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
