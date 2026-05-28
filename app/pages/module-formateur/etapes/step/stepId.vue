<template>
  <div class="page-root">

    <button class="btn-back" @click="router.back()" title="Retour">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="back-ico">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Retour
    </button>

    <div v-if="pending" class="state-center">
      <div class="spinner"></div>
      <p class="state-text">Chargement…</p>
    </div>

    <div v-else-if="!step" class="empty-card">
      <p class="empty-title">Étape introuvable</p>
    </div>

    <div v-else class="content-card">
      <h1 class="step-title">{{ step.title }}</h1>
      <p class="step-type">Type : {{ step.type }}</p>

      <div v-if="step.content" class="step-content" v-html="step.content" />

      <video v-if="step.fileUrl && step.mime?.startsWith('video')" controls class="step-media">
        <source :src="step.fileUrl" :type="step.mime" />
      </video>

      <audio v-if="step.fileUrl && step.mime?.startsWith('audio')" controls class="step-audio">
        <source :src="step.fileUrl" :type="step.mime" />
      </audio>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const stepId = String(route.params.stepId);

interface Step {
  id: string;
  title: string;
  type: string;
  content?: string;
  fileUrl?: string;
  mime?: string;
}

const { data: step, pending } = await useFetch<Step>(
  () => `/api/steps/${stepId}`
);
</script>

<style scoped>
.page-root {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid #E5E7EB;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.12s;
  font-family: inherit;
}
.btn-back:hover { background: #F3F4F6; }
.back-ico { width: 14px; height: 14px; }

/* Loading */
.state-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 12px;
}
.spinner {
  width: 28px; height: 28px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-text { font-size: 13px; color: #9CA3AF; }

/* Empty */
.empty-card {
  padding: 48px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  text-align: center;
}
.empty-title { font-size: 14px; font-weight: 600; color: #374151; margin: 0; }

/* Content */
.content-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.step-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.02em;
}
.step-type {
  font-size: 12px;
  color: #6B7280;
  text-transform: capitalize;
  margin: 0;
}
.step-content {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}
.step-media { width: 100%; border-radius: 8px; }
.step-audio { width: 100%; }
</style>
