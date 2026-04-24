<script setup lang="ts">
import type { Message, MessageUser } from '~/types/message'

const props = defineProps<{
  messages: Message[]
  currentUserId: string
  otherUser: MessageUser | null
  loading: boolean
  sending: boolean
}>()

const emit = defineEmits<{
  (e: 'send', content: string): void
}>()

const messageText = ref('')
const messagesEnd = ref<HTMLElement | null>(null)

const isMine = (msg: Message) =>
  msg.senderId === props.currentUserId || msg.sender?.id === props.currentUserId

const initials = (user: MessageUser) => {
  const fl = (user.profile?.firstName?.[0] ?? '') + (user.profile?.lastName?.[0] ?? '')
  return fl.toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'
}

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const formatDateSep = (dateStr: string) => {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return "Aujourd'hui"
  const yest = new Date(); yest.setDate(now.getDate() - 1)
  if (d.toDateString() === yest.toDateString()) return 'Hier'
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Inject date separators
const grouped = computed(() => {
  type Item = { kind: 'date'; label: string } | { kind: 'msg'; msg: Message }
  const result: Item[] = []
  let lastDate = ''
  for (const msg of props.messages) {
    const date = new Date(msg.createdAt).toDateString()
    if (date !== lastDate) {
      result.push({ kind: 'date', label: formatDateSep(msg.createdAt) })
      lastDate = date
    }
    result.push({ kind: 'msg', msg })
  }
  return result
})

const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  nextTick(() => messagesEnd.value?.scrollIntoView({ behavior }))
}

const handleSend = () => {
  const text = messageText.value.trim()
  if (!text || props.sending) return
  emit('send', text)
  messageText.value = ''
  scrollToBottom()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

watch(() => props.messages.length, () => scrollToBottom())
watch(() => props.otherUser?.id, () => nextTick(() => scrollToBottom('instant')))
onMounted(() => scrollToBottom('instant'))
</script>

<template>
  <div class="thread-panel">

    <!-- Header -->
    <div class="thread-header">
      <div v-if="otherUser" class="thread-user">
        <div class="t-avatar">{{ initials(otherUser) }}</div>
        <div>
          <p class="t-name">{{ otherUser.profile?.firstName }} {{ otherUser.profile?.lastName }}</p>
          <p class="t-email">{{ otherUser.email }}</p>
        </div>
      </div>
      <div v-else class="thread-user">
        <div class="t-avatar t-avatar-empty">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <p class="t-name text-slate-400">Sélectionnez une conversation</p>
      </div>
    </div>

    <!-- Messages area -->
    <div class="thread-messages">

      <!-- Loading -->
      <div v-if="loading" class="thread-state">
        <div class="msg-spinner"></div>
        <p class="thread-state-text">Chargement...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="!otherUser" class="thread-state">
        <div class="thread-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.25">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <p class="thread-state-text">Sélectionnez une conversation ou démarrez-en une nouvelle</p>
      </div>

      <div v-else-if="grouped.length === 0 && !loading" class="thread-state">
        <div class="thread-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.25">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
          </svg>
        </div>
        <p class="thread-state-text">Aucun message. Envoyez le premier !</p>
      </div>

      <!-- Messages -->
      <div v-else class="thread-msgs-inner">
        <template v-for="(item, idx) in grouped" :key="idx">

          <!-- Date separator -->
          <div v-if="item.kind === 'date'" class="date-sep">
            <span class="date-sep-label">{{ item.label }}</span>
          </div>

          <!-- Message bubble -->
          <div v-else-if="item.kind === 'msg'" :class="['msg-row', isMine(item.msg) ? 'msg-row-mine' : 'msg-row-theirs']">
            <!-- Their avatar -->
            <div v-if="!isMine(item.msg) && otherUser" class="msg-avatar">
              {{ initials(otherUser) }}
            </div>

            <div :class="['msg-bubble', isMine(item.msg) ? 'bubble-mine' : 'bubble-theirs']">
              <p class="msg-content">{{ item.msg.content }}</p>
              <div :class="['msg-meta', isMine(item.msg) ? 'msg-meta-mine' : 'msg-meta-theirs']">
                <span>{{ formatTime(item.msg.createdAt) }}</span>
                <svg v-if="isMine(item.msg)" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path v-if="item.msg.isRead" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>

        </template>
        <div ref="messagesEnd" class="h-2"></div>
      </div>
    </div>

    <!-- Composer -->
    <div v-if="otherUser" class="thread-composer">
      <textarea
        v-model="messageText"
        @keydown="handleKeydown"
        placeholder="Écrivez votre message... (Entrée pour envoyer)"
        class="composer-input"
        rows="1"
      ></textarea>
      <button
        @click="handleSend"
        :disabled="!messageText.trim() || sending"
        class="composer-send"
      >
        <svg v-if="sending" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
      </button>
    </div>

  </div>
</template>

<style scoped>
.thread-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

/* ─── Header ───────────────────────────────────── */
.thread-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  flex-shrink: 0;
}

.thread-user { display: flex; align-items: center; gap: 0.75rem; }

.t-avatar {
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
}

.t-avatar-empty { background: #f1f5f9; color: #94a3b8; }

.t-name { font-size: 0.9375rem; font-weight: 700; color: #0f172a; }
.t-email { font-size: 0.75rem; color: #94a3b8; margin-top: 0.1rem; }

/* ─── Messages area ────────────────────────────── */
.thread-messages {
  flex: 1;
  overflow-y: auto;
  background: #f8fafc;
  position: relative;
}

.thread-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
}

.thread-empty-icon {
  width: 5rem;
  height: 5rem;
  border-radius: 1.25rem;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.thread-state-text { font-size: 0.875rem; color: #94a3b8; text-align: center; max-width: 280px; }

.msg-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top-color: #000099;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.thread-msgs-inner { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.25rem; }

/* ─── Date separator ──────────────────────────── */
.date-sep {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.75rem 0;
}

.date-sep-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #94a3b8;
  background: #eef0f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  letter-spacing: 0.03em;
}

/* ─── Message rows ────────────────────────────── */
.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.125rem;
}

.msg-row-mine { flex-direction: row-reverse; }
.msg-row-theirs { flex-direction: row; }

.msg-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: rgba(0, 0, 153, 0.1);
  color: #000099;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 800;
  flex-shrink: 0;
  margin-bottom: 0.125rem;
}

/* ─── Bubbles ─────────────────────────────────── */
.msg-bubble {
  max-width: 65%;
  padding: 0.625rem 0.875rem;
  border-radius: 1.125rem;
  position: relative;
}

.bubble-mine {
  background: #000099;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.bubble-theirs {
  background: white;
  color: #0f172a;
  border-bottom-left-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.msg-content { font-size: 0.875rem; line-height: 1.5; word-wrap: break-word; white-space: pre-wrap; }

.msg-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.6rem;
}

.msg-meta-mine { justify-content: flex-end; color: rgba(255,255,255,0.65); }
.msg-meta-theirs { justify-content: flex-end; color: #94a3b8; }

/* ─── Composer ────────────────────────────────── */
.thread-composer {
  display: flex;
  align-items: flex-end;
  gap: 0.625rem;
  padding: 0.875rem 1.25rem;
  border-top: 1px solid #f1f5f9;
  background: white;
  flex-shrink: 0;
}

.composer-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
  resize: none;
  max-height: 120px;
  overflow-y: auto;
  line-height: 1.5;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.composer-input:focus {
  border-color: #00ced1;
  box-shadow: 0 0 0 3px rgba(0, 206, 209, 0.12);
  background: white;
}

.composer-send {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #000099;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, opacity 0.15s, transform 0.1s;
}

.composer-send:hover:not(:disabled) { background: #0000bb; transform: scale(1.05); }
.composer-send:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
