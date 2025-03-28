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
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    
    <!-- Weekly Totals -->
    <q-card class="bg-primary text-white">
      <q-card-section>
        <div class="text-h6">Total Earnings</div>
        <div class="row items-center">
          <div class="col">
            <div class="text-h3">{{ totalEarned }}</div>
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
  </q-page>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'SummaryPage',
  
  setup() {
    const $q = useQuasar()
    
    // Get data from local storage
    const choreData = $q.localStorage.getItem('choreData')
    const days = choreData.days
    
    const calculateDailyTotal = (day) => {
      let total = 0
      if (day.dailiesCompleted) total += 1
      if (day.uniqueCompleted) total += 1
      if (day.bonusAvailable && day.bonusCompleted) total += 1
      return total
    }
    
    // Calculate weekly totals
    const dailiesTotal = computed(() => {
      return days.filter(day => day.dailiesCompleted).length
    })
    
    const uniqueTotal = computed(() => {
      return days.filter(day => day.uniqueCompleted).length
    })
    
    const bonusTotal = computed(() => {
      return days.filter(day => day.bonusAvailable && day.bonusCompleted).length
    })
    
    const totalEarned = computed(() => {
      return dailiesTotal.value + uniqueTotal.value + bonusTotal.value
    })
    
    const resetWeek = () => {
      days.forEach(day => {
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
    
    return {
      days,
      calculateDailyTotal,
      dailiesTotal,
      uniqueTotal,
      bonusTotal,
      totalEarned,
      confirmReset
    }
  }
})
</script>