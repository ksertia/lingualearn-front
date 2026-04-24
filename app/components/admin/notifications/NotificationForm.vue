<script setup lang="ts">
import { useNotificationStore } from '~/stores/notificationStore'
import { useUserStore } from '~/stores/userStore'
import type { NotificationType } from '~/types/notification'

const emit = defineEmits<{ (e: 'sent', title: string): void }>()

const notifStore = useNotificationStore()
const userStore = useUserStore()

const form = ref({
  userId: '',
  title: '',
  message: '',
  notificationType: 'info' as NotificationType,
  actionUrl: '',
})

const userSearch = ref('')

const filteredUsers = computed(() => {
  const q = userSearch.value.toLowerCase()
  return userStore.users
    .filter(u =>
      !q ||
      u.profile.firstName.toLowerCase().includes(q) ||
      u.profile.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
    .slice(0, 80)
})

const selectedUserLabel = computed(() => {
  if (!form.value.userId) return null
  const u = userStore.users.find(u => u.id === form.value.userId)
  return u ? `${u.profile.firstName} ${u.profile.lastName}` : null
})

const typeOptions = [
  { value: 'info',    label: 'Info',          color: '#000099', bg: 'rgba(0,0,153,0.08)',  border: 'rgba(0,0,153,0.2)' },
  { value: 'success', label: 'Succès',         color: '#16a34a', bg: '#dcfce7',             border: '#bbf7d0' },
  { value: 'warning', label: 'Avertissement',  color: '#d97706', bg: '#fef3c7',             border: '#fde68a' },
  { value: 'error',   label: 'Erreur',         color: '#dc2626', bg: '#fee2e2',             border: '#fca5a5' },
] as const

const canSubmit = computed(() => form.value.userId && form.value.title.trim() && form.value.message.trim())

const handleSubmit = async () => {
  if (!canSubmit.value) return
  const result = await notifStore.createNotification({
    userId: form.value.userId,
    title: form.value.title.trim(),
    message: form.value.message.trim(),
    notificationType: form.value.notificationType,
    actionUrl: form.value.actionUrl.trim() || undefined,
  })
  if (result.success) {
    emit('sent', form.value.title)
    form.value.title = ''
    form.value.message = ''
    form.value.actionUrl = ''
    form.value.userId = ''
    userSearch.value = ''
  }
}

onMounted(() => {
  if (!userStore.users.length) userStore.fetchUsers()
})
</script>

<template>
  <div class="nf-card">
    <!-- Header -->
    <div class="nf-header">
      <div class="nf-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
      </div>
      <div>
        <h2 class="nf-title">Envoyer une notification</h2>
        <p class="nf-subtitle">Créez et envoyez une notification à un utilisateur</p>
      </div>
    </div>

    <!-- Body -->
    <div class="nf-body">
      <div class="nf-grid">

        <!-- Destinataire -->
        <div class="nf-field nf-full">
          <label class="nf-label">Destinataire <span class="nf-required">*</span></label>
          <div class="user-picker">
            <div class="user-search-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input v-model="userSearch" type="text" placeholder="Filtrer les utilisateurs..." class="user-search-input"/>
            </div>
            <select v-model="form.userId" class="nf-select" size="5">
              <option value="" disabled>— Sélectionner un utilisateur —</option>
              <option v-for="u in filteredUsers" :key="u.id" :value="u.id">
                {{ u.profile.firstName }} {{ u.profile.lastName }} · {{ u.email }}
              </option>
            </select>
            <p v-if="selectedUserLabel" class="user-selected">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {{ selectedUserLabel }} sélectionné
            </p>
          </div>
        </div>

        <!-- Type -->
        <div class="nf-field nf-full">
          <label class="nf-label">Type de notification</label>
          <div class="type-row">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              type="button"
              @click="form.notificationType = opt.value"
              class="type-btn"
              :style="form.notificationType === opt.value
                ? `background:${opt.bg}; color:${opt.color}; border-color:${opt.border}`
                : ''"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Titre -->
        <div class="nf-field">
          <label class="nf-label">Titre <span class="nf-required">*</span></label>
          <input v-model="form.title" type="text" class="nf-input" placeholder="Ex: Nouveau cours disponible"/>
        </div>

        <!-- URL action -->
        <div class="nf-field">
          <label class="nf-label">URL d'action <span class="nf-optional">(optionnel)</span></label>
          <input v-model="form.actionUrl" type="text" class="nf-input" placeholder="/gestionnaire/contenus"/>
        </div>

        <!-- Message -->
        <div class="nf-field nf-full">
          <label class="nf-label">Message <span class="nf-required">*</span></label>
          <textarea v-model="form.message" class="nf-textarea" rows="3" placeholder="Contenu de la notification..."></textarea>
        </div>

      </div>

      <!-- Footer -->
      <div class="nf-footer">
        <p v-if="notifStore.error" class="nf-error">{{ notifStore.error }}</p>
        <button
          @click="handleSubmit"
          :disabled="!canSubmit || notifStore.isSending"
          class="btn-send"
        >
          <svg v-if="notifStore.isSending" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          {{ notifStore.isSending ? 'Envoi...' : 'Envoyer la notification' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nf-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 153, 0.04);
  overflow: hidden;
}

.nf-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbff;
}

.nf-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(0, 0, 153, 0.08);
  color: #000099;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nf-title { font-size: 0.9375rem; font-weight: 700; color: #0f172a; }
.nf-subtitle { font-size: 0.8125rem; color: #64748b; margin-top: 0.125rem; }

.nf-body { padding: 1.5rem; }

.nf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.nf-full { grid-column: 1 / -1; }

.nf-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;
}

.nf-required { color: #ef4444; }
.nf-optional { font-weight: 400; color: #94a3b8; }

.nf-input,
.nf-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}

.nf-textarea { resize: vertical; min-height: 80px; }

.nf-input:focus,
.nf-textarea:focus {
  border-color: #00ced1;
  box-shadow: 0 0 0 3px rgba(0, 206, 209, 0.12);
  background: white;
}

.nf-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  color: #0f172a;
  outline: none;
  cursor: pointer;
}

.nf-select:focus { border-color: #00ced1; box-shadow: 0 0 0 3px rgba(0, 206, 209, 0.12); }

/* User picker */
.user-picker { display: flex; flex-direction: column; gap: 0.5rem; }

.user-search-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #94a3b8;
}

.user-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #0f172a;
}

.user-selected {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
}

/* Type buttons */
.type-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.type-btn {
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}

.type-btn:hover { background: #f1f5f9; }

/* Footer */
.nf-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.nf-error { flex: 1; font-size: 0.8125rem; color: #dc2626; }

.btn-send {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.375rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  background: #000099;
  border: none;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.btn-send:hover:not(:disabled) { background: #0000bb; }
.btn-send:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
