<template>
  <div class="confetti-container" v-if="active">
    <div v-for="(particle, index) in particles" 
         :key="index" 
         class="confetti-particle"
         :style="particleStyle(particle)">
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'RewardConfetti',
  
  props: {
    count: {
      type: Number,
      default: 50
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props) {
    const particles = ref([])
    
    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min
    }
    
    const createParticles = () => {
      particles.value = []
      for (let i = 0; i < props.count; i++) {
        particles.value.push({
          color: `hsl(${Math.floor(randomInRange(0, 360))}, 70%, 60%)`,
          x: randomInRange(0, 100),
          y: randomInRange(-20, -5),
          size: randomInRange(5, 12),
          speed: randomInRange(1, 3),
          rotation: randomInRange(0, 360),
          rotationSpeed: randomInRange(-5, 5)
        })
      }
    }
    
    const particleStyle = (particle) => {
      return {
        backgroundColor: particle.color,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        transform: `rotate(${particle.rotation}deg)`
      }
    }
    
    onMounted(() => {
      createParticles()
    })
    
    return {
      particles,
      particleStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
}

.confetti-particle {
  position: absolute;
  border-radius: 3px;
  opacity: 0;
  animation: fall 3s ease-in-out forwards;
}

@keyframes fall {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    top: 100%;
  }
}
</style>