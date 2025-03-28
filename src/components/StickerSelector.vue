<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 300px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Choose a reward sticker!</div>
        <q-space />
        <q-btn v-if="allowSkip" icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <p>Great job completing your chore! Pick a sticker as a reward:</p>
        
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab v-for="(category, key) in stickerCollection" :key="key" :name="key" :label="formatCategoryName(key)" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel v-for="(category, key) in stickerCollection" :key="key" :name="key">
            <div class="row justify-center q-gutter-md">
              <q-btn
                v-for="sticker in category"
                :key="sticker.id"
                class="sticker-btn"
                flat
                round
                @click="selectSticker(sticker)"
              >
                <div class="text-h4">{{ sticker.emoji }}</div>
              </q-btn>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-section align="right">
        <q-btn color="primary" label="Random Sticker" @click="selectRandomSticker" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { stickerCollection, getRandomSticker } from 'src/data/stickers'

export default defineComponent({
  name: 'StickerSelector',
  
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    allowSkip: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['update:modelValue', 'select'],
  
  setup(props, { emit }) {
    const activeTab = ref(Object.keys(stickerCollection)[0])
    
    const isOpen = ref(props.modelValue)
    
    const selectSticker = (sticker) => {
      emit('select', sticker)
      emit('update:modelValue', false)
      isOpen.value = false
    }
    
    const selectRandomSticker = () => {
      selectSticker(getRandomSticker())
    }
    
    const formatCategoryName = (name) => {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    
    return {
      activeTab,
      stickerCollection,
      isOpen,
      selectSticker,
      selectRandomSticker,
      formatCategoryName
    }
  },
  
  watch: {
    modelValue(val) {
      this.isOpen = val
    },
    isOpen(val) {
      if (!val) emit('update:modelValue', false)
    }
  }
})
</script>

<style lang="scss" scoped>
.sticker-btn {
  width: 60px;
  height: 60px;
  margin: 5px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
}
</style>
