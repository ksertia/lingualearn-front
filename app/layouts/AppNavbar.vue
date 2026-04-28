<template>
  <nav class="h-16 bg-[#000099] px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
        <span class="text-white font-black text-xs">TB</span>
      </div>
      <span class="text-xl font-bold text-white tracking-tight">Ti<span class="text-[#00CED1]">Bi</span></span>
    </div>

    <div class="flex items-center gap-4">

      <!-- ── Bell + Notification Panel ─────────────────── -->
      <div class="relative">
        <button
          @click="toggleNotif"
          class="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
          :class="{ 'bg-white/15 border-white/20 text-white': isNotifOpen }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="totalUnread > 0" class="notif-badge">
            {{ totalUnread > 99 ? '99+' : totalUnread }}
          </span>
        </button>

        <!-- Dropdown panel -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform scale-95 opacity-0 translate-y-1"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="isNotifOpen" class="drop-panel">

            <!-- Header -->
            <div class="drop-header">
              <h3 class="drop-title">Notifications</h3>
              <span v-if="notifStore.unreadCount > 0" class="drop-total-badge">{{ notifStore.unreadCount }} non lu(s)</span>
            </div>

            <!-- ── Liste des notifications ── -->
            <div class="drop-body">
              <div v-if="notifStore.isLoading" class="drop-state">
                <div class="drop-spinner"></div>
              </div>
              <div v-else-if="recentNotifs.length === 0" class="drop-state">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <p>Aucune notification</p>
              </div>
              <div v-else class="drop-list">
                <button
                  v-for="n in recentNotifs"
                  :key="n.id"
                  :class="['drop-item', !n.isRead ? 'drop-item-unread' : '']"
                  @click="handleNotifClick(n)"
                >
                  <div class="drop-item-dot" :style="{ background: typeColors[n.notificationType] ?? '#64748b' }"></div>
                  <div class="drop-item-body">
                    <p class="drop-item-title">{{ n.title }}</p>
                    <p class="drop-item-sub">{{ n.message }}</p>
                    <p class="drop-item-time">{{ relativeTime(n.createdAt) }}</p>
                  </div>
                  <div v-if="!n.isRead" class="unread-dot"></div>
                </button>
              </div>
              <NuxtLink v-if="isAdmin" to="/admin/notifications" @click="isNotifOpen = false" class="drop-footer-link">
                Voir toutes les notifications
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
            </div>

          </div>
        </Transition>
      </div>

      <!-- ── Profile dropdown ───────────────────────────── -->
      <div class="relative">
        <button
          @click="isDropdownOpen = !isDropdownOpen; isNotifOpen = false"
          class="flex items-center gap-3 p-1.5 pr-3 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/20"
        >
          <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white overflow-hidden border border-white/30">
            <img v-if="authStore.user?.profile?.avatarUrl" :src="authStore.user.profile.avatarUrl" alt="Avatar" class="w-full h-full object-cover">
            <span v-else class="font-bold text-sm">{{ authStore.fullname.charAt(0) }}{{ authStore.fullname.charAt(1) }}</span>
          </div>
          <div class="text-left hidden sm:block">
            <p class="text-xs font-black text-white leading-none">{{ authStore.fullname }}</p>
            <p class="text-[10px] text-white/70 font-medium mt-1 uppercase">{{ accountTypeLabel[authStore.user?.accountType ?? ''] || 'Formateur' }}</p>
          </div>
          <svg
            class="w-4 h-4 text-white/70 transition-transform duration-200"
            :class="{ 'rotate-180': isDropdownOpen }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-slate-50 mb-1">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compte connecté</p>
            </div>

            <NuxtLink
              to="/admin/profil"
              class="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              @click="isDropdownOpen = false"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="font-bold">Mon Profil</span>
            </NuxtLink>

            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 transition-colors mt-1"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="font-bold">Déconnexion</span>
            </button>
          </div>
        </Transition>
      </div>

    </div>
  </nav>

  <!-- Overlay fermeture -->
  <div
    v-if="isDropdownOpen || isNotifOpen"
    @click="isDropdownOpen = false; isNotifOpen = false"
    class="fixed inset-0 z-40 bg-transparent"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/authStore';
import { useNotificationStore } from '~/stores/notificationStore';
import { useMessageStore } from '~/stores/messageStore';
import { useNotificationSound } from '~/composables/useNotificationSound';
import { accountTypeLabel } from '~/utils/labels';
import type { Notification } from '~/types/notification';

const router = useRouter();
const authStore = useAuthStore();
const notifStore = useNotificationStore();
const messageStore = useMessageStore();
const { playMessage, playNotification } = useNotificationSound();

const isDropdownOpen = ref(false);
const isNotifOpen = ref(false);

const totalUnread = computed(() => notifStore.unreadCount + messageStore.unreadCount);
const isAdmin = computed(() => authStore.user?.accountType === 'admin');

const recentNotifs = computed(() => notifStore.notifications.slice(0, 8));

const typeColors: Record<string, string> = {
  info:    '#000099',
  success: '#16a34a',
  warning: '#d97706',
  error:   '#dc2626',
};

const relativeTime = (dateStr: string) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'À l\'instant';
  if (mins < 60) return `il y a ${mins}m`;
  const h = Math.floor(mins / 60);
  if (h < 24)    return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
};

const toggleNotif = () => {
  isNotifOpen.value = !isNotifOpen.value;
  isDropdownOpen.value = false;
  if (isNotifOpen.value) {
    const userId = authStore.user?.id;
    if (userId && notifStore.notifications.length === 0) {
      notifStore.fetchUserNotifications(userId);
    }
  }
};

const handleNotifClick = async (n: Notification) => {
  if (!n.isRead) await notifStore.markAsRead(n.id);
  isNotifOpen.value = false;
  if (n.actionUrl) router.push(n.actionUrl);
};

function handleLogout() {
  isDropdownOpen.value = false;
  authStore.logout();
}

// Initial load — wait for auth to be ready
watch(
  () => authStore.user?.id,
  (userId) => {
    if (!userId) return;
    notifStore.fetchUserNotifications(userId);
    messageStore.fetchUnreadCount();
    messageStore.fetchConversations();
  },
  { immediate: true },
);

// Sound on new messages
watch(
  () => messageStore.unreadCount,
  (next, prev) => { if (next > (prev ?? 0)) playMessage(); },
);

// Sound on new notifications
watch(
  () => notifStore.unreadCount,
  (next, prev) => { if (next > (prev ?? 0)) playNotification(); },
);

// Poll every 30 s — pollForNew never lowers the badge count
let _pollTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  _pollTimer = setInterval(() => {
    const userId = authStore.user?.id;
    if (!userId) return;
    messageStore.fetchUnreadCount();
    notifStore.pollForNew(userId);
  }, 30_000);
});

onUnmounted(() => {
  if (_pollTimer) clearInterval(_pollTimer);
});
</script>

<style scoped>
/* ── Bell badge ───────────────────────────────── */
.notif-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f43f5e;
  border: 2px solid #000099;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 900;
  color: white;
  line-height: 1;
  padding: 0 3px;
  pointer-events: none;
}

/* ── Dropdown panel ───────────────────────────── */
.drop-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 0.625rem);
  width: 380px;
  background: white;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 12px 48px rgba(0, 0, 153, 0.12), 0 2px 8px rgba(0,0,0,0.06);
  z-index: 50;
  overflow: hidden;
}

/* Header */
.drop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
}

.drop-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #0f172a;
}

.drop-total-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #000099;
  background: rgba(0, 0, 153, 0.08);
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

/* Tabs */
.drop-tabs {
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  padding: 0 1rem;
  gap: 0.25rem;
}

.drop-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
}

.drop-tab:hover { color: #475569; }

.drop-tab-active {
  color: #000099;
  border-bottom-color: #000099;
}

.tab-count {
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 153, 0.1);
  color: #000099;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 900;
  padding: 0 4px;
}

.tab-count-msg {
  background: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
}

/* Body (scrollable) */
.drop-body { display: flex; flex-direction: column; }

.drop-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  gap: 0.625rem;
  color: #cbd5e1;
  font-size: 0.8125rem;
}

.drop-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #000099;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* List */
.drop-list {
  max-height: 340px;
  overflow-y: auto;
}

/* Item */
.drop-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.1s;
  position: relative;
}

.drop-item:hover { background: #f8fafc; }
.drop-item:last-child { border-bottom: none; }

.drop-item-unread { background: rgba(0, 0, 153, 0.03); }
.drop-item-unread:hover { background: rgba(0, 0, 153, 0.06); }

/* Notification type dot */
.drop-item-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.375rem;
}

/* Message avatar */
.conv-ava {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(0, 0, 153, 0.1);
  color: #000099;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 800;
  flex-shrink: 0;
}

/* Item body */
.drop-item-body { flex: 1; min-width: 0; }

.drop-item-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drop-item-sub {
  font-size: 0.8125rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.125rem;
}

.drop-item-time {
  font-size: 0.6875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

/* Unread blue dot (top right) */
.unread-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #000099;
  flex-shrink: 0;
  margin-top: 0.375rem;
}

/* Conv unread badge */
.conv-badge {
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000099;
  color: white;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 900;
  padding: 0 0.25rem;
  flex-shrink: 0;
}

/* Footer link */
.drop-footer-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #000099;
  border-top: 1px solid #f1f5f9;
  background: #fafbff;
  text-decoration: none;
  transition: background 0.15s;
}

.drop-footer-link:hover { background: #f1f5f9; }
</style>
