<script setup lang="ts">
import { useFormateurStore } from '~/stores/formateurStore'
import FormateurDetail from '~/components/gestionnaire/formateurs/FormateurDetail.vue'

definePageMeta({
  layout: 'gestionnaire'
})

const route = useRoute()
const store = useFormateurStore()
const router = useRouter()
const feedback = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })
let feedbackTimer: ReturnType<typeof setTimeout> | null = null

const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = { show: true, message, type }
  feedbackTimer = setTimeout(() => {
    feedback.value.show = false
  }, 2500)
}

const formateurId = computed(() => route.params.id as string)

const handleBack = () => {
  router.push('/gestionnaire/formateurs')
}

const handleSuspend = async (id: string) => {
  const success = await store.suspendFormateur(id)
  if (success) {
    showFeedback('Le formateur a été suspendu avec succès.')
  } else {
    showFeedback('La suspension du formateur a échoué.', 'error')
  }
}

const handleReactivate = async (id: string) => {
  const success = await store.reactivateFormateur(id)
  if (success) {
    showFeedback('Le formateur a été réactivé avec succès.')
  } else {
    showFeedback('La réactivation du formateur a échoué.', 'error')
  }
}
</script>

<template>
  <div class="min-h-screen p-4 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <FormateurDetail
        :id="formateurId"
        @back="handleBack"
        @suspend="handleSuspend"
        @reactivate="handleReactivate"
      />
    </div>

    <transition name="toast-fade">
      <div
        v-if="feedback.show"
        class="fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 shadow-lg text-white"
        :class="feedback.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'"
      >
        {{ feedback.message }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

