<script setup lang="ts">
import { ref } from 'vue'
import SecuritySection from '~/components/settings/SecuritySection.vue'
import PaymentSection from '~/components/settings/PaymentSection.vue'
import GeneralSection from '~/components/settings/GeneralSection.vue'

definePageMeta({ layout: 'admin' })

const tabs = [
  {
    id: 'security',
    label: 'Sécurité',
    description: 'Mots de passe & accès',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    id: 'payment',
    label: 'Paiement',
    description: 'Abonnements & transactions',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    id: 'general',
    label: 'Configuration',
    description: 'Langue, logo & général',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
]

const activeTab = ref('security')
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const showMessage = (type: 'success' | 'error', text: string) => {
  message.value = { type, text }
  setTimeout(() => { message.value = null }, 3500)
}
</script>

<template>
  <div class="page-root">

    <!-- Toast -->
    <Transition name="msg-fade">
      <div
        v-if="message"
        class="page-toast"
        :class="message.type === 'success' ? 'page-toast--ok' : 'page-toast--err'"
      >
        <svg v-if="message.type === 'success'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ message.text }}
      </div>
    </Transition>

    <!-- Page header -->
    <div class="page-hero">
      <div>
        <h1 class="page-heading">Paramètres</h1>
        <p class="page-sub">Configurez la sécurité, les paiements et les préférences générales</p>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path :d="tab.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" />
        </svg>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Section content -->
    <div class="section-wrap">
      <Transition name="section-fade" mode="out-in">
        <div :key="activeTab">
          <SecuritySection v-if="activeTab === 'security'" @message="showMessage" />
          <PaymentSection  v-else-if="activeTab === 'payment'" @message="showMessage" />
          <GeneralSection  v-else-if="activeTab === 'general'" @message="showMessage" />
        </div>
      </Transition>
    </div>

  </div>
</template>

<style scoped>
.page-root { padding: 32px; }

/* Page header */
.page-hero { margin-bottom: 24px; }

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

/* ── Tab bar ─────────────────────────── */
.tab-bar {
  display: flex;
  gap: 2px;
  background: white;
  border-radius: 12px;
  padding: 5px;
  margin-bottom: 24px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 1px 2px rgba(0,0,0,0.04),
    0 3px 10px rgba(0,0,0,0.04),
    0 0 0 1px rgba(17,24,39,0.05);
  width: fit-content;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  transition: all 0.12s ease;
  white-space: nowrap;
}

.tab-btn:hover { background: #F9FAFB; color: #374151; }

.tab-btn--active {
  background: #16A34A;
  color: white;
  box-shadow: 0 1px 4px rgba(22,163,74,0.3);
}

.tab-btn--active .tab-icon { opacity: 1; }

.tab-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.12s;
}

.tab-btn:hover .tab-icon { opacity: 0.9; }
.tab-btn--active .tab-icon { opacity: 1; }

.tab-label { line-height: 1; }

/* Section */
.section-wrap { /* full width */ }

/* Transition */
.section-fade-enter-active, .section-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.section-fade-enter-from, .section-fade-leave-to { opacity: 0; transform: translateY(6px); }

/* Toast */
.page-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.page-toast--ok  { background: #16A34A; color: white; }
.page-toast--err { background: #DC2626; color: white; }

.msg-fade-enter-active, .msg-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.msg-fade-enter-from, .msg-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
