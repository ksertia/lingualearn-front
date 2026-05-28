<template>
  <div class="levels-section">
    <div v-if="currentLanguage" class="levels-container">
      <!-- Header -->
      <div class="levels-header">
        <div class="header-content">
          <button class="btn-back" @click="clearSelection">
            <span>←</span>
          </button>
          <div>
            <h2 class="section-title">{{ currentLanguage.name }}</h2>
            <p class="section-subtitle">
              {{ currentLanguage.nativeLanguage }}
            </p>
          </div>
        </div>
        <p
          v-if="feedback.message"
          :class="['status-message', feedback.type === 'error' ? 'status-error' : 'status-success']"
        >
          {{ feedback.message }}
        </p>
      </div>

      <!-- Levels Grid -->
      <div class="levels-grid">
        <div
          v-for="(level, index) in displayedLevels"
          :key="level.id || index"
          :class="['level-card', `level-${index + 1}`]"
        >
          <div class="level-icon">
            <span>{{ getLevelIcon(level.name) }}</span>
          </div>

          <h3 class="level-name">{{ level.name }}</h3>
          <p class="level-description">{{ level.description }}</p>

          <div class="level-actions">
            <!-- <button class="btn-access">Accéder</button> -->

            <button
              :class="[
                'btn-toggle',
                level.isActive ? 'btn-deactivate' : 'btn-activate',
              ]"
              @click="toggleLevel(level)"
              :disabled="!level.id || level.id.startsWith('level-')"
            >
              {{ level.isActive ? "Désactiver" : "Activer" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="levels-footer">
        <div class="footer-info">
          <p class="info-text">
            Cette langue compte
            <strong>{{ displayedLevels.length }} niveaux</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- No selection -->
    <div v-else class="no-selection">
      <p class="no-selection-icon">🔍</p>
      <p class="no-selection-text">Sélectionnez une langue</p>
      <p class="no-selection-subtext">
        Cliquez sur une langue pour voir ses niveaux
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useLanguageStore } from "../../../stores/languageStore";

const languageStore = useLanguageStore();
const feedback = ref({ message: "", type: "success" as "success" | "error" });

const showFeedback = (message: string, type: "success" | "error" = "success") => {
  feedback.value = { message, type };
  setTimeout(() => {
    feedback.value.message = "";
  }, 2500);
};

// Fonction locale pour vider la selection
const clearSelection = () => {
  languageStore.selectedLanguageId = null;
};

// Icones pour chaque niveau
const getLevelIcon = (levelName: string) => {
  const icons: Record<string, string> = {
    Basique: "🌱",
    Intermédiaire: "🌿",
    Avancé: "🌳",
    Débutant: "🌱",
  };
  return icons[levelName] || "📚";
};

// Langue actuellement selectionnee (avec tous ses niveaux)
const currentLanguage = computed(() => {
  return languageStore.languages.find(
    (l) => l.id === languageStore.selectedLanguageId,
  );
});

// Niveaux affiches (tous les niveaux pour les gestionnaires)
const displayedLevels = computed(() => {
  const lang = currentLanguage.value;
  if (!lang) return [];

  // Retourner les niveaux reels charges depuis le backend
  return lang.levels;
});

// Activer / desactiver un niveau
const toggleLevel = async (level: any) => {
  try {
    const lang = currentLanguage.value;
    if (!lang) return;

    // Empeche l'appel API pour les niveaux fictifs
    if (!level.id || level.id.startsWith("level-")) return;

    await languageStore.updateLevel(lang.id, level.id, {
      isActive: !level.isActive,
    });

    // Mise a jour locale pour feedback instantane
    level.isActive = !level.isActive;
    showFeedback(`Le niveau ${level.name} a été ${level.isActive ? "activé" : "désactivé"} avec succès.`);
  } catch (error) {
    console.error("Erreur changement statut niveau", error);
    showFeedback("Impossible de modifier le statut du niveau.", "error");
  }
};
</script>

<style scoped>
.status-message {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.status-success {
  background: #dcfce7;
  color: #166534;
}

.status-error {
  background: #fee2e2;
  color: #991b1b;
}

.levels-section {
  width: 100%;
}

.levels-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.levels-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-back {
  background: rgba(22,163,74,0.10);
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #15803D;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-weight: 700;
  flex-shrink: 0;
}

.btn-back:hover {
  background: rgba(22,163,74,0.18);
  transform: translateX(-2px);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 14px;
  color: #999;
  margin: 4px 0 0 0;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  flex: 1;
}

.level-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 22px 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
  border-left: 3px solid transparent;
  position: relative;
  overflow: hidden;
}

.level-card:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.07);
  transform: translateY(-2px);
}

.level-card.level-1 { border-left-color: #16A34A; }
.level-card.level-1 .level-icon { background: rgba(22,163,74,0.10); }

.level-card.level-2 { border-left-color: #2563EB; }
.level-card.level-2 .level-icon { background: rgba(37,99,235,0.10); }

.level-card.level-3 { border-left-color: #7C3AED; }
.level-card.level-3 .level-icon { background: rgba(124,58,237,0.10); }

.level-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.level-card:hover .level-icon {
  transform: scale(1.1) rotate(5deg);
}

.level-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.level-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
  flex: 1;
}

.level-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-access {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  border: none;
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-access:hover {
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  transform: translateY(-2px);
}

.btn-access:active {
  transform: translateY(0);
}

.levels-footer {
  border-top: 1px solid #eee;
  padding-top: 24px;
}

.footer-info {
  background: rgba(22,163,74,0.05);
  padding: 14px 16px;
  border-radius: 8px;
  border-left: 3px solid #16A34A;
}

.info-text {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.info-text strong {
  color: #111827;
  font-weight: 700;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.no-selection-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.no-selection-text {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.no-selection-subtext {
  font-size: 14px;
  color: #999;
  margin: 0;
}

@media (max-width: 1200px) {
  .levels-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .btn-back {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .levels-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .section-title {
    font-size: 20px;
  }

  .section-subtitle {
    font-size: 12px;
  }

  .btn-back {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .levels-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }

  .level-card {
    padding: 20px;
  }

  .level-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }

  .level-name {
    font-size: 16px;
  }

  .level-description {
    font-size: 12px;
    margin: 0 0 12px 0;
  }

  .level-stats {
    padding: 12px;
    gap: 8px;
  }

  .stat-value {
    font-size: 16px;
  }

  .stat-label {
    font-size: 10px;
  }

  .btn-access {
    padding: 8px 12px;
    font-size: 12px;
  }

  .footer-info {
    padding: 12px;
    border-left-width: 3px;
  }

  .info-text {
    font-size: 12px;
  }

  .no-selection-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .no-selection-text {
    font-size: 18px;
  }

  .no-selection-subtext {
    font-size: 12px;
  }
}

@media (max-width: 640px) {
  .levels-header {
    margin-bottom: 20px;
  }

  .header-content {
    width: 100%;
    gap: 8px;
  }

  .btn-back {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .levels-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .level-card {
    padding: 16px;
  }

  .level-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
    margin-bottom: 12px;
  }

  .level-name {
    font-size: 15px;
  }

  .level-description {
    font-size: 11px;
    margin-bottom: 10px;
  }

  .level-stats {
    padding: 10px;
    gap: 6px;
    margin-bottom: 12px;
  }

  .stat {
    gap: 2px;
  }

  .stat-value {
    font-size: 14px;
  }

  .stat-label {
    font-size: 9px;
  }

  .btn-access {
    padding: 8px 10px;
    font-size: 11px;
  }

  .levels-footer {
    padding-top: 16px;
  }

  .footer-info {
    padding: 10px;
  }

  .info-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 16px;
  }

  .section-subtitle {
    font-size: 11px;
  }

  .level-card {
    padding: 12px;
  }

  .level-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .level-name {
    font-size: 13px;
  }

  .level-description {
    font-size: 10px;
    line-height: 1.4;
  }

  .no-selection {
    min-height: 300px;
  }

  .no-selection-icon {
    font-size: 40px;
  }

  .no-selection-text {
    font-size: 16px;
  }
}

.level-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn-toggle {
  border: none;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.btn-activate {
  background: rgba(22,163,74,0.10);
  color: #15803D;
}

.btn-deactivate {
  background: rgba(220,38,38,0.09);
  color: #DC2626;
}

.btn-toggle:hover { opacity: 0.8; }
</style>
