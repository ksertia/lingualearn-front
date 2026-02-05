<template>
  <div class="dashboard-layout">
    <!-- <Sidebar /> -->
    <main class="dashboard-main">
      <div class="dashboard-header">
        <div class="header-content">
          <h1 class="page-title">Gestion des Langues</h1>
          <p class="page-subtitle">
            Administrez les langues, niveaux et contenus de votre plateforme
          </p>
        </div>
        <AddLanguageForm />
      </div>

      <div class="dashboard-content">
        <div v-if="!languageStore.selectedLanguageId" class="content-left">
          <LanguagesList />
        </div>

        <div v-else class="content-with-levels">
          <div class="content-left">
            <LanguagesList />
          </div>
          <div class="content-right">
            <LevelsList />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./Sidebar.vue";
import LanguagesList from "./LanguagesList.vue";
import LevelsList from "./LevelsList.vue";
import AddLanguageForm from "./AddLanguageForm.vue";
import { useLanguageStore } from "../../stores/languageStore";

const languageStore = useLanguageStore();
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  background: #f8f9fa;
  overflow: hidden;
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
  max-height: 100vh;
}

.dashboard-header {
  padding: 32px 40px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  position: relative;
  margin-top: 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a2855;
  margin: 0;
  letter-spacing: -1px;
}

.page-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.dashboard-content {
  flex: 1;
  overflow: visible;
  padding: 32px 40px;
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
  .dashboard-layout {
    flex-direction: row;
  }

  .dashboard-main {
    margin-left: 0;
    flex: 1;
    padding-top: 0;
  }

  .dashboard-header {
    margin-top: 60px;
    padding: 20px 24px;
    flex-direction: column;
    align-items: stretch;
  }

  .header-content {
    width: 100%;
    min-width: auto;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .dashboard-content {
    padding: 20px 24px;
  }

  .content-with-levels {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

/* Mobile (640px et moins) */
@media (max-width: 640px) {
  .dashboard-main {
    margin-left: 0;
  }

  .dashboard-header {
    margin-top: 70px;
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .dashboard-content {
    padding: 16px;
  }

  .content-with-levels {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Very small mobile (< 480px) */
@media (max-width: 479px) {
  .dashboard-header {
    padding: 12px;
    gap: 12px;
  }

  .page-title {
    font-size: 18px;
  }

  .dashboard-content {
    padding: 12px;
  }
}
</style>
