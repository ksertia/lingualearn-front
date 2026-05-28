<template>
  <div class="page-root">

    <div class="page-hero">
      <button class="btn-back" @click="router.back()" title="Retour">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="back-ico">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="page-heading">Étapes du parcours</h1>
        <p class="page-sub">Gérez le contenu et l'ordre des étapes</p>
      </div>
    </div>

    <StepForm :pathId="pathId" @created="stepStore.fetchSteps(pathId)" />
    <StepList :pathId="pathId" />

  </div>
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

<style scoped>
.page-root {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-hero {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-heading {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.03em;
  margin: 0;
}

.page-sub {
  font-size: 13px;
  color: #9CA3AF;
  margin-top: 3px;
}

.btn-back {
  width: 34px; height: 34px;
  border: 1px solid #E5E7EB;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  flex-shrink: 0;
  transition: background 0.12s, border-color 0.12s;
}
.btn-back:hover { background: #F3F4F6; border-color: #D1D5DB; }
.back-ico { width: 16px; height: 16px; }
</style>
