<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <h5 class="q-mt-none q-mb-md">Weekly Summary</h5>
      </div>
      <div class="col-auto">
        <q-btn flat round icon="arrow_back" color="primary" to="/" />
      </div>
    </div>
    
    <!-- Weekly Overview -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">This Week's Progress</div>
      </q-card-section>
      
      <q-list bordered separator>
        <q-item v-for="day in days" :key="day.name">
          <q-item-section>
            <q-item-label>{{ day.name }}</q-item-label>
          </q-item-section>
          
          <q-item-section side>
            <div class="row items-center">
              <q-badge
                :color="day.dailiesCompleted ? 'positive' : 'grey'"
                class="q-mr-xs"
                label="Daily"
              />
              <q-badge
                :color="day.uniqueCompleted ? 'positive' : 'grey'"
                class="q-mr-xs"
                label="Special"
              />
              <q-badge
                v-if="day.bonusAvailable"
                :color="day.bonusCompleted ? 'positive' : 'amber'"
                label="Bonus"
              />
              <q-badge
                class="q-ml-sm"
                color="primary"
              >
                ${{ calculateDailyTotal(day) }}
              </q-badge>
              <ChoreReward 
                v-if="calculateDailyTotal(day) > 0" 
                :completed="true" 
                :type="dayRewardType(day)" 
                class="q-ml-sm"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    
    <!-- Weekly Totals -->
    <q-card class="bg-primary text-white">
      <q-card-section class="relative-position">
        <RewardConfetti :active="showConfetti" />
        <div class="text-h6">Total Earnings</div>
        <div class="row items-center">
          <div class="col">
            <div class="text-h3" @click="triggerConfetti">${{ totalEarned }}</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="white"
              text-color="primary"
              label="Reset Week"
              @click="confirmReset"
            />
          </div>
        </div>
      </q-card-section>
      
      <q-card-section>
        <div class="text-subtitle1">Daily chores: ${{ dailiesTotal }}</div>
        <div class="text-subtitle1">Special chores: ${{ uniqueTotal }}</div>
        <div class="text-subtitle1">Bonus chores: ${{ bonusTotal }}</div>
      </q-card-section>
    </q-card>
    
    <!-- Reset Storage Button - Only visible when developer mode is on -->
    <div class="q-mt-xl text-center">
      <ResetStorage v-if="devMode" />
      <div class="q-mt-sm">
        <q-btn flat size="sm" color="grey" @click="toggleDevMode">{{ devMode ? 'Hide Developer Options' : '...' }}</q-btn>
      </div>
    </div>
    
  </q-page>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ChoreReward from 'src/components/ChoreReward.vue'
import RewardConfetti from 'src/components/RewardConfetti.vue'
import ResetStorage from 'src/components/ResetStorage.vue'

export default defineComponent({
  components: {
    ChoreReward,
    RewardConfetti,
    ResetStorage
  },
  name: 'SummaryPage',
  
  setup() {
    const $q = useQuasar()
    const showConfetti = ref(false)
    const devMode = ref(false)
    const days = ref([])
    
    // Get fresh data from local storage
    const loadData = () => {
      const choreData = $q.localStorage.getItem('choreData')
      if (choreData && choreData.days) {
        days.value = choreData.days
      }
    }
    
    // Load data when component mounts
    onMounted(() => {
      loadData()
    })
    
    const calculateDailyTotal = (day) => {
      let total = 0
      if (day.dailiesCompleted) total += 1
      if (day.uniqueCompleted) total += 1
      if (day.bonusAvailable && day.bonusCompleted) total += 1
      return total
    }
    
    // Determine which reward type to show based on what's completed
    const dayRewardType = (day) => {
      if (day.bonusAvailable && day.bonusCompleted) return 'bonus'
      if (day.uniqueCompleted) return 'special'
      return 'daily'
    }
    
    // Calculate weekly totals
    const dailiesTotal = computed(() => {
      return days.value.filter(day => day.dailiesCompleted).length
    })
    
    const uniqueTotal = computed(() => {
      return days.value.filter(day => day.uniqueCompleted).length
    })
    
    const bonusTotal = computed(() => {
      return days.value.filter(day => day.bonusAvailable && day.bonusCompleted).length
    })
    
    const totalEarned = computed(() => {
      return dailiesTotal.value + uniqueTotal.value + bonusTotal.value
    })
    
    const resetWeek = () => {
      // Get fresh data
      const choreData = $q.localStorage.getItem('choreData')
      if (!choreData || !choreData.days) return
      
      days.value.forEach(day => {
        // Reset daily chores
        day.dailyChores.forEach(chore => {
          chore.completed = false
        })
        
        // Reset unique chore
        day.uniqueChore.completed = false
        
        // Reset bonus chore
        day.bonusChore.completed = false
        day.bonusAvailable = false
        
        // Reset status flags
        day.dailiesCompleted = false
        day.uniqueCompleted = false
        day.bonusCompleted = false
        day.allCompleted = false
      })
      
      // Update reset date
      choreData.lastResetDate = new Date().toISOString()
      
      // Save to local storage
      $q.localStorage.set('choreData', choreData)
      
      // Show confirmation
      $q.notify({
        message: 'Week has been reset successfully',
        color: 'positive'
      })
      
      // Reload the data
      loadData()
    }
    
    const confirmReset = () => {
      $q.dialog({
        title: 'Reset Week',
        message: 'This will clear all chores and start a new week. Are you sure?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        resetWeek()
      })
    }
    
    const triggerConfetti = () => {
      // Only show confetti if there are earnings
      if (totalEarned.value > 0) {
        showConfetti.value = true
        
        // Reset after animation completes
        setTimeout(() => {
          showConfetti.value = false
        }, 3000)
      }
    }
    
    // Show confetti automatically on page load if there are earnings
    if (totalEarned.value > 0) {
      setTimeout(() => {
        triggerConfetti()
      }, 500)
    }
    
    // Toggle developer mode
    const toggleDevMode = () => {
      devMode.value = !devMode.value
    }
    
    return {
      days,
      calculateDailyTotal,
      dayRewardType,
      dailiesTotal,
      uniqueTotal,
      bonusTotal,
      totalEarned,
      confirmReset,
      showConfetti,
      triggerConfetti,
      devMode,
      toggleDevMode
    }
  }
})
</script>