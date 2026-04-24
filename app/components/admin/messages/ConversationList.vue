<script setup lang="ts">
import type { Conversation, MessageUser } from '~/types/message'
import { useUserStore } from '~/stores/userStore'

const props = defineProps<{
  conversations: Conversation[]
  activeUserId: string | null
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'select', user: MessageUser): void
}>()

const search = ref('')
const showPicker = ref(false)
const pickerSearch = ref('')
const userStore = useUserStore()

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return props.conversations
  return props.conversations.filter(c =>
    (c.user.profile?.firstName ?? '').toLowerCase().includes(q) ||
    (c.user.profile?.lastName ?? '').toLowerCase().includes(q) ||
    (c.user.email ?? '').toLowerCase().includes(q)
  )
})

const pickerUsers = computed(() => {
  const q = pickerSearch.value.toLowerCase()
  const existingIds = new Set(props.conversations.map(c => c.user.id))
  return userStore.users
    .filter(u => !existingIds.has(u.id))
    .filter(u => !q ||
      u.profile.firstName.toLowerCase().includes(q) ||
      u.profile.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
    .slice(0, 60)
})

const initials = (user: MessageUser) => {
  const f = user.profile?.firstName?.[0] ?? ''
  const l = user.profile?.lastName?.[0] ?? ''
  return (f + l).toUpperCase() || user.email?.[0]?.toUpperCase() || '?'
}

const formatTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const yesterday = new Date(); yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

const startWith = (u: any) => {
  emit('select', { id: u.id, email: u.email, profile: u.profile })
  showPicker.value = false
  pickerSearch.value = ''
}

onMounted(() => {
  if (!userStore.users.length) userStore.fetchUsers()
})
</script>

<template>
  <div class="conv-panel">
    <!-- Header -->
    <div class="conv-header">
      <h2 class="conv-title">Messages</h2>
      <button @click="showPicker = !showPicker" class="btn-new" title="Nouveau message">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
      </button>
    </div>

    <!-- Search -->
    <div class="conv-search">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input v-model="search" type="text" placeholder="Rechercher..." class="conv-search-input"/>
    </div>

    <!-- New conversation picker -->
    <div v-if="showPicker" class="picker-panel">
      <div class="picker-header">
        <span class="picker-label">Nouvelle conversation</span>
        <button @click="showPicker = false" class="picker-close">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="conv-search" style="margin: 0 0.75rem 0.5rem">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="pickerSearch" type="text" placeholder="Chercher un utilisateur..." class="conv-search-input" autofocus/>
      </div>
      <div class="picker-list">
        <button
          v-for="u in pickerUsers"
          :key="u.id"
          @click="startWith(u)"
          class="picker-item"
        >
          <div class="avatar avatar-sm">{{ (u.profile.firstName[0] + u.profile.lastName[0]).toUpperCase() }}</div>
          <div class="picker-item-info">
            <span class="picker-item-name">{{ u.profile.firstName }} {{ u.profile.lastName }}</span>
            <span class="picker-item-email">{{ u.email }}</span>
          </div>
        </button>
        <p v-if="pickerUsers.length === 0" class="picker-empty">Aucun utilisateur trouvé</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="conv-state">
      <div class="mini-spinner"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0 && !showPicker" class="conv-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      <p class="conv-empty-text">{{ search ? 'Aucun résultat' : 'Aucune conversation' }}</p>
    </div>

    <!-- Conversations list -->
    <div v-else class="conv-list">
      <button
        v-for="conv in filtered"
        :key="conv.user.id"
        @click="emit('select', conv.user)"
        :class="['conv-item', activeUserId === conv.user.id ? 'conv-item-active' : '']"
      >
        <div class="avatar">{{ initials(conv.user) }}</div>
        <div class="conv-item-body">
          <div class="conv-item-top">
            <span class="conv-item-name">{{ conv.user.profile?.firstName }} {{ conv.user.profile?.lastName }}</span>
            <span class="conv-item-time">{{ formatTime(conv.lastMessage?.createdAt) }}</span>
          </div>
          <div class="conv-item-bottom">
            <span class="conv-item-preview">{{ conv.lastMessage?.content ?? 'Démarrer la conversation' }}</span>
            <span v-if="conv.unreadCount > 0" class="conv-unread">{{ conv.unreadCount }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.conv-panel {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #fafbff;
  border-right: 1px solid #f1f5f9;
  overflow: hidden;
}

/* Header */
.conv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.conv-title { font-size: 1rem; font-weight: 800; color: #0f172a; }

.btn-new {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.625rem;
  background: #000099;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-new:hover { background: #0000bb; }

/* Search */
.conv-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f1f5f9;
  border-radius: 0.75rem;
  color: #94a3b8;
}

.conv-search-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8125rem;
  color: #0f172a;
  width: 100%;
}

/* Picker */
.picker-panel {
  background: white;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.5rem;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
}

.picker-label { font-size: 0.75rem; font-weight: 700; color: #64748b; letter-spacing: 0.04em; text-transform: uppercase; }

.picker-close {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
}

.picker-close:hover { background: #f1f5f9; color: #475569; }

.picker-list { max-height: 200px; overflow-y: auto; }

.picker-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}

.picker-item:hover { background: #f8fafc; }

.picker-item-info { display: flex; flex-direction: column; min-width: 0; }
.picker-item-name { font-size: 0.8125rem; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.picker-item-email { font-size: 0.6875rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.picker-empty { font-size: 0.8125rem; color: #94a3b8; text-align: center; padding: 1rem; }

/* Avatar */
.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(0, 0, 153, 0.1);
  color: #000099;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.avatar-sm {
  width: 2rem;
  height: 2rem;
  font-size: 0.6875rem;
}

/* States */
.conv-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #cbd5e1;
}

.conv-empty-text { font-size: 0.8125rem; color: #94a3b8; }

.mini-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #000099;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* List */
.conv-list { flex: 1; overflow-y: auto; }

.conv-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.1s;
}

.conv-item:hover { background: #f1f5f9; }

.conv-item-active {
  background: rgba(0, 0, 153, 0.06);
  border-right: 3px solid #000099;
}

.conv-item-body { flex: 1; min-width: 0; }

.conv-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  margin-bottom: 0.2rem;
}

.conv-item-name { font-size: 0.875rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.conv-item-time { font-size: 0.6875rem; color: #94a3b8; flex-shrink: 0; }

.conv-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
}

.conv-item-preview { font-size: 0.8125rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.conv-unread {
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000099;
  color: white;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0 0.25rem;
  flex-shrink: 0;
}
</style>
