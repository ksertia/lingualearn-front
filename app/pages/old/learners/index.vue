<template>
  <div class="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">

    <h1 class="text-xl md:text-2xl font-bold" style="color: rgb(0,42,104);">
      Liste des apprenants
    </h1>

    <!-- Filtres -->
    <LearnerFilters
      v-model:search="search"
      v-model:parcours="parcours"
      v-model:status="status"
    />

    <!-- État de chargement / erreur -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000099]"></div>
    </div>
    <div v-else-if="error" class="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 mb-6">
      {{ error }}
    </div>

    <!-- Tableau -->
    <LearnersTable v-else :filtered-learners="filteredLearners" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LearnerFilters from '~/components/learners/LearnerFilters.vue'
import LearnersTable from '~/components/learners/LearnersTable.vue'
import { useUserStore } from '~/stores/userStore'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'lms' 
})

const userStore = useUserStore()
const { users: learners, isLoading, error } = storeToRefs(userStore)

// Filtres
const search = ref('')
const parcours = ref('')
const status = ref('')

// Filtrage
const filteredLearners = computed(() => {
  if (!learners.value) return [];
  console.log('Filtering learners:', learners.value.length, 'found');
  return learners.value.filter(l => {
    const firstName = l.profile?.firstName || (l as any).firstName || '';
    const lastName = l.profile?.lastName || (l as any).lastName || '';
    const username = l.username || '';
    const fullName = (firstName || lastName) ? `${firstName} ${lastName}` : username;
    
    const searchTerm = search.value.toLowerCase();
    const matchName = fullName.toLowerCase().includes(searchTerm) || 
                      username.toLowerCase().includes(searchTerm) ||
                      (l.email && l.email.toLowerCase().includes(searchTerm));
                      
    const matchStatus = status.value ? (status.value === 'actif' ? l.isActive : !l.isActive) : true;
    const matchType = parcours.value ? l.accountType === parcours.value : true;
    
    return matchName && matchStatus && matchType;
  });
});

onMounted(() => {
  userStore.fetchUsers()
})
</script>
