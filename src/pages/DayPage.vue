<template>
  <q-page padding>
    <template v-if="day">
      <div class="row items-center q-mb-md">
        <div class="col">
          <h5 class="q-mt-none q-mb-md">{{ day.name }}</h5>
        </div>
        <!-- Dad Mode Toggle -->
        <div class="col-auto q-mr-sm">
          <q-toggle v-model="isDadMode" label="Dad Mode" color="red" />
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
          <!-- Show Input in Dad Mode, Checkbox otherwise -->
          <q-input
            v-if="isDadMode"
            v-model="day.uniqueChore.name"
            label="Edit Special Chore Name"
            dense
            @blur="saveData" <!-- Save when input loses focus -->
          />
          <q-checkbox
            v-else
            v-model="day.uniqueChore.completed"
            :label="day.uniqueChore.name"
            color="purple"
            @update:model-value="updateUniqueStatus"
          />
          <!-- Checkbox still needed in Dad Mode for completion -->
          <q-checkbox
             v-if="isDadMode"
             v-model="day.uniqueChore.completed"
             label="Completed"
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

      <!-- Extra Chores Section -->
      <q-card v-if="(day.extraChores && day.extraChores.length > 0) || isDadMode" class="chore-card extra-chore q-mt-md">
        <q-card-section>
          <div class="text-h6">Extra Chores</div>
          <div class="text-subtitle2">Ad-hoc tasks (worth $0)</div>
        </q-card-section>

        <q-card-section v-if="day.extraChores && day.extraChores.length > 0">
          <div v-for="(chore, index) in day.extraChores" :key="chore.id" class="row items-center q-mb-sm">
            <div class="col">
              <q-checkbox
                v-model="chore.completed"
                :label="chore.name"
                color="info"
                @update:model-value="saveData" <!-- Just save on completion toggle -->
              />
            </div>
            <div class="col-auto" v-if="isDadMode">
              <q-btn
                flat round dense
                icon="delete"
                color="negative"
                size="sm"
                @click="deleteExtraChore(index)"
              />
            </div>
          </div>
        </q-card-section>

        <!-- Add Extra Chore Button (only in Dad Mode) -->
        <q-card-actions v-if="isDadMode" align="right">
          <q-btn
            label="Add Extra Chore"
            color="secondary"
            icon="add"
            @click="addExtraChore"
          />
        </q-card-actions>
      </q-card>


      <!-- Toggle for bonus chore availability -->
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
import confetti from 'canvas-confetti' // <-- ADD THIS IMPORT

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
    const isDadMode = ref(false) // <-- Add Dad Mode state

    const saveData = () => {
      $q.localStorage.set('choreData', choreData.value)
    }

    // Helper function for confetti effect
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 } // Trigger from slightly above center
      });
    }
    
    const updateDailyStatus = () => {
      // Store previous state
      const wasCompleted = day.value.dailiesCompleted;
      // Check if all daily chores are completed
      day.value.dailiesCompleted = day.value.dailyChores.every(chore => chore.completed)
      // Trigger confetti if status changed to completed
      if (day.value.dailiesCompleted && !wasCompleted) {
        triggerConfetti(); // <-- Trigger confetti
      }
      updateAllCompleted()
      saveData()
    }
    
    const updateUniqueStatus = () => {
      // Store previous state
      const wasCompleted = day.value.uniqueCompleted;
      day.value.uniqueCompleted = day.value.uniqueChore.completed
      // Trigger confetti if status changed to completed
      if (day.value.uniqueCompleted && !wasCompleted) {
        triggerConfetti(); // <-- Trigger confetti
      }
      updateAllCompleted()
      saveData()
    }

    const updateBonusStatus = () => {
      // Store previous state
      const wasCompleted = day.value.bonusCompleted;
      day.value.bonusCompleted = day.value.bonusChore.completed
      // Trigger confetti if status changed to completed AND bonus is available
      if (day.value.bonusCompleted && !wasCompleted && day.value.bonusAvailable) {
        triggerConfetti(); // <-- Trigger confetti
      }
      updateAllCompleted()
      saveData()
    }

    // Add function to add extra chore
    const addExtraChore = () => {
      $q.dialog({
        title: 'Add Extra Chore',
        message: 'Enter the name for the new chore:',
        prompt: {
          model: '',
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk(name => {
        if (name && name.trim().length > 0) {
          // Ensure extraChores array exists
          if (!Array.isArray(day.value.extraChores)) {
            day.value.extraChores = [];
          }
          day.value.extraChores.push({
            id: Date.now(), // Simple unique ID
            name: name.trim(),
            completed: false
          });
          saveData();
        }
      });
    }

    // Add function to delete extra chore
    const deleteExtraChore = (index) => {
      day.value.extraChores.splice(index, 1);
      saveData();
    }
    
    const updateAllCompleted = () => {
      // Extra chores don't count towards 'allCompleted' for the day's main status
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
      isDadMode, // <-- Expose Dad Mode state
      saveData,
      updateDailyStatus,
      updateUniqueStatus,
      updateBonusStatus,
      calculateDailyTotal,
      addExtraChore, // <-- Expose add function
      deleteExtraChore // <-- Expose delete function
    }
  }
})
</script>

<style lang="scss" scoped>
/* Add some styling if needed */
.extra-chore {
  border-left: 5px solid $info; /* Use Quasar info color */
}
</style>
