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
  <div class="msg-page">
    <div class="msg-layout">
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
.msg-page {
  height: calc(100vh - 9.5rem);
  min-height: 480px;
}

.msg-layout {
  display: flex;
  height: 100%;
  background: white;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 153, 0.04);
  overflow: hidden;
}
</style>
