<template>
  <section class="max-w-4xl mx-auto p-6">
    <h1 class="text-xl font-bold mb-6">Modifier l'étape</h1>

    <StepForm :parcoursId="step?.parcoursId" :initialStep="step" />
  </section>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import StepForm from "@/components/Module-formateur/Step/StepForm.vue";

const route = useRoute();
const stepId = String(route.params.stepId);

const { data: step } = await useFetch(`/api/steps/${stepId}`);
</script>
