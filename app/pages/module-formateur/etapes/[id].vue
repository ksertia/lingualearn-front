<template>
  <section class="p-6 max-w-5xl mx-auto">
   <div class="flex items-center justify-between mb-6">
  <button
          class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group -ml-1 sm:-ml-2"
          @click="router.back()"
          title="Retour"
        >
          <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

  <h1 class="text-2xl font-semibold text-blue-900 text-right">
    Étapes du parcours
  </h1>
</div>

    <!-- <section class="p-6 max-w-5xl mx-auto space-y-14">
      <StepForm :parcoursId="parcoursId" @created="refreshKey++" />
      <StepList :parcoursId="parcoursId" :key="refreshKey" />
    </section> -->

    <!-- Formulaire création -->
    <div class="mt-8">
      <StepForm :pathId="pathId" @created="stepStore.fetchSteps(pathId)" />
    </div>
    <div class="mt-8">
      <!-- Liste des étapes -->
      <StepList :pathId="pathId" />
    </div>
    
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import StepList from "@/components/Module-formateur/Step/StepList.vue";
import StepForm from "@/components/Module-formateur/Step/StepForm.vue";
import { useStepStore } from "~/stores/stepStore";



definePageMeta({
  layout: "formateur",
});

const route = useRoute();
const router = useRouter();
const stepStore = useStepStore();

const pathId = String(route.params.id);
</script>
