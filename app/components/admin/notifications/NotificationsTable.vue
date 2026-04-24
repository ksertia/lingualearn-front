<script setup lang="ts">
import { useNotificationStore } from '~/stores/notificationStore'
import { useUserStore } from '~/stores/userStore'

const notifStore = useNotificationStore()
const userStore = useUserStore()

const selectedUserId = ref('')
const userSearch = ref('')
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

const filteredUsers = computed(() => {
  const q = userSearch.value.toLowerCase()
  return userStore.users
    .filter(u =>
      !q ||
      u.profile.firstName.toLowerCase().includes(q) ||
      u.profile.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
    .slice(0, 100)
})

const loadNotifications = () => {
  if (!selectedUserId.value) return
  notifStore.fetchUserNotifications(selectedUserId.value)
}

const handleMarkRead = async (id: string) => {
  await notifStore.markAsRead(id)
}

const handleMarkAllRead = async () => {
  if (!selectedUserId.value) return
  await notifStore.markAllAsRead(selectedUserId.value)
}

const handleDelete = async (id: string) => {
  try {
    await notifStore.deleteNotification(id)
    showToast('Notification supprimée')
  } catch (err: any) {
    showToast(err.message || 'Erreur lors de la suppression', 'error')
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const typeConfig: Record<string, { label: string; bg: string; color: string }> = {
  info:    { label: 'Info',          bg: 'rgba(0,0,153,0.08)', color: '#000099' },
  success: { label: 'Succès',        bg: '#dcfce7',            color: '#16a34a' },
  warning: { label: 'Avertissement', bg: '#fef3c7',            color: '#d97706' },
  error:   { label: 'Erreur',        bg: '#fee2e2',            color: '#dc2626' },
}

onMounted(() => {
  if (!userStore.users.length) userStore.fetchUsers()
})
</script>

<template>
  <div class="nt-card">
    <!-- Header -->
    <div class="nt-header">
      <div class="nt-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <div>
        <h2 class="nt-title">Historique des notifications</h2>
        <p class="nt-subtitle">Consultez et gérez les notifications par utilisateur</p>
      </div>
      <button
        v-if="notifStore.notifications.length > 0 && notifStore.unreadCount > 0"
        @click="handleMarkAllRead"
        class="btn-mark-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Tout marquer lu
        <span class="unread-badge">{{ notifStore.unreadCount }}</span>
      </button>
    </div>

    <!-- User selector bar -->
    <div class="user-bar">
      <div class="user-search-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="userSearch" type="text" placeholder="Filtrer les utilisateurs..." class="user-search-input"/>
      </div>
      <select v-model="selectedUserId" @change="loadNotifications" class="user-select">
        <option value="">— Sélectionner un utilisateur —</option>
        <option v-for="u in filteredUsers" :key="u.id" :value="u.id">
          {{ u.profile.firstName }} {{ u.profile.lastName }} · {{ u.email }}
        </option>
      </select>
      <button
        @click="loadNotifications"
        :disabled="!selectedUserId || notifStore.isLoading"
        class="btn-refresh"
      >
        <svg :class="['w-4 h-4', notifStore.isLoading ? 'animate-spin' : '']" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Actualiser
      </button>
    </div>

    <!-- Empty: no user selected -->
    <div v-if="!selectedUserId" class="state-box">
      <div class="state-icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      </div>
      <p class="state-text">Sélectionnez un utilisateur pour voir ses notifications</p>
    </div>

    <!-- Loading -->
    <div v-else-if="notifStore.isLoading" class="state-box">
      <div class="spinner-wrap">
        <div class="spinner-track"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="state-text" style="margin-top:1rem">Chargement des notifications...</p>
    </div>

    <!-- Empty: no notifications -->
    <div v-else-if="notifStore.notifications.length === 0" class="state-box">
      <div class="state-icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
      </div>
      <p class="state-text">Aucune notification pour cet utilisateur</p>
    </div>

    <!-- Table -->
    <div v-else>
      <!-- Stats bar -->
      <div class="stats-bar">
        <span class="stat-total">{{ notifStore.pagination.total }} notification(s)</span>
        <span v-if="notifStore.unreadCount > 0" class="stat-unread">
          {{ notifStore.unreadCount }} non lue(s)
        </span>
      </div>

      <!-- Table header -->
      <div class="table-header">
        <div>Type</div>
        <div>Titre</div>
        <div>Message</div>
        <div>Date</div>
        <div>Statut</div>
        <div></div>
      </div>

      <!-- Rows -->
      <div class="divide-y divide-slate-50">
        <div
          v-for="notif in notifStore.notifications"
          :key="notif.id"
          :class="['table-row', !notif.isRead ? 'table-row-unread' : '']"
        >
          <!-- Type -->
          <div>
            <span
              class="type-badge"
              :style="{ background: typeConfig[notif.notificationType]?.bg ?? '#f1f5f9', color: typeConfig[notif.notificationType]?.color ?? '#64748b' }"
            >
              {{ typeConfig[notif.notificationType]?.label ?? notif.notificationType }}
            </span>
          </div>

          <!-- Titre -->
          <div class="col-title">{{ notif.title }}</div>

          <!-- Message -->
          <div class="col-msg">{{ notif.message }}</div>

          <!-- Date -->
          <div class="col-date">{{ formatDate(notif.createdAt) }}</div>

          <!-- Statut -->
          <div>
            <span :class="['read-badge', notif.isRead ? 'read-badge-yes' : 'read-badge-no']">
              {{ notif.isRead ? 'Lu' : 'Non lu' }}
            </span>
          </div>

          <!-- Actions -->
          <div class="row-actions">
            <button
              v-if="!notif.isRead"
              @click="handleMarkRead(notif.id)"
              title="Marquer comme lu"
              class="action-btn action-read"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
            <button
              @click="handleDelete(notif.id)"
              title="Supprimer"
              class="action-btn action-delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="notifStore.pagination.total > 0" class="table-footer">
        <span class="footer-count">{{ notifStore.notifications.length }} / {{ notifStore.pagination.total }} notifications</span>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-fade">
      <div v-if="toast.show" :class="['nt-toast', toast.type === 'success' ? 'toast-success' : 'toast-error']">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.nt-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 153, 0.04);
  overflow: hidden;
}

/* ─── Header ─────────────────────────────── */
.nt-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbff;
}

.nt-icon {
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

.nt-title { font-size: 0.9375rem; font-weight: 700; color: #0f172a; }
.nt-subtitle { font-size: 0.8125rem; color: #64748b; margin-top: 0.125rem; }

.btn-mark-all {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #000099;
  background: rgba(0, 0, 153, 0.06);
  border: 1px solid rgba(0, 0, 153, 0.15);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-mark-all:hover { background: rgba(0, 0, 153, 0.12); }

.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: #000099;
  color: white;
  padding: 0 0.3rem;
}

/* ─── User Selector Bar ──────────────────── */
.user-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: white;
}

.user-search-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #94a3b8;
  min-width: 200px;
}

.user-search-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8125rem;
  color: #0f172a;
  width: 140px;
}

.user-select {
  flex: 1;
  padding: 0.5625rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  color: #0f172a;
  outline: none;
  cursor: pointer;
}

.user-select:focus { border-color: #00ced1; box-shadow: 0 0 0 3px rgba(0, 206, 209, 0.12); }

.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5625rem 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  background: white;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-refresh:hover:not(:disabled) { background: #f8fafc; border-color: #00ced1; color: #000099; }
.btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── States ─────────────────────────────── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  gap: 0.75rem;
}

.state-icon-wrap {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.state-text { font-size: 0.875rem; color: #94a3b8; font-weight: 500; }

.spinner-wrap { position: relative; width: 3rem; height: 3rem; }
.spinner-track {
  position: absolute;
  inset: 0;
  border: 4px solid #e2e8f0;
  border-radius: 50%;
}
.spinner-ring {
  position: absolute;
  inset: 0;
  border: 4px solid transparent;
  border-top-color: #000099;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Stats bar ──────────────────────────── */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.5rem;
  background: #fafbff;
  border-bottom: 1px solid #f1f5f9;
}

.stat-total { font-size: 0.8125rem; color: #64748b; font-weight: 500; }
.stat-unread {
  font-size: 0.75rem;
  font-weight: 700;
  color: #000099;
  background: rgba(0, 0, 153, 0.08);
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

/* ─── Table ──────────────────────────────── */
.table-header {
  display: grid;
  grid-template-columns: 110px 1fr 1.5fr 160px 90px 80px;
  gap: 1rem;
  padding: 0.625rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}

.table-row {
  display: grid;
  grid-template-columns: 110px 1fr 1.5fr 160px 90px 80px;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  align-items: center;
  transition: background 0.1s;
}

.table-row:hover { background: #fafbff; }
.table-row-unread { background: rgba(0, 206, 209, 0.03); }
.table-row-unread:hover { background: rgba(0, 206, 209, 0.06); }

.col-title { font-size: 0.875rem; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.col-msg { font-size: 0.8125rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.col-date { font-size: 0.75rem; color: #94a3b8; }

/* ─── Badges ─────────────────────────────── */
.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

.read-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.read-badge-yes { background: #dcfce7; color: #16a34a; }
.read-badge-no  { background: #fef3c7; color: #d97706; }

/* ─── Row actions ────────────────────────── */
.row-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.375rem; }

.action-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.action-read  { background: rgba(0, 0, 153, 0.06); color: #000099; }
.action-read:hover  { background: rgba(0, 0, 153, 0.14); }
.action-delete { background: #fee2e2; color: #dc2626; }
.action-delete:hover { background: #fecaca; }

/* ─── Footer ─────────────────────────────── */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.875rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  background: #fafbff;
}

.footer-count { font-size: 0.8125rem; color: #94a3b8; }

/* ─── Toast ──────────────────────────────── */
.nt-toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 60;
  padding: 0.75rem 1.125rem;
  border-radius: 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.toast-success { background: #000099; color: white; }
.toast-error   { background: #dc2626; color: white; }

.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>
