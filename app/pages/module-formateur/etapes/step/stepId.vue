<template>
  <section class="max-w-4xl mx-auto p-6 space-y-6">

    <button
      @click="router.back()"
      class="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
    >
      ← Retour
    </button>

    <div v-if="pending">Chargement...</div>

    <div v-else-if="!step">Étape introuvable</div>

    <div v-else class="space-y-6">

      <h1 class="text-2xl font-bold text-blue-900">
        {{ step.title }}
      </h1>

      <p class="text-sm text-gray-500 capitalize">
        Type : {{ step.type }}
      </p>

      <!-- CONTENU TEXTE -->
      <div
        v-if="step.content"
        class="prose max-w-none border rounded-lg p-6"
        v-html="step.content"
      />

      <!-- VIDEO -->
      <video
        v-if="step.fileUrl && step.mime?.startsWith('video')"
        controls
        class="w-full rounded-lg"
      >
        <source :src="step.fileUrl" :type="step.mime" />
      </video>

      <!-- AUDIO -->
      <audio
        v-if="step.fileUrl && step.mime?.startsWith('audio')"
        controls
        class="w-full"
      >
        <source :src="step.fileUrl" :type="step.mime" />
      </audio>

    </div>
  </section>
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
