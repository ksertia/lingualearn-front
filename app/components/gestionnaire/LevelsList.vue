<template>
  <div class="levels-section">
    <div v-if="languageStore.selectedLanguage" class="levels-container">
      <!-- Header -->
      <div class="levels-header">
        <div class="header-content">
          <button class="btn-back" @click="clearSelection">
            <span>←</span>
          </button>
          <div>
            <h2 class="section-title">{{ languageStore.selectedLanguage.name }}</h2>
            <p class="section-subtitle">{{ languageStore.selectedLanguage.nativeLanguage }}</p>
          </div>
        </div>
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

    <button class="btn-access">Accéder →</button>
  </div>
</div>

      <!-- Footer -->
<div class="levels-footer">
  <div class="footer-info">
    <p class="info-text">
      Cette langue compte <strong>{{ displayedLevels.length }} niveaux</strong>
    </p>
  </div>
</div>
    </div>

    <!-- No selection -->
    <div v-else class="no-selection">
      <p class="no-selection-icon">🔍</p>
      <p class="no-selection-text">Sélectionnez une langue</p>
      <p class="no-selection-subtext">Cliquez sur une langue pour voir ses niveaux</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLanguageStore } from "../../stores/languageStore";

const languageStore = useLanguageStore();

// Fonction locale pour vider la sélection
const clearSelection = () => {
  languageStore.selectedLanguageId = null;
};

// Icônes pour chaque niveau
const getLevelIcon = (levelName: string) => {
  const icons: Record<string, string> = {
    Basique: "🌱",
    Intermédiaire: "🌿",
    Avancé: "🌳",
  };
  return icons[levelName] || "📚";
};

// Niveaux affichés (réels ou par défaut)
const displayedLevels = computed(() => {
  const lang = languageStore.selectedLanguage;
  if (!lang) return [];

  if (lang.levelsLoaded && lang.levels.length > 0) return lang.levels;

  // Sinon créer 3 niveaux par défaut pour l'affichage temporaire
  return [
    { id: "level-1", name: "Basique", description: "Niveau débutant" },
    { id: "level-2", name: "Intermédiaire", description: "Niveau moyen" },
    { id: "level-3", name: "Avancé", description: "Niveau expert" },
  ];
});
</script>




<style scoped>
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
  background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  flex-shrink: 0;
}

.btn-back:hover {
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
  transform: translateX(-2px);
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a2855;
  margin: 0;
  letter-spacing: -0.5px;
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
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
}

.level-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at top right,
    rgba(255, 152, 0, 0.1),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.level-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-6px);
}

.level-card:hover::before {
  opacity: 1;
}

.level-card.level-1 {
  border-left-color: #4caf50;
}

.level-card.level-1 .level-icon {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.1),
    rgba(76, 175, 80, 0.05)
  );
}

.level-card.level-2 {
  border-left-color: #00bcd4;
}

.level-card.level-2 .level-icon {
  background: linear-gradient(
    135deg,
    rgba(0, 188, 212, 0.1),
    rgba(0, 188, 212, 0.05)
  );
}

.level-card.level-3 {
  border-left-color: #ff9800;
}

.level-card.level-3 .level-icon {
  background: linear-gradient(
    135deg,
    rgba(255, 152, 0, 0.1),
    rgba(255, 152, 0, 0.05)
  );
}

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
  color: #1a2855;
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
  color: #1a2855;
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
  background: linear-gradient(
    135deg,
    rgba(0, 188, 212, 0.05),
    rgba(255, 152, 0, 0.05)
  );
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #00bcd4;
}

.info-text {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.info-text strong {
  color: #1a2855;
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
  color: #1a2855;
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
</style>
