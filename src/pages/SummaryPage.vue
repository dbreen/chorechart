<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-btn icon="arrow_back" flat round to="/" />
      <h5 class="q-mt-none q-mb-md inline-block q-ml-sm">Weekly Summary</h5>
    </div>
    
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Allowance Earned</div>
        <div class="text-h4">${{ totalEarned }}</div>
      </q-card-section>
    </q-card>
    
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Daily Breakdown</div>
      </q-card-section>
      
      <q-list>
        <q-item v-for="day in days" :key="day.name" :class="day.allCompleted ? 'bg-green-1' : ''">
          <q-item-section>
            <q-item-label>{{ day.name }}</q-item-label>
          </q-item-section>
          
          <q-item-section>
            <q-chip v-if="day.dailiesCompleted" color="positive" text-color="white" size="sm">
              Daily: $1
            </q-chip>
            <q-chip v-if="day.uniqueCompleted" color="positive" text-color="white" size="sm">
              Special: $1
            </q-chip>
            <q-chip v-if="day.bonusCompleted" color="positive" text-color="white" size="sm">
              Bonus: $1
            </q-chip>
          </q-item-section>
          
          <q-item-section side>
            <div class="text-subtitle1">${{ getDayEarnings(day) }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Your Sticker Collection</div>
      </q-card-section>
      
      <q-card-section>
        <div class="row q-gutter-sm sticker-collection">
          <q-badge 
            v-for="(sticker, index) in earnedStickers" 
            :key="index" 
            rounded 
            class="sticker-badge"
          >
            <span class="text-h5">{{ sticker.emoji }}</span>
          </q-badge>
          
          <div v-if="earnedStickers.length === 0" class="text-center full-width text-grey">
            No stickers earned yet. Complete chores to earn cool stickers!
          </div>
        </div>
      </q-card-section>
    </q-card>
    
    <q-card>
      <q-card-actions align="right">
        <q-btn color="primary" label="Reset Week" @click="confirmReset" />
      </q-card-actions>
    </q-card>
    
    <q-dialog v-model="showResetConfirm">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="md" class="q-mr-sm"/>
          <span class="text-h6">Reset Week?</span>
        </q-card-section>
        
        <q-card-section>
          This will clear all tasks and start a fresh week. Your sticker collection will be preserved.
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Reset" color="negative" @click="resetWeek" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'SummaryPage',
  
  setup() {
    const $q = useQuasar();
    const choreData = ref(null);
    const days = ref([]);
    const showResetConfirm = ref(false);
    const earnedStickers = ref([]);
    
    onMounted(() => {
      loadChoreData();
    });
    
    const loadChoreData = () => {
      choreData.value = $q.localStorage.getItem('choreData');
      days.value = choreData.value.days;
      
      // Collect all earned stickers
      earnedStickers.value = collectEarnedStickers();
    };
    
    const collectEarnedStickers = () => {
      const stickers = [];
      
      days.value.forEach(day => {
        // Check daily chores for stickers
        day.dailyChores.forEach(chore => {
          if (chore.sticker) {
            stickers.push(chore.sticker);
          }
        });
        
        // Check unique chore
        if (day.uniqueChore.sticker) {
          stickers.push(day.uniqueChore.sticker);
        }
        
        // Check bonus chore
        if (day.bonusChore.sticker) {
          stickers.push(day.bonusChore.sticker);
        }
      });
      
      return stickers;
    };
    
    const getDayEarnings = (day) => {
      let total = 0;
      if (day.dailiesCompleted) total += 1;
      if (day.uniqueCompleted) total += 1;
      if (day.bonusCompleted) total += 1;
      return total;
    };
    
    const totalEarned = computed(() => {
      return days.value.reduce((total, day) => {
        return total + getDayEarnings(day);
      }, 0);
    });
    
    const confirmReset = () => {
      showResetConfirm.value = true;
    };
    
    const resetWeek = () => {
      // Save the sticker collection before reset
      const savedStickers = collectEarnedStickers();
      
      // Reset all chores
      days.value.forEach(day => {
        // Reset daily chores
        day.dailyChores.forEach(chore => {
          chore.completed = false;
          // Keep the sticker data
        });
        
        // Reset unique chore
        day.uniqueChore.completed = false;
        // Keep the sticker data
        
        // Reset bonus chore
        day.bonusChore.completed = false;
        // Keep the sticker data
        
        // Reset completion flags
        day.dailiesCompleted = false;
        day.uniqueCompleted = false;
        day.bonusCompleted = false;
        day.allCompleted = false;
      });
      
      // Update reset date
      choreData.value.lastResetDate = new Date().toISOString();
      
      // Save updated data
      $q.localStorage.set('choreData', choreData.value);
      
      // Store sticker collection in separate storage
      $q.localStorage.set('stickerCollection', savedStickers);
      
      $q.notify({
        message: 'Week reset successfully!',
        color: 'positive'
      });
    };
    
    return {
      days,
      totalEarned,
      getDayEarnings,
      showResetConfirm,
      confirmReset,
      resetWeek,
      earnedStickers
    };
  }
});
</script>

<style lang="scss" scoped>
.sticker-collection {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.sticker-badge {
  padding: 10px;
  margin: 5px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
}
</style>