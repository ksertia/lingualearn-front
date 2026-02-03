<template>
  <div class="add-language-form">
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Ajouter une nouvelle langue</h3>
              <button class="btn-close" @click="closeModal">✕</button>
            </div>

            <form @submit.prevent="submitForm" class="form">
              <div class="form-group">
                <label for="language-name" class="form-label">
                  Nom de la langue
                </label>
                <input
                  id="language-name"
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  placeholder="Ex: Fulfuldé"
                  required
                />
              </div>

              <div class="form-group">
                <label for="native-language" class="form-label">
                  Nom natif / Traduction
                </label>
                <input
                  id="native-language"
                  v-model="formData.nativeLanguage"
                  type="text"
                  class="form-input"
                  placeholder="Ex: Lingualearn Fulfuldé"
                  required
                />
              </div>

              <div class="form-info">
                <span class="info-icon">ℹ️</span>
                <p class="info-text">
                  Cette langue sera créée avec 3 niveaux : Basique,
                  Intermédiaire et Avancé.
                </p>
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeModal"
                >
                  Annuler
                </button>
                <button type="submit" class="btn btn-primary">
                  Ajouter la langue
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <button v-if="!isOpen" class="btn-add" @click="openModal">
      <span class="btn-icon">+</span>
      <span class="btn-text">Ajouter une langue</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLanguageStore } from "../../stores/languageStore";

const languageStore = useLanguageStore();

const isOpen = ref(false);
const formData = ref({
  name: "",
  nativeLanguage: "",
});

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: "",
    nativeLanguage: "",
  };
};

const submitForm = async () => {
  if (!formData.value.name.trim() || !formData.value.nativeLanguage.trim()) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  try {
    // Convertir le nom natif en code (ex: "Mooré" → "mor")
    const code = formData.value.name.substring(0, 3).toLowerCase();

    await languageStore.addLanguage({
      name: formData.value.name,
      code: code,
      description: formData.value.nativeLanguage,
    });
    closeModal();
  } catch (error) {
    console.error("Erreur lors de l'ajout de la langue:", error);
    alert("Erreur lors de l'ajout de la langue");
  }
};
</script>

<style scoped>
.add-language-form {
  position: relative;
}

.btn-add {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  border: none;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.25);
}

.btn-add:hover {
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.35);
  transform: translateY(-2px);
}

.btn-add:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 18px;
  font-weight: 700;
}

.btn-text {
  font-size: 14px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 28px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a2855;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close:hover {
  color: #1a2855;
  background: #f5f5f5;
  border-radius: 6px;
}

.form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a2855;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
}

.form-info {
  background: linear-gradient(
    135deg,
    rgba(0, 188, 212, 0.08),
    rgba(255, 152, 0, 0.08)
  );
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #00bcd4;
  margin-bottom: 24px;
  display: flex;
  gap: 8px;
}

.info-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.info-text {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
  color: #fff;
}

.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #efefef;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .btn-add {
    padding: 10px 16px;
    font-size: 13px;
    gap: 6px;
  }

  .btn-icon {
    font-size: 16px;
  }

  .modal-content {
    max-width: 90%;
  }

  .modal-header {
    padding: 20px 20px;
  }

  .modal-title {
    font-size: 18px;
  }

  .btn-close {
    width: 28px;
    height: 28px;
    font-size: 20px;
  }

  .form {
    padding: 20px;
  }

  .form-label {
    font-size: 13px;
  }

  .form-input {
    padding: 10px 12px;
    font-size: 13px;
  }

  .form-info {
    padding: 10px;
    gap: 6px;
  }

  .info-icon {
    font-size: 14px;
  }

  .info-text {
    font-size: 12px;
  }

  .form-actions {
    gap: 8px;
    margin-top: 20px;
  }

  .btn {
    padding: 10px 16px;
    font-size: 12px;
  }
}

@media (max-width: 640px) {
  .btn-add {
    padding: 8px 12px;
    font-size: 12px;
  }

  .btn-text {
    display: none;
  }

  .btn-add {
    width: 44px;
    height: 44px;
    justify-content: center;
    border-radius: 10px;
  }

  .modal-overlay {
    padding: 12px;
  }

  .modal-content {
    max-width: 95%;
  }

  .modal-header {
    padding: 16px;
    flex-direction: row;
  }

  .modal-title {
    font-size: 16px;
  }

  .form {
    padding: 16px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .form-input {
    padding: 8px 10px;
    font-size: 12px;
    border-radius: 6px;
  }

  .form-info {
    padding: 8px;
    margin-bottom: 16px;
    gap: 4px;
  }

  .form-actions {
    gap: 6px;
    margin-top: 16px;
  }

  .btn {
    padding: 8px 12px;
    font-size: 11px;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    max-width: 98%;
  }

  .modal-header {
    padding: 12px;
  }

  .modal-title {
    font-size: 14px;
  }

  .form {
    padding: 12px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .btn-close {
    width: 24px;
    height: 24px;
    font-size: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
