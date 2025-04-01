<template>
  <q-page padding>
    <div class="q-pa-md">
      <h4 class="q-mt-none q-mb-md">Manage Chores</h4>
      
      <!-- Add new chore form -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Add New Chore</div>
          <q-form @submit="addChore" class="q-gutter-md" ref="choreForm">
            <q-input
              v-model="newChore.name"
              label="Chore Name"
              :rules="[val => !!val || 'Chore name is required']"
              outlined
              dense
              reactive-rules
              lazy-rules
            />
            <q-input
              v-model.number="newChore.amount"
              label="Amount"
              type="number"
              step="0.10"
              min="0"
              :rules="[val => val >= 0 || 'Must be $0 or more']"
              outlined
              dense
              reactive-rules
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
            <div class="row justify-end">
              <q-btn
                type="submit"
                color="primary"
                label="Add Chore"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      
      <!-- List of existing chores -->
      <q-card>
        <q-card-section>
          <div class="text-h6">Your Chores</div>
          
          <div v-if="loading" class="text-center q-pa-md">
            <q-spinner color="primary" size="3em" />
            <div class="q-mt-sm">Loading chores...</div>
          </div>
          
          <div v-else-if="chores.length === 0" class="text-center q-pa-md">
            <q-icon name="assignment" size="3em" color="grey-7" />
            <div class="q-mt-sm text-grey-7">No chores found. Add your first chore above!</div>
          </div>
          
          <q-list v-else separator>
            <q-item v-for="chore in chores" :key="chore.id">
              <q-item-section>
                <q-item-label>{{ chore.name }}</q-item-label>
                <q-item-label caption>
                  ${{ parseFloat(chore.amount).toFixed(2) }}
                </q-item-label>
              </q-item-section>
              
              <q-item-section side>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmDelete(chore)"
                  :loading="deletingId === chore.id"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, inject } from 'vue'
import { useQuasar } from 'quasar'
import { getStandardChores, createChore, deleteChore } from 'src/data/chores'

export default defineComponent({
  name: 'ManageChores',
  
  setup() {
    const $q = useQuasar()
    const userSession = inject('userSession')
    
    const chores = ref([])
    const loading = ref(false)
    const deletingId = ref(null)
    const newChore = ref({
      name: '',
      amount: 1.00
    })
    
    // Load chores on component mount
    onMounted(async () => {
      if (userSession.value) {
        await loadChores()
      }
    })
    
    // Load chores from database
    const loadChores = async () => {
      try {
        loading.value = true
        chores.value = await getStandardChores(userSession.value.user.id)
      } catch (error) {
        console.error('Error loading chores:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to load chores. Please try again.'
        })
      } finally {
        loading.value = false
      }
    }
    
    // Add a new chore
    const addChore = async () => {
      if (!newChore.value.name.trim()) return
      
      try {
        loading.value = true
        const choreData = {
          name: newChore.value.name.trim(),
          amount: parseFloat(newChore.value.amount).toFixed(2), // Ensure 2 decimal places
          user_id: userSession.value.user.id
        }
        
        await createChore(choreData)
        
        // Reset form fields and validation
        newChore.value = { name: '', amount: 1.00 }
        if (this.$refs && this.$refs.choreForm) {
          this.$refs.choreForm.resetValidation()
        }
        
        await loadChores() // Refresh list
        
        $q.notify({
          type: 'positive',
          message: 'Chore added successfully!'
        })
      } catch (error) {
        console.error('Error adding chore:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to add chore. Please try again.'
        })
      } finally {
        loading.value = false
      }
    }
    
    // Confirm before deleting
    const confirmDelete = (chore) => {
      $q.dialog({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete "${chore.name}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await deleteChoreItem(chore.id)
      })
    }
    
    // Delete a chore
    const deleteChoreItem = async (id) => {
      try {
        deletingId.value = id
        await deleteChore(id)
        await loadChores() // Refresh list
        
        $q.notify({
          type: 'positive',
          message: 'Chore deleted successfully!'
        })
      } catch (error) {
        console.error('Error deleting chore:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to delete chore. Please try again.'
        })
      } finally {
        deletingId.value = null
      }
    }
    
    return {
      chores,
      loading,
      newChore,
      deletingId,
      addChore,
      confirmDelete
    }
  }
})
</script>
