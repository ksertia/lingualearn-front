<template>
  <div class="h-screen w-full flex overflow-hidden">

    <!-- ══════════════ PANNEAU GAUCHE ══════════════ -->
    <section class="w-1/2 bg-tibi-dark flex flex-col justify-center items-center px-16 py-8 relative overflow-hidden">
      <div class="absolute inset-0 tribal-pattern-left pointer-events-none"></div>

      <div class="z-10 w-full max-w-sm">
        <h1 class="text-white text-4xl font-extrabold mb-3 tracking-tight">Connectez-vous</h1>
        <p class="text-white/90 text-base mb-7 leading-snug">
          Entrez votre email et mot de passe pour vous connecter!
        </p>

        <form class="space-y-4" @submit.prevent="onSubmit">

          <!-- Email -->
          <div class="space-y-2">
            <label class="text-white text-sm font-medium block" for="email">
              Email<span class="text-red-400">*</span>
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="formateur@tibi.com"
              autocomplete="email"
              class="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
              required
            />
          </div>

          <!-- Mot de passe -->
          <div class="space-y-2">
            <label class="text-white text-sm font-medium block" for="password">
              Mot de passe<span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 pr-12"
                required
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Afficher/masquer le mot de passe"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Checkbox -->
          <div class="flex items-center space-x-3">
            <input
              id="remember"
              v-model="remember"
              type="checkbox"
              class="w-5 h-5 rounded border-white bg-transparent text-green-600 focus:ring-green-500"
            />
            <label class="text-white text-sm" for="remember">se souvenir de moi</label>
          </div>

          <!-- Messages -->
          <div v-if="error" class="text-red-300 text-sm bg-red-900/20 px-3 py-2 rounded-lg" aria-live="polite">
            {{ error }}
          </div>
          <div v-if="loginSuccess" class="text-green-300 text-sm bg-green-900/20 px-3 py-2 rounded-lg" aria-live="polite">
            {{ loginSuccess }}
          </div>

          <!-- Bouton -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 bg-[#1A8E35] hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg rounded-full transition-colors duration-200"
            >
              {{ isLoading ? 'Connexion…' : 'Se connecter' }}
            </button>
          </div>

        </form>
      </div>
    </section>

    <!-- ══════════════ PANNEAU DROIT ══════════════ -->
    <section class="w-1/2 bg-tibi-gradient flex flex-col items-center justify-between py-8 px-10 relative overflow-hidden">
      <div class="absolute inset-0 tribal-pattern-right pointer-events-none"></div>

      <div class="z-10 flex flex-col items-center text-center w-full">

        <!-- Logo -->
        <div class="mb-4">
          <img src="assets/icons/tibi-logo-final.png" alt="TiBi" class="w-20 h-20 object-contain" />
        </div>

        <!-- Slogan -->
        <h2 class="text-[#10421A] text-xl font-extrabold max-w-xs mb-4 leading-snug">
          Vos racines ont une langue.<br/>Faites-la revivre.
        </h2>

        <!-- Cartes langues -->
        <div class="w-full max-w-[380px] space-y-3">
          <div
            v-for="lang in langs"
            :key="lang.code"
            class="bg-white rounded-2xl p-4 shadow-sm flex items-center space-x-4"
          >
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0"
              :style="{ backgroundColor: lang.badgeBg, color: lang.badgeText }"
            >
              {{ lang.code }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-[#10421A] text-base">{{ lang.name }}</span>
                <span class="text-sm font-medium text-gray-500 ml-2">{{ lang.pct }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full"
                  :style="{ width: lang.pct + '%', backgroundColor: lang.barColor }"
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Badge bas -->
      <div class="z-10 mt-8">
        <div class="bg-[#10421A] text-white text-xs px-6 py-2 rounded-full font-medium tracking-wide">
          Plateforme d'apprentissage des langues
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)

const email        = ref('')
const password     = ref('')
const remember     = ref(false)
const showPassword = ref(false)
const loginSuccess = ref('')

const langs = [
  { name: 'Mooré',   code: 'ML', pct: 78, badgeBg: '#F9C324', badgeText: '#10421A', barColor: '#F9C324' },
  { name: 'Dioula',  code: 'SN', pct: 55, badgeBg: '#F97316', badgeText: '#ffffff', barColor: '#F97316' },
  { name: 'Fulfudé', code: 'NG', pct: 42, badgeBg: '#F9C324', badgeText: '#10421A', barColor: '#F9C324' },
]

const onSubmit = async () => {
  const ok = await authStore.login(
    { loginInfo: email.value, password: password.value },
    remember.value
  )
  if (ok) {
    loginSuccess.value = 'Connexion reussie'
    setTimeout(() => {
      loginSuccess.value = ''
      navigateTo(authStore.dashboardRoute)
    }, 2000)
  }
}
</script>

<style>
.bg-tibi-dark {
  background-color: #10421A;
  position: relative;
  overflow: hidden;
}

.tribal-pattern-left {
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L40 0 L60 20 Z M80 20 L100 0 L120 20 Z M0 60 L20 40 L40 60 M60 60 L80 40 L100 60 M20 100 L40 80 L60 100 M80 100 L100 80 L120 100' fill='none' stroke='%23ffffff15' stroke-width='2'/%3E%3Ccircle cx='30' cy='30' r='4' fill='%23ffffff15'/%3E%3Ccircle cx='90' cy='30' r='4' fill='%23ffffff15'/%3E%3C/svg%3E");
  opacity: 0.15;
  background-size: 200px 200px;
}

.bg-tibi-gradient {
  background: linear-gradient(135deg, #FFC933 0%, #FFFFFF 40%, #A2D6B2 100%);
}

.tribal-pattern-right {
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L40 0 L60 20 Z M80 20 L100 0 L120 20 Z M0 60 L20 40 L40 60 M60 60 L80 40 L100 60' fill='none' stroke='%2310421A10' stroke-width='2'/%3E%3Ccircle cx='30' cy='30' r='4' fill='%2310421A10'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.4;
}
</style>
