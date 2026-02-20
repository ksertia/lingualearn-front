<template>
  <section class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-blue-900">
        Étapes du parcours
      </h1>
      <button
        @click="router.back()"
        class="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
        Retour
      </button>
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
