<template>
  <q-page padding>
    <h5 class="q-mt-none q-mb-md">Weekly Chores</h5>
    
    <div v-if="isLoading" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Loading...</div>
    </div>
    
    <div v-else class="row q-col-gutter-md">
      <div v-for="(day, index) in days" :key="'day-' + index" class="col-12 col-sm-6 col-md-4">
        <q-card 
          :class="['day-card', day.allCompleted ? 'completed-day' : 'incomplete-day']"
          @click="goToDay(day.name)">
          <q-card-section>
            <div class="text-h6">{{ day.name }}</div>
            <div class="text-subtitle2">{{ day.allCompleted ? 'Completed' : 'Incomplete' }}</div>
          </q-card-section>
          
          <q-card-section>
            <div class="text-body2">
              <div class="row items-center">
                <div class="col">
                  <q-badge :color="day.dailiesCompleted ? 'positive' : 'grey'"/> Daily chores
                </div>
                <div class="col-auto" v-if="day.dailiesCompleted">
                  <ChoreReward :completed="day.dailiesCompleted" type="daily" />
                </div>
              </div>
              <div class="row items-center">
                <div class="col">
                  <q-badge :color="day.uniqueCompleted ? 'positive' : 'grey'"/> {{ day.uniqueChore }}
                </div>
                <div class="col-auto" v-if="day.uniqueCompleted">
                  <ChoreReward :completed="day.uniqueCompleted" type="special" />
                </div>
              </div>
              <div v-if="day.bonusAvailable" class="row items-center">
                <div class="col">
                  <q-badge :color="day.bonusCompleted ? 'positive' : 'amber'"/> Bonus: Dishwasher
                </div>
                <div class="col-auto" v-if="day.bonusCompleted">
                  <ChoreReward :completed="day.bonusCompleted" type="bonus" />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <div class="fixed-bottom-right q-ma-md">
      <div class="column items-center">
        <q-btn
          class="q-mb-md"
          round
          color="secondary"
          icon="summarize"
          size="lg"
          to="/summary"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import ChoreReward from 'src/components/ChoreReward.vue'
import NuclearReset from 'src/components/NuclearReset.vue'
import { resetAppData } from 'src/utils/storage-reset'

export default defineComponent({
  name: 'IndexPage',
  
  components: {
    ChoreReward,
    NuclearReset
  },
  
  setup() {
    // Core data refs
    const $q = useQuasar()
    const router = useRouter()
    const days = ref([])
    const isLoading = ref(true)
    
    // Enable debug mode with URL parameter
    const debugMode = ref(window.location.search.includes('debug=true'))
    
    // Format days data for display
    const formatDaysData = (choreData) => {
      if (!choreData || !choreData.days) {
        console.error('Invalid choreData structure')
        return []
      }
      
      return choreData.days.map(day => ({
        name: day.name,
        uniqueChore: day.uniqueChore.name,
        dailiesCompleted: day.dailiesCompleted,
        uniqueCompleted: day.uniqueCompleted,
        bonusCompleted: day.bonusCompleted,
        bonusAvailable: day.bonusAvailable,
        allCompleted: day.allCompleted
      }))
    }
    
    // Load data from localStorage
    const loadData = () => {
      isLoading.value = true
      
      try {
        // Try to get data from localStorage
        let choreData = localStorage.getItem('choreData')
        
        // Parse the data if it exists
        if (choreData) {
          choreData = JSON.parse(choreData)
        } else {
          // If no data exists, initialize with default data
          resetAppData()
          choreData = JSON.parse(localStorage.getItem('choreData'))
        }
        
        // Format the data for display
        days.value = formatDaysData(choreData)
      } catch (error) {
        console.error('Error loading data:', error)
        // If there's an error, reset the app data
        resetAppData()
        
        // Try once more with the fresh data
        try {
          const choreData = JSON.parse(localStorage.getItem('choreData'))
          days.value = formatDaysData(choreData)
        } catch (e) {
          // If still failing, show empty state
          days.value = []
          $q.notify({
            message: 'Error loading data. Please refresh the page.',
            color: 'negative'
          })
        }
      }
      
      isLoading.value = false
    }
    
    // Navigate to day detail page
    const goToDay = (dayName) => {
      router.push(`/day/${dayName.toLowerCase()}`)
    }
    
    // Load data when component mounts
    onMounted(() => {
      loadData()
    })
    
    return {
      days,
      isLoading,
      goToDay,
      debugMode
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