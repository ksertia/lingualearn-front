<script setup lang="ts">
import { useFormateurStore } from '~/stores/formateurStore'
import FormateurDetail from '~/components/gestionnaire/formateurs/FormateurDetail.vue'

definePageMeta({
  layout: 'gestionnaire'
})

const route = useRoute()
const store = useFormateurStore()
const router = useRouter()

const formateurId = computed(() => route.params.id as string)

const handleBack = () => {
  router.push('/gestionnaire/formateurs')
}

const handleSuspend = async (id: string) => {
  const success = await store.suspendFormateur(id)
  if (success) {
    alert('Formateur suspendu avec succès')
  }
}

const handleReactivate = async (id: string) => {
  const success = await store.reactivateFormateur(id)
  if (success) {
    alert('Formateur réactivé avec succès')
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
  </div>
</template>

