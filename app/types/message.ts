export type MessageType = 'text' | 'image' | 'file'

export interface MessageUser {
  id: string
  email: string
  profile: {
    firstName: string
    lastName: string
    avatarUrl?: string
  }
}

export interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  type: MessageType
  metadata?: Record<string, any>
  isRead: boolean
  createdAt: string
  sender?: MessageUser
  recipient?: MessageUser
}

export interface Conversation {
  user: MessageUser
  lastMessage?: {
    content: string
    createdAt: string
    senderId: string
  }
  unreadCount: number
}

export interface MessagesListResponse {
  messages: Message[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface SendMessagePayload {
  senderId: string
  recipientId: string
  content: string
  type?: MessageType
  metadata?: Record<string, any>
}
