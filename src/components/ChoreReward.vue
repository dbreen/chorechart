<template>
  <div class="reward-container" :class="{ 'animate-reward': animate }">
    <div v-if="completed" class="reward">
      {{ rewardEmoji }}
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'

export default defineComponent({
  name: 'ChoreReward',
  
  props: {
    completed: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'daily',
      validator: (value) => ['daily', 'special', 'bonus'].includes(value)
    }
  },
  
  setup(props) {
    // Emoji selection based on chore type
    const rewardEmoji = computed(() => {
      const rewards = {
        daily: ['🌟', '⭐', '✨', '🎯', '👍'],
        special: ['🏆', '🥇', '🎖️', '🏅', '🔥'],
        bonus: ['💎', '💰', '🎁', '💯', '🌈']
      }
      
      // Get random emoji from the appropriate list
      const list = rewards[props.type] || rewards.daily
      const randomIndex = Math.floor(Math.random() * list.length)
      return list[randomIndex]
    })
    
    // Animation flag to trigger CSS animation
    const animate = ref(false)
    
    // Watch for completion and trigger animation
    watch(() => props.completed, (newVal, oldVal) => {
      if (newVal && !oldVal) {
        animate.value = true
        setTimeout(() => {
          animate.value = false
        }, 1000)
      }
    })
    
    return {
      rewardEmoji,
      animate
    }
  }
})
</script>

<style lang="scss" scoped>
.reward-container {
  display: inline-block;
  min-width: 36px;
  min-height: 36px;
  text-align: center;
}

.reward {
  font-size: 1.75rem;
  line-height: 1;
  padding: 4px;
}

.animate-reward {
  animation: pop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>