<script setup lang="ts">
import type { Signalement, ModerationAction, ModerationDecision } from '~/types/signalement'

const props = defineProps<{
  signalement: Signalement | null
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', decision: ModerationDecision): void
}>()

// State local
const selectedAction = ref<ModerationAction>('processed')
const comment = ref('')
const disableContent = ref(false)
const suspendFormateur = ref(false)
const deleteContent = ref(false)
const showConfirm = ref(false)

// Actions disponibles
const actions = [
  { value: 'processed', label: 'Marquer comme traité', description: 'Le signalement a été examiné et traité', color: 'blue' },
  { value: 'rejected', label: 'Rejeter le signalement', description: 'Le signalement n\'est pas fondé', color: 'emerald' },
  { value: 'content_disabled', label: 'Désactiver le contenu', description: 'Rendre le contenu invisible aux apprenants', color: 'red' },
  { value: 'content_deleted', label: 'Supprimer le contenu', description: 'Supprimer définitivement le contenu', color: 'red' },
  { value: 'formateur_suspended', label: 'Suspendre le formateur', description: 'Suspendre le compte du formateur', color: 'orange' }
]

// Reset quand le signalement change
watch(() => props.signalement, () => {
  selectedAction.value = 'processed'
  comment.value = ''
  disableContent.value = false
  suspendFormateur.value = false
  deleteContent.value = false
  showConfirm.value = false
})

const handleSubmit = () => {
  if (!props.signalement) return
  
  // Si action critique, demander confirmation
  if (['content_disabled', 'content_deleted', 'formateur_suspended'].includes(selectedAction.value)) {
    if (!showConfirm.value) {
      showConfirm.value = true
      return
    }
  }
  
  const decision: ModerationDecision = {
    signalementId: props.signalement.id,
    action: selectedAction.value,
    comment: comment.value || undefined,
    disableContent: disableContent.value,
    suspendFormateur: suspendFormateur.value,
    deleteContent: deleteContent.value
  }
  
  emit('submit', decision)
  emit('close')
}

const isCritical = computed(() => {
  return ['content_disabled', 'content_deleted', 'formateur_suspended'].includes(selectedAction.value)
})
</script>

<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <!-- Modal -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 class="text-lg font-bold text-slate-900">Traiter le signalement</h2>
        <p v-if="signalement" class="text-sm text-slate-500 mt-0.5">
          {{ signalement.contenu.title }}
        </p>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Actions -->
        <div class="space-y-3 mb-6">
          <label class="block text-sm font-medium text-slate-700 mb-2">Action à effectuer</label>
          
          <label
            v-for="action in actions"
            :key="action.value"
            class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="selectedAction === action.value 
              ? 'border-[#000099] bg-[#000099]/5' 
              : 'border-slate-200 hover:border-slate-300'"
          >
            <input
              type="radio"
              :value="action.value"
              v-model="selectedAction"
              class="mt-1"
            />
            <div>
              <span class="text-sm font-medium" :class="selectedAction === action.value ? 'text-[#000099]' : 'text-slate-700'">
                {{ action.label }}
              </span>
              <p class="text-xs text-slate-500 mt-0.5">{{ action.description }}</p>
            </div>
          </label>
        </div>

        <!-- Commentaire -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Commentaire interne (optionnel)
          </label>
          <textarea
            v-model="comment"
            rows="3"
            placeholder="Ajoutez un commentaire pour la journalisation..."
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00ced1]/20 focus:border-[#00ced1] outline-none text-sm resize-none"
          ></textarea>
        </div>

        <!-- Confirmation pour actions critiques -->
        <div v-if="showConfirm" class="bg-red-50 border border-red-200 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800">Confirmation requise</p>
              <p class="text-xs text-red-600 mt-1">
                Cette action est irréversible. Veuillez confirmer que vous souhaitez procéder.
              </p>
              <div class="flex items-center gap-4 mt-3">
                <label class="flex items-center gap-2 text-xs text-red-700">
                  <input type="checkbox" v-model="disableContent" class="rounded" />
                  Désactiver le contenu
                </label>
                <label v-if="selectedAction === 'formateur_suspended'" class="flex items-center gap-2 text-xs text-red-700">
                  <input type="checkbox" v-model="suspendFormateur" class="rounded" />
                  Suspendre le formateur
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3">
        <button
          @click="emit('close')"
          class="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="handleSubmit"
          class="flex-1 px-4 py-3 bg-[#000099] text-white rounded-xl font-medium hover:bg-[#000088] transition-colors"
          :class="{ 'bg-red-600 hover:bg-red-700': isCritical }"
        >
          {{ showConfirm ? 'Confirmer l\'action' : 'Valider' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

