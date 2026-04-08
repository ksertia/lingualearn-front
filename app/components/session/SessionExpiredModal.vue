<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-120 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sessionStore.isSessionExpired"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 class="text-center text-lg font-bold text-slate-800">
            Session expirée
          </h2>
          <p class="mt-2 text-center text-sm text-slate-500">
            Votre session a expiré. Reconnectez-vous pour continuer.
          </p>
          <button
            type="button"
            class="mt-6 w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20"
            @click="handleOk"
          >
            OK
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { useSessionStore } from "~/stores/sessionStore";

const sessionStore = useSessionStore();
const authStore = useAuthStore();

const handleOk = () => {
  sessionStore.hideSessionExpired();
  authStore.logout();
};
</script>
