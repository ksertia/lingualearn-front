import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiService } from '~/services/api'
import { useAuthStore } from '~/stores/authStore'
import type { Message, Conversation, MessageUser, SendMessagePayload } from '~/types/message'

// Try every naming convention backends use for a user ID
function extractId(u: any): string {
  return u?.id ?? u?._id ?? u?.userId ?? u?.user_id ?? u?.uid ?? ''
}

// Normalise a user object — always produces { id, email, profile: { firstName, lastName } }
function normalizeUser(u: any): MessageUser {
  if (!u) return { id: '', email: '', profile: { firstName: '', lastName: '' } }

  const id = extractId(u)
  const email = u.email ?? u.emailAddress ?? u.email_address ?? ''

  let firstName = ''
  let lastName = ''
  let avatarUrl: string | undefined

  if (u.profile && typeof u.profile === 'object') {
    firstName = u.profile.firstName ?? u.profile.first_name ?? ''
    lastName  = u.profile.lastName  ?? u.profile.last_name  ?? ''
    avatarUrl = u.profile.avatarUrl ?? u.profile.avatar_url ?? u.profile.avatar
  } else {
    // Flat user object
    firstName = u.firstName ?? u.first_name ?? u.name?.split(' ')[0] ?? u.username ?? ''
    lastName  = u.lastName  ?? u.last_name  ?? (u.name?.split(' ').slice(1).join(' ') ?? '')
    avatarUrl = u.avatarUrl ?? u.avatar_url ?? u.avatar
  }

  return { id, email, profile: { firstName, lastName, avatarUrl } }
}

// Pick the "other" participant from a conversation object
function resolveConvUser(c: any, currentUserId: string): any {
  // Explicit dedicated field — try every common name
  const direct = c.user ?? c.otherUser ?? c.other_user ?? c.participant
    ?? c.recipient ?? c.contact ?? c.member ?? c.with ?? c.interlocutor
  if (direct) return direct

  // participants[] — pick the one that isn't us
  if (Array.isArray(c.participants) && c.participants.length > 0) {
    return c.participants.find(
      (p: any) => extractId(p) !== currentUserId
    ) ?? c.participants[0]
  }

  // sender field — return if it's not us
  if (c.sender && extractId(c.sender) !== currentUserId) return c.sender
  if (c.receiver && extractId(c.receiver) !== currentUserId) return c.receiver
  if (c.from && extractId(c.from) !== currentUserId) return c.from
  if (c.to && extractId(c.to) !== currentUserId) return c.to

  return null
}

function normalizeConversation(c: any, currentUserId: string): Conversation {
  const rawUser = resolveConvUser(c, currentUserId)

  // last message may be nested in various shapes
  const lastMsg =
    c.lastMessage ??
    c.last_message ??
    (Array.isArray(c.messages) && c.messages.length > 0
      ? c.messages[c.messages.length - 1]
      : undefined)

  const user = normalizeUser(rawUser)

  // If the user object had no ID, derive it from conversation-level fields
  if (!user.id) {
    const candidates: (string | undefined)[] = [
      // Explicit "other user" ID fields at conversation level
      c.partnerId, c.contactId, c.otherUserId, c.other_user_id,
      c.interlocutorId, c.peerId,
      // senderId / recipientId — pick whichever isn't us
      c.recipientId !== currentUserId ? c.recipientId : undefined,
      c.senderId    !== currentUserId ? c.senderId    : undefined,
      c.recipient_id !== currentUserId ? c.recipient_id : undefined,
      c.sender_id   !== currentUserId ? c.sender_id   : undefined,
      // Last message sender (if it's not us)
      lastMsg?.senderId !== currentUserId ? lastMsg?.senderId : undefined,
      lastMsg?.sender_id !== currentUserId ? lastMsg?.sender_id : undefined,
    ]
    user.id = candidates.find(v => !!v) ?? ''
  }

  return {
    user,
    lastMessage: lastMsg,
    unreadCount: c.unreadCount ?? c.unread_count ?? c.unreadMessages ?? c.unread ?? 0,
  }
}

// Unwrap every possible API envelope, then normalise each conversation row
function extractConversations(res: any, currentUserId: string): Conversation[] {
  let arr: any[] | null = null
  if (!res) return []
  if (Array.isArray(res)) arr = res
  else if (Array.isArray(res.data)) arr = res.data
  else if (Array.isArray(res.conversations)) arr = res.conversations
  else if (res.data && Array.isArray(res.data.conversations)) arr = res.data.conversations
  else if (res.data && Array.isArray(res.data.data)) arr = res.data.data
  if (!arr) return []
  return arr.map(c => normalizeConversation(c, currentUserId))
}

// Normalise n'importe quel format de réponse pour les messages
function extractMessages(res: any): Message[] {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.messages)) return res.messages
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.messages)) return res.data.messages
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

function extractPagination(res: any) {
  return res?.pagination ?? res?.data?.pagination ?? null
}

export const useMessageStore = defineStore('message', () => {
  const apiService = useApiService()

  const conversations = ref<Conversation[]>([])
  const messages = ref<Message[]>([])
  const activeUserId = ref<string | null>(null)
  const activeUser = ref<MessageUser | null>(null)
  const unreadCount = ref(0)
  const isLoadingConversations = ref(false)
  const isLoadingMessages = ref(false)
  const isSending = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({ page: 1, limit: 30, total: 0 })

  const activeConversation = computed(() =>
    conversations.value.find(c => c.user.id === activeUserId.value)
  )

  async function fetchConversations() {
    isLoadingConversations.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
      const currentUserId = authStore.user?.id ?? ''
      const response = await apiService.getConversations() as any
      conversations.value = extractConversations(response, currentUserId)
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Erreur de récupération'
    } finally {
      isLoadingConversations.value = false
    }
  }

  async function fetchUnreadCount() {
    try {
      const response = await apiService.getMessagesUnreadCount() as any
      unreadCount.value = response?.unreadCount ?? response?.data?.unreadCount ?? 0
    } catch {}
  }

  async function openConversation(user: MessageUser, currentUserId: string) {
    activeUserId.value = user.id
    activeUser.value = user
    messages.value = []
    isLoadingMessages.value = true
    try {
      const response = await apiService.getConversationMessages(currentUserId, user.id) as any
      messages.value = extractMessages(response)
      const pag = extractPagination(response)
      if (pag) pagination.value = pag

      await apiService.markMessagesRead(user.id)
      const conv = conversations.value.find(c => c.user.id === user.id)
      if (conv) conv.unreadCount = 0
      await fetchUnreadCount()
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Erreur chargement messages'
      console.error('[MessageStore] openConversation error:', err, { currentUserId, userId: user.id })
    } finally {
      isLoadingMessages.value = false
    }
  }

  async function sendMessage(payload: SendMessagePayload) {
    isSending.value = true
    try {
      const response = await apiService.sendMessage(payload) as any

      // Treat as error only when the API explicitly says so
      if (response?.success === false || response?.error) {
        const errMsg = response?.error ?? response?.message ?? "Erreur lors de l'envoi"
        return { success: false, message: errMsg }
      }

      // Extract the created message from any common response shape
      const apiMsg =
        (response?.data?.id    ? response.data    : null) ??
        (response?.message?.id ? response.message : null) ??
        (response?.msg?.id     ? response.msg     : null) ??
        (response?.id          ? response         : null)

      const msg: Message = apiMsg ?? {
        id: `local-${Date.now()}`,
        senderId: payload.senderId,
        recipientId: payload.recipientId,
        content: payload.content,
        type: payload.type ?? 'text',
        isRead: false,
        createdAt: new Date().toISOString(),
      }

      messages.value.push(msg)

      const now = new Date().toISOString()
      const existingConv = conversations.value.find(c => c.user.id === payload.recipientId)
      if (existingConv) {
        existingConv.lastMessage = { content: payload.content, createdAt: now, senderId: payload.senderId }
      } else if (activeUser.value) {
        conversations.value.unshift({
          user: activeUser.value,
          lastMessage: { content: payload.content, createdAt: now, senderId: payload.senderId },
          unreadCount: 0,
        })
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err?.data?.message || err?.message || 'Erreur' }
    } finally {
      isSending.value = false
    }
  }

  return {
    conversations,
    messages,
    activeUserId,
    activeUser,
    activeConversation,
    unreadCount,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    error,
    pagination,
    fetchConversations,
    fetchUnreadCount,
    openConversation,
    sendMessage,
  }
})
