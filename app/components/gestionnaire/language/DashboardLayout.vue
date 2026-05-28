<template>
  <div class="dashboard-layout">
    <!-- <Sidebar /> -->
    <main class="dashboard-main">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <p class="page-subtitle">
            Administrez les langues, niveaux et contenus de votre plateforme
          </p>
        </div>
        <AddLanguageForm />
      </div>

      <!-- Contenu -->
      <div class="dashboard-content">
        <div v-if="languageStore.loading">Chargement des langues...</div>
        <div v-else-if="languageStore.error">{{ languageStore.error }}</div>
        <div v-else>
          <!-- Si aucune langue sélectionnée -->
          <div v-if="!languageStore.selectedLanguageId" class="content-left">
            <LanguagesList />
          </div>

          <!-- Si une langue est sélectionnée -->
          <div v-else class="content-with-levels">
            <div class="content-left">
              <LanguagesList />
            </div>
            <div class="content-right">
              <LevelsList />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Sidebar from "./Sidebar.vue";
import LanguagesList from "./LanguagesList.vue";
import LevelsList from "./LevelsList.vue";
import AddLanguageForm from "~/components/gestionnaire/language/AddLanguageForm.vue";
import { useLanguageStore } from "../../../stores/languageStore";

const languageStore = useLanguageStore();

// ⚡ Charger toutes les langues et leurs niveaux dès l'affichage du dashboard
onMounted(async () => {
  await languageStore.fetchLanguages();

  // Charger les niveaux pour chaque langue afin d'avoir les 3 niveaux générés par le backend
  for (const lang of languageStore.languages) {
    if (!lang.levelsLoaded) {
      await languageStore.loadLevelsForLanguage(lang.id);
    }
  }
});
</script>


<style scoped>
.dashboard-layout {
  display: flex;
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dashboard-header {
  padding: 32px 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 200px;
}

.page-subtitle {
  font-size: 13px;
  color: #9CA3AF;
  margin: 0;
}

.dashboard-content {
  flex: 1;
  padding: 24px 32px 32px;
  min-width: 0;
}


.content-left {
  width: 100%;
}

.content-with-levels {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
}

/* Responsive Design */

/* Tablette (1024px et moins) */
@media (max-width: 1023px) {
  .dashboard-header {
    padding: 20px 20px 0;
    flex-direction: column;
    align-items: stretch;
  }
  .dashboard-content { padding: 20px; }
  .content-with-levels { grid-template-columns: 1fr; gap: 24px; }
}

@media (max-width: 640px) {
  .dashboard-header { padding: 16px 16px 0; }
  .dashboard-content { padding: 16px; }
  .content-with-levels { grid-template-columns: 1fr; gap: 16px; }
}
</style>
