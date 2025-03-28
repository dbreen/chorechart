<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-btn icon="arrow_back" flat round to="/" />
      <h5 class="q-mt-none q-mb-md inline-block q-ml-sm">{{ dayData.name }}</h5>
    </div>
    
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Daily Chores</div>
        <div class="text-subtitle2">Complete all three for $1</div>
      </q-card-section>
      
      <q-card-section>
        <div v-for="chore in dayData.dailyChores" :key="chore.id" class="q-mb-sm">
          <q-checkbox 
            v-model="chore.completed" 
            :label="chore.name" 
            @update:model-value="onChoreComplete('daily', chore)"
          />
          <q-badge v-if="chore.sticker" class="q-ml-sm" rounded>
            <span class="text-body1">{{ chore.sticker.emoji }}</span>
          </q-badge>
        </div>
      </q-card-section>
    </q-card>
    
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Special Chore</div>
        <div class="text-subtitle2">Worth $1</div>
      </q-card-section>
      
      <q-card-section>
        <q-checkbox 
          v-model="dayData.uniqueChore.completed" 
          :label="dayData.uniqueChore.name" 
          @update:model-value="onChoreComplete('unique', dayData.uniqueChore)"
        />
        <q-badge v-if="dayData.uniqueChore.sticker" class="q-ml-sm" rounded>
          <span class="text-body1">{{ dayData.uniqueChore.sticker.emoji }}</span>
        </q-badge>
      </q-card-section>
    </q-card>
    
    <q-card v-if="dayData.bonusAvailable">
      <q-card-section>
        <div class="text-h6">Bonus Chore</div>
        <div class="text-subtitle2">Worth $1</div>
      </q-card-section>
      
      <q-card-section>
        <q-checkbox 
          v-model="dayData.bonusChore.completed" 
          :label="dayData.bonusChore.name" 
          @update:model-value="onChoreComplete('bonus', dayData.bonusChore)"
        />
        <q-badge v-if="dayData.bonusChore.sticker" class="q-ml-sm" rounded>
          <span class="text-body1">{{ dayData.bonusChore.sticker.emoji }}</span>
        </q-badge>
      </q-card-section>
    </q-card>

    <!-- Debug panel -->
    <div class="q-pa-md q-mt-lg text-grey-8" v-if="$q.localStorage.getItem('debugMode')">
      <p class="text-caption">Debug Info:</p>
      <p class="text-caption">Sticker dialog active: {{ showStickerSelector }}</p>
      <p class="text-caption">Current chore: {{ currentChore ? currentChore.name : 'none' }}</p>
      <q-btn size="sm" label="Toggle Debug" @click="toggleDebugMode" color="grey-7" flat />
    </div>

    <!-- Test button for stickers -->
    <div class="fixed-bottom-right q-mb-xl q-mr-md">
      <q-btn 
        color="secondary" 
        label="Test Sticker" 
        @click="testSticker"
        icon="science"
        round
      />
    </div>

    <!-- Sticker selector component -->
    <StickerSelector 
      v-model="showStickerSelector"
      :allow-skip="false"
      @select="assignSelectedSticker"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import StickerSelector from 'src/components/StickerSelector.vue';

export default defineComponent({
  name: 'DayDetail',
  
  components: {
    StickerSelector
  },
  
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const choreData = ref(null);
    const dayData = ref({});
    const dayName = computed(() => route.params.name);
    const showStickerSelector = ref(false);
    const currentChore = ref(null);
    const currentChoreType = ref(null);
    
    onMounted(() => {
      loadChoreData();
    });
    
    const loadChoreData = () => {
      choreData.value = $q.localStorage.getItem('choreData');
      const day = choreData.value.days.find(d => 
        d.name.toLowerCase() === dayName.value.toLowerCase()
      );
      
      if (day) {
        dayData.value = day;
      } else {
        $q.notify({
          color: 'negative',
          message: 'Day not found!'
        });
      }
    };
    
    const updateCompletionStatus = () => {
      // Update dailies completion status
      dayData.value.dailiesCompleted = dayData.value.dailyChores.every(chore => chore.completed);
      
      // Update unique completion status
      dayData.value.uniqueCompleted = dayData.value.uniqueChore.completed;
      
      // Update bonus completion status if available
      if (dayData.value.bonusAvailable) {
        dayData.value.bonusCompleted = dayData.value.bonusChore.completed;
      }
      
      // Update overall completion status
      dayData.value.allCompleted = 
        dayData.value.dailiesCompleted && 
        dayData.value.uniqueCompleted && 
        (!dayData.value.bonusAvailable || dayData.value.bonusCompleted);
      
      // Save to storage
      saveChoreData();
    };
    
    const saveChoreData = () => {
      const dayIndex = choreData.value.days.findIndex(d => 
        d.name.toLowerCase() === dayName.value.toLowerCase()
      );
      
      if (dayIndex !== -1) {
        choreData.value.days[dayIndex] = dayData.value;
        $q.localStorage.set('choreData', choreData.value);
      }
    };
    
    const onChoreComplete = (type, chore) => {
      console.log('Chore completed:', chore.name, 'completed:', chore.completed);
      
      if (chore.completed && !chore.sticker) {
        // User completed a chore, show sticker selector
        console.log('Showing sticker selector');
        currentChore.value = chore;
        currentChoreType.value = type;
        
        // Force the sticker selector to open with a slight delay
        setTimeout(() => {
          showStickerSelector.value = true;
        }, 100);
      } else {
        // Just update completion status
        updateCompletionStatus();
      }
    };
    
    const assignSelectedSticker = (sticker) => {
      if (currentChore.value) {
        // Add sticker to the chore
        currentChore.value.sticker = sticker;
        
        // Show a notification
        $q.notify({
          message: `You earned a ${sticker.name} sticker! 🎉`,
          color: 'positive',
          timeout: 2000
        });
        
        // Update completion status and save
        updateCompletionStatus();
        
        // Reset current chore
        currentChore.value = null;
      }
    };
    
    const testSticker = () => {
      // Force a sticker selection dialog
      showStickerSelector.value = true;
    };
    
    const toggleDebugMode = () => {
      const current = $q.localStorage.getItem('debugMode') || false;
      $q.localStorage.set('debugMode', !current);
      $q.notify({
        message: `Debug mode ${!current ? 'enabled' : 'disabled'}`,
        color: 'info'
      });
    };
    
    return {
      dayData,
      showStickerSelector,
      onChoreComplete,
      assignSelectedSticker,
      currentChore,
      testSticker,
      toggleDebugMode
    };
  }
});
</script>

<style lang="scss" scoped>
.fixed-bottom-right {
  position: fixed;
  right: 20px;
  bottom: 80px;
}
</style>
