<template>
  <q-page padding>
    <template v-if="day">
      <div class="row items-center q-mb-md">
        <div class="col">
          <h5 class="q-mt-none q-mb-md">{{ day.name }}</h5>
        </div>
        <div class="col-auto">
          <q-btn flat round icon="arrow_back" color="primary" to="/" />
        </div>
      </div>
      
      <!-- Daily Chores -->
      <q-card class="chore-card daily-chore">
        <q-card-section>
          <div class="text-h6">Daily Chores</div>
          <div class="text-subtitle2">Complete all 3 to earn $1</div>
        </q-card-section>
        
        <q-card-section>
          <div v-for="chore in day.dailyChores" :key="chore.id" class="q-mb-sm">
            <q-checkbox
              v-model="chore.completed"
              :label="chore.name"
              color="primary"
              @update:model-value="updateDailyStatus"
            />
          </div>
        </q-card-section>
        
        <q-card-section>
          <q-badge color="green" v-if="day.dailiesCompleted">Completed: $1 earned!</q-badge>
          <q-badge color="grey" v-else>In progress: $0</q-badge>
        </q-card-section>
      </q-card>
      
      <!-- Unique Chore -->
      <q-card class="chore-card unique-chore q-mt-md">
        <q-card-section>
          <div class="text-h6">Special Chore</div>
          <div class="text-subtitle2">Complete to earn $1</div>
        </q-card-section>
        
        <q-card-section>
          <q-checkbox
            v-model="day.uniqueChore.completed"
            :label="day.uniqueChore.name"
            color="purple"
            @update:model-value="updateUniqueStatus"
          />
        </q-card-section>
        
        <q-card-section>
          <q-badge color="green" v-if="day.uniqueCompleted">Completed: $1 earned!</q-badge>
          <q-badge color="grey" v-else>In progress: $0</q-badge>
        </q-card-section>
      </q-card>
      
      <!-- Bonus Chore (if available) -->
      <q-card v-if="day.bonusAvailable" class="chore-card bonus-chore q-mt-md">
        <q-card-section>
          <div class="text-h6">Bonus Chore</div>
          <div class="text-subtitle2">Complete to earn an extra $1</div>
        </q-card-section>
        
        <q-card-section>
          <q-checkbox
            v-model="day.bonusChore.completed"
            :label="day.bonusChore.name"
            color="amber-9"
            @update:model-value="updateBonusStatus"
          />
        </q-card-section>
        
        <q-card-section>
          <q-badge color="green" v-if="day.bonusCompleted">Completed: $1 earned!</q-badge>
          <q-badge color="grey" v-else>In progress: $0</q-badge>
        </q-card-section>
      </q-card>
      
      <!-- Toggle for bonus chore availability (parent mode feature) -->
      <div class="q-mt-lg">
        <q-toggle
          v-model="day.bonusAvailable"
          label="Dishwasher needs emptying today"
          color="amber"
          @update:model-value="saveData"
        />
      </div>
      
      <!-- Daily Summary -->
      <q-card class="q-mt-lg">
        <q-card-section>
          <div class="text-h6">Today's Earnings</div>
          <div class="text-h5">
            ${{ calculateDailyTotal() }}
          </div>
        </q-card-section>
      </q-card>
    </template>
    
    <template v-else>
      <div class="text-center q-pa-md">
        <p>Day not found</p>
        <q-btn color="primary" to="/" label="Go Home" />
      </div>
    </template>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'DayPage',
  
  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const dayName = route.params.dayName
    
    // Get data from local storage
    const choreData = ref($q.localStorage.getItem('choreData'))
    
    // Find current day
    const dayIndex = choreData.value.days.findIndex(
      d => d.name.toLowerCase() === dayName
    )
    
    if (dayIndex === -1) {
      return { day: null }
    }
    
    const day = ref(choreData.value.days[dayIndex])
    
    const saveData = () => {
      $q.localStorage.set('choreData', choreData.value)
    }
    
    const updateDailyStatus = () => {
      // Check if all daily chores are completed
      day.value.dailiesCompleted = day.value.dailyChores.every(chore => chore.completed)
      updateAllCompleted()
      saveData()
    }
    
    const updateUniqueStatus = () => {
      day.value.uniqueCompleted = day.value.uniqueChore.completed
      updateAllCompleted()
      saveData()
    }
    
    const updateBonusStatus = () => {
      day.value.bonusCompleted = day.value.bonusChore.completed
      updateAllCompleted()
      saveData()
    }
    
    const updateAllCompleted = () => {
      // A day is considered fully completed if all required chores are done
      // Bonus is only required if it's available
      const requiredCompleted = day.value.dailiesCompleted && day.value.uniqueCompleted
      const bonusRequirement = day.value.bonusAvailable ? day.value.bonusCompleted : true
      
      day.value.allCompleted = requiredCompleted && bonusRequirement
    }
    
    const calculateDailyTotal = () => {
      let total = 0
      if (day.value.dailiesCompleted) total += 1
      if (day.value.uniqueCompleted) total += 1
      if (day.value.bonusAvailable && day.value.bonusCompleted) total += 1
      return total
    }
    
    return {
      day,
      saveData,
      updateDailyStatus,
      updateUniqueStatus,
      updateBonusStatus,
      calculateDailyTotal
    }
  }
})
</script>