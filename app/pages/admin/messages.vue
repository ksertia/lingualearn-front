<script setup lang="ts">
import { useMessageStore } from '~/stores/messageStore'
import { useAuthStore } from '~/stores/authStore'
import type { MessageUser } from '~/types/message'
import ConversationList from '~/components/admin/messages/ConversationList.vue'
import MessageThread from '~/components/admin/messages/MessageThread.vue'

definePageMeta({ layout: 'admin' })

const messageStore = useMessageStore()
const authStore = useAuthStore()

const handleSelectConversation = async (user: MessageUser) => {
  const currentUserId = authStore.user?.id
  if (!currentUserId) return
  await messageStore.openConversation(user, currentUserId)
}

const handleSend = async (content: string) => {
  const currentUserId = authStore.user?.id
  const recipientId = messageStore.activeUserId
  if (!currentUserId || !recipientId) return
  await messageStore.sendMessage({
    senderId: currentUserId,
    recipientId,
    content,
    type: 'text',
  })
}

watch(
  () => authStore.user?.id,
  (id) => { if (id) messageStore.fetchConversations() },
  { immediate: true },
)
</script>

<template>
  <div class="page-root">

    <!-- Page header -->
    <div class="page-hero">
      <div>
        <h1 class="page-heading">Messages</h1>
        <p class="page-sub">Conversations avec les utilisateurs de la plateforme</p>
      </div>
    </div>

    <!-- Messaging layout -->
    <div class="msg-shell">
      <ConversationList
        :conversations="messageStore.conversations"
        :active-user-id="messageStore.activeUserId"
        :loading="messageStore.isLoadingConversations"
        @select="handleSelectConversation"
      />
      <MessageThread
        :messages="messageStore.messages"
        :current-user-id="authStore.user?.id ?? ''"
        :other-user="messageStore.activeUser"
        :loading="messageStore.isLoadingMessages"
        :sending="messageStore.isSending"
        @send="handleSend"
      />
    </div>
  </div>
</template>

<style scoped>
.page-root { padding: 32px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }

.page-hero { margin-bottom: 20px; }

.page-heading {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.03em;
}

.page-sub {
  font-size: 13px;
  color: #9CA3AF;
  margin-top: 3px;
}

.msg-shell {
  display: flex;
  flex: 1;
  min-height: 0;
  background: white;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 1px 2px rgba(0,0,0,0.05),
    0 3px 10px rgba(0,0,0,0.05),
    0 0 0 1px rgba(17,24,39,0.05);
  height: calc(100vh - 240px);
}
</style>

