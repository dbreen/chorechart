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
            <!-- Add section for extra chores -->
            <q-item-label caption v-if="day.extraChores && day.extraChores.length > 0">
              Extra:
              <span v-for="(extra, index) in day.extraChores" :key="extra.id">
                <q-icon :name="extra.completed ? 'check_box' : 'check_box_outline_blank'" size="xs" :color="extra.completed ? 'positive' : 'grey'" />
                {{ extra.name }}{{ index < day.extraChores.length - 1 ? '; ' : '' }}
              </span>
            </q-item-label>
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
            <div class="text-h3">${{ totalEarned }}</div>
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
        <div class="text-subtitle1">Extra chores: ${{ extraTotal }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import confetti from 'canvas-confetti'
// Import chore data and helper
import { potentialUniqueChores, getRandomUniqueChores } from '../data/chores.js' // Only need potential list and helper here

export default defineComponent({
  name: 'SummaryPage',
  
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const confettiIntervalId = ref(null)

    // Non-reactive approach for display (as currently implemented)
    const initialChoreData = $q.localStorage.getItem('choreData')
    const daysForDisplay = initialChoreData.days // Use this for computed totals below

    const calculateDailyTotal = (day) => {
      let total = 0
      if (day.dailiesCompleted) total += 1
      if (day.uniqueCompleted) total += 1
      if (day.bonusAvailable && day.bonusCompleted) total += 1
      
      // Add earnings from extra chores
      if (day.extraChores && day.extraChores.length > 0) {
        day.extraChores.forEach(chore => {
          if (chore.completed) total += 1
        })
      }
      
      return total
    }
    
    // Computed properties based on the initial data for display
    const dailiesTotal = computed(() => {
      return daysForDisplay.filter(day => day.dailiesCompleted).length
    })

    const uniqueTotal = computed(() => {
      return daysForDisplay.filter(day => day.uniqueCompleted).length
    })

    const bonusTotal = computed(() => {
      return daysForDisplay.filter(day => day.bonusAvailable && day.bonusCompleted).length
    })
    
    // Add extra chores total computation
    const extraTotal = computed(() => {
      let total = 0
      daysForDisplay.forEach(day => {
        if (day.extraChores && day.extraChores.length > 0) {
          day.extraChores.forEach(chore => {
            if (chore.completed) total += 1
          })
        }
      })
      return total
    })

    const totalEarned = computed(() => {
      return dailiesTotal.value + uniqueTotal.value + bonusTotal.value + extraTotal.value
    })

    // Define confetti function for rain effect
    const launchConfettiRain = () => {
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 55,
        origin: { y: 0 },
        disableForReducedMotion: true
      });
    }

    onMounted(() => {
      confettiIntervalId.value = setInterval(launchConfettiRain, 800);
    })

    onUnmounted(() => {
      if (confettiIntervalId.value) {
        clearInterval(confettiIntervalId.value);
      }
    })

    const resetWeek = () => {
      const currentChoreData = $q.localStorage.getItem('choreData');
      const daysToReset = currentChoreData.days;

      const newUniqueChores = getRandomUniqueChores(potentialUniqueChores, daysToReset.length);

      daysToReset.forEach((day, index) => {
        // Reset daily chores
        day.dailyChores.forEach(chore => {
          chore.completed = false;
        });

        day.uniqueChore.name = newUniqueChores[index];
        day.uniqueChore.completed = false;

        // Reset bonus chore
        day.bonusChore.completed = false;
        day.bonusAvailable = false; // Reset availability as well

        // Clear extra chores
        day.extraChores = [];

        // Reset status flags
        day.dailiesCompleted = false;
        day.uniqueCompleted = false;
        day.bonusCompleted = false;
        day.allCompleted = false;
      });

      // Update reset date
      currentChoreData.lastResetDate = new Date().toISOString();

      // Save updated data to local storage
      $q.localStorage.set('choreData', currentChoreData);

      // Show confirmation
      $q.notify({
        message: 'Week has been reset successfully with new chores',
        color: 'positive'
      })
      
      // Navigate home
      router.push('/')
    }
    
    const confirmReset = () => {
      $q.dialog({
        title: 'Reset Week',
        message: 'This will clear all chores, assign new random special chores, and start a new week. Are you sure?', // Updated message
        cancel: true,
        persistent: true
      }).onOk(() => {
        resetWeek()
      })
    }

    return {
      days: daysForDisplay, // Return the display data
      calculateDailyTotal,
      dailiesTotal,
      uniqueTotal,
      bonusTotal,
      extraTotal,
      totalEarned,
      confirmReset
    }
  }
})
</script>
