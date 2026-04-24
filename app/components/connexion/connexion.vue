<template>
  <div class="min-h-screen bg-[#0f1b3b] text-white">
    <div class="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
      <div class="px-6 py-10 lg:px-10">
        <!-- <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <span aria-hidden="true">←</span>
          <span>Accueil</span>
        </NuxtLink> -->

        <div class="mt-10 max-w-md">
          <h1 class="text-4xl font-semibold tracking-tight">Connectez-vous</h1>
          <p class="mt-2 text-sm text-white/70">Entrez votre email et mot de passe pour vous connecter!</p>

          <!-- <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.335-17.694 10.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.154 35.092 26.715 36 24 36c-5.173 0-9.62-3.315-11.288-7.946l-6.522 5.025C9.508 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.793 2.219-2.255 4.092-4.094 5.565l.003-.002 6.19 5.238C36.97 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              <span>se connecter via Google</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
              <span>Se connecter via Facebook</span>
            </button>
          </div>

          <div class="my-8 flex items-center gap-4">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-xs text-white/50">Ou</span>
            <div class="h-px flex-1 bg-white/10"></div>
          </div> -->

          <form class="space-y-5" @submit.prevent="onSubmit">
            <div>
              <label for="email" class="block text-sm font-medium text-white/80">Email<span class="text-red-400">*</span></label>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="info@gmail.com"
                class="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#00CED1] focus:ring-2 focus:ring-[#00CED1]/30"
                required
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-white/80">Mot de passe<span class="text-red-400">*</span></label>
              <div class="relative mt-2">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Entrez votre mot de passe"
                  class="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#00CED1] focus:ring-2 focus:ring-[#00CED1]/30"
                  required
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center px-4 text-white/60 hover:text-white"
                  @click="showPassword = !showPassword"
                  aria-label="Toggle password visibility"
                >
                  <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 1.42-.37" stroke="currentColor" stroke-width="2"/>
                    <path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 8 10 8a19.68 19.68 0 0 1-3.04 4.38" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M6.61 6.61C3.7 8.33 2 12 2 12s3.5 7 10 7c1.18 0 2.28-.19 3.3-.53" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4">
              <label class="inline-flex items-center gap-2 text-sm text-white/70">
                <input
                  v-model="remember"
                  type="checkbox"
                  class="h-4 w-4 rounded border-white/20 bg-white/10 text-[#00CED1] focus:ring-[#00CED1]/40"
                />
                <span>se souvenir de moi</span>
              </label>

              <!-- <NuxtLink to="/" class="text-sm text-[#2D5BFF] hover:underline">Mot de passe oublié?</NuxtLink> -->
            </div>

            <div v-if="error" class="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-200" aria-live="polite">
              {{ error }}
            </div>

            <div v-if="loginSuccess" class="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-200" aria-live="polite">
              {{ loginSuccess }}
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full rounded-md bg-[#000099] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00CED1] hover:shadow-lg hover:shadow-[#00CED1]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ isLoading ? "Connexion..." : "Se connecter" }}
            </button>

            <!-- <p class="text-sm text-white/60">
              vous n'avez pas de compte?
              <NuxtLink to="/signup" class="text-[#2D5BFF] hover:underline">Inscrivez-vous</NuxtLink>
            </p> -->
          </form>
        </div>
      </div>

      <div class="relative hidden overflow-hidden lg:block bg-gradient-to-br from-[#000099] via-[#0a0a7a] to-[#0f1b3b]">
        <!-- Grid pattern -->
        <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(rgba(0,206,209,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,206,209,0.15) 1px, transparent 1px); background-size: 48px 48px;"></div>
        <!-- Glow top-right -->
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20" style="background: radial-gradient(circle, #00CED1, transparent 70%);"></div>
        <!-- Glow bottom-left -->
        <div class="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-15" style="background: radial-gradient(circle, #FF7F00, transparent 70%);"></div>

        <div class="relative flex h-full flex-col items-center justify-center px-12 gap-10">
          <!-- Logo -->
          <div class="text-center">
            <div class="mx-auto mb-4 inline-flex items-center gap-3">
              <div class="grid h-14 w-14 place-items-center rounded-2xl border border-[#00CED1]/30" style="background: rgba(0,206,209,0.15); backdrop-filter: blur(8px);">
                <span class="text-[#00CED1] font-black text-lg">TB</span>
              </div>
              <span class="text-4xl font-extrabold tracking-tight">Ti<span class="text-[#00CED1]">Bi</span></span>
            </div>
            <p class="text-white/60 text-sm font-medium max-w-xs mx-auto leading-relaxed">
              Vos racines ont une langue.<br>Faites-la revivre.
            </p>
          </div>

          <!-- Floating language cards -->
          <div class="w-full max-w-xs space-y-3">
            <div v-for="lang in langs" :key="lang.name"
              class="flex items-center gap-4 rounded-2xl px-4 py-3 border border-white/10"
              style="background: rgba(255,255,255,0.06); backdrop-filter: blur(8px);"
            >
              <span class="text-2xl">{{ lang.flag }}</span>
              <div class="flex-1">
                <p class="text-sm font-semibold text-white">{{ lang.name }}</p>
                <div class="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full rounded-full bg-[#00CED1]" :style="{ width: lang.progress + '%' }"></div>
                </div>
              </div>
              <span class="text-xs text-white/40 font-medium">{{ lang.progress }}%</span>
            </div>
          </div>

          <!-- Tagline badge -->
          <div class="inline-flex items-center gap-2 rounded-full border border-[#00CED1]/30 px-4 py-2 text-xs text-[#00CED1] font-semibold" style="background: rgba(0,206,209,0.08);">
            <span class="w-2 h-2 rounded-full bg-[#00CED1] animate-pulse"></span>
            Plateforme d'apprentissage des langues
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isLoading, error } = storeToRefs(authStore);

const email = ref('');
const password = ref('');
const remember = ref(false);
const showPassword = ref(false);
const loginSuccess = ref('');

const langs = [
  { name: 'Mooré', flag: '🇲🇱', progress: 78 },
  { name: 'Dioula', flag: '🇸🇳', progress: 55 },
  { name: 'Fulfudé', flag: '🇳🇬', progress: 42 },
];

const onSubmit = async () => {
  const success = await authStore.login({
    loginInfo: email.value,
    password: password.value,
  },
  remember.value
);
 
 console.log(email.value, password.value);
  if (success) {
    
    loginSuccess.value = 'Connexion reussie';
    if (remember.value) {

    }
    setTimeout(() => {
      loginSuccess.value = '';
      navigateTo(authStore.dashboardRoute)
      // console.log(authStore.dashboardRoute) 
    }, 2000);
    
  }
};
</script>