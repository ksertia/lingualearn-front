<template>
  <div class="languages-section">
    <div class="languages-header">
      <h2 class="section-title">Langues disponibles</h2>
      <p class="languages-count">
        {{ languageStore.totalLanguages }} langue(s)
      </p>
    </div>

    <div class="languages-grid">
      <div
        v-for="language in languageStore.languages"
        :key="language.id"
        :class="[
          'language-card',
          { active: languageStore.selectedLanguageId === language.id },
        ]"
        @click="selectLanguage(language.id)"
      >
        <div class="card-header">
          <h3 class="language-name">{{ language.name }}</h3>
          <button class="btn-delete" @click.stop="deleteLanguage(language.id)">
            <span>✕</span>
          </button>
        </div>

        <p class="language-subtitle">{{ language.nativeLanguage }}</p>

        <div class="language-code">
          <span class="badge">{{ language.code.toUpperCase() }}</span>
        </div>

        <p class="language-meta">
          {{ language.levels.length }} niveau(s) • Créé le {{ formatDate(language.createdAt) }}
        </p>

        <div class="card-action">
          <span class="arrow">→</span>
        </div>
      </div>
    </div>

    <div v-if="languageStore.languages.length === 0" class="empty-state">
      <p class="empty-icon">🌍</p>
      <p class="empty-text">Aucune langue disponible</p>
      <p class="empty-subtext">Créez une nouvelle langue pour commencer</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore } from "../../stores/languageStore";

const languageStore = useLanguageStore();

const selectLanguage = (languageId: string | undefined) => {
  if (!languageId) return;
  languageStore.selectLanguage(languageId);
};

const deleteLanguage = (languageId: string | undefined) => {
  if (!languageId) return;
  if (confirm("Êtes-vous sûr de vouloir supprimer cette langue ?")) {
    languageStore.deleteLanguage(languageId);
  }
};

const formatDate = (date: string | undefined) => {
  if (!date) return "Date inconnue";
  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Date invalide";
  }
};
</script>


<style scoped>
.languages-section {
  width: 100%;
}

.languages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a2855;
  margin: 0;
  letter-spacing: -0.5px;
}

.languages-count {
  font-size: 14px;
  color: #999;
  margin: 0;
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 20px;
  font-weight: 500;
}

.languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.language-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.language-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #00bcd4, #ff9800);
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.language-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.language-card:hover::before {
  transform: scaleX(1);
}

.language-card.active {
  border-color: #00bcd4;
  background: linear-gradient(
    135deg,
    rgba(0, 188, 212, 0.05),
    rgba(255, 152, 0, 0.05)
  );
}

.language-card.active::before {
  transform: scaleX(1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 8px;
}

.language-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a2855;
  margin: 0;
  flex: 1;
}

.btn-delete {
  background: rgba(244, 67, 54, 0.1);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: #f44336;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-delete:hover {
  background: #f44336;
  color: #fff;
  transform: scale(1.05);
}

.language-subtitle {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.language-code {
  margin-bottom: 12px;
}

.badge {
  display: inline-block;
  background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.language-meta {
  font-size: 12px;
  color: #999;
  margin: 0 0 12px 0;
}

.card-action {
  position: absolute;
  bottom: 16px;
  right: 16px;
  opacity: 0;
  color: #00bcd4;
  font-size: 20px;
  font-weight: 700;
  transition: all 0.3s;
}

.language-card:hover .card-action,
.language-card.active .card-action {
  opacity: 1;
  transform: translateX(4px);
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  background: linear-gradient(
    135deg,
    rgba(0, 188, 212, 0.05),
    rgba(255, 152, 0, 0.05)
  );
  border-radius: 12px;
  border: 2px dashed rgba(0, 188, 212, 0.2);
}

.empty-icon {
  font-size: 48px;
  margin: 0 0 16px 0;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: #1a2855;
  margin: 0 0 8px 0;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
  margin: 0;
}

@media (max-width: 1200px) {
  .languages-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .languages-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .languages-header {
    flex-direction: column;
    gap: 12px;
  }

  .language-card {
    padding: 16px;
  }

  .card-header {
    gap: 4px;
    margin-bottom: 8px;
  }

  .language-name {
    font-size: 16px;
  }

  .btn-delete {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  .language-subtitle {
    font-size: 12px;
  }

  .language-meta {
    font-size: 11px;
    margin-bottom: 8px;
  }

  .badge {
    font-size: 10px;
    padding: 3px 8px;
  }
}

@media (max-width: 640px) {
  .languages-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .languages-count {
    font-size: 12px;
  }

  .language-card {
    padding: 12px;
  }

  .language-name {
    font-size: 14px;
  }

  .card-action {
    bottom: 12px;
    right: 12px;
    font-size: 16px;
  }

  .empty-state {
    padding: 32px 16px;
  }

  .empty-icon {
    font-size: 40px;
    margin: 0 0 12px 0;
  }

  .empty-text {
    font-size: 16px;
  }

  .empty-subtext {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .languages-header {
    flex-direction: column;
    gap: 8px;
  }

  .section-title {
    font-size: 16px;
  }

  .language-card {
    padding: 10px;
  }

  .language-name {
    font-size: 13px;
  }

  .language-subtitle {
    font-size: 11px;
  }

  .language-meta {
    font-size: 10px;
  }
}
</style>
