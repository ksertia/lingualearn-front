<template>
  <div class="min-h-screen bg-[#0B1220] text-white">
    <div class="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
      <div class="px-6 py-10 lg:px-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <span aria-hidden="true">←</span>
          <span>Accueil</span>
        </NuxtLink>

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
              <span>Sign in with Google</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M18.244 2H21l-6.52 7.46L22.5 22h-6.59l-5.16-6.76L4.8 22H2l7.03-8.05L1.5 2h6.76l4.66 6.11L18.244 2Zm-1.16 18h1.83L7.3 3.93H5.33L17.084 20Z"/>
              </svg>
              <span>Sign in with X</span>
            </button>
          </div> -->

          <!-- <div class="my-8 flex items-center gap-4">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-xs text-white/50">Or</span>
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
                class="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#2D5BFF] focus:ring-2 focus:ring-[#2D5BFF]/30"
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
                  class="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#2D5BFF] focus:ring-2 focus:ring-[#2D5BFF]/30"
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
                  class="h-4 w-4 rounded border-white/20 bg-white/10 text-[#2D5BFF] focus:ring-[#2D5BFF]/40"
                />
                <span>se souvenir de moi</span>
              </label>

              <NuxtLink to="/" class="text-sm text-[#2D5BFF] hover:underline">Mot de passe oublié?</NuxtLink>
            </div>

            <button
              type="submit"
              class="w-full rounded-md bg-[#2D5BFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2D5BFF]/90"
            >
              Sign In
            </button>

            <p class="text-sm text-white/60">
              vous n'avez pas de compte?
              <NuxtLink to="/signup" class="text-[#2D5BFF] hover:underline">Inscrivez-vous</NuxtLink>
            </p>
          </form>
        </div>
      </div>

      <div class="relative hidden overflow-hidden lg:block">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,91,255,0.35),transparent_55%)]"></div>
        <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 64px 64px;"></div>
        <div class="relative flex h-full items-center justify-center px-10">
          <div class="text-center">
            <div class="mx-auto mb-6 inline-flex items-center gap-4">
              <div class="grid h-12 w-12 place-items-center rounded-xl bg-[#2D5BFF]/20">
                <div class="h-6 w-6 rounded bg-[#2D5BFF]"></div>
              </div>
              <div class="text-3xl font-semibold">LinguaLearn</div>
            </div>
            <p class="mx-auto max-w-sm text-sm text-white/70">
              Replongez dans vos origines linguistiques avec nous
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");
const remember = ref(false);
const showPassword = ref(false);

const onSubmit = () => {
  console.log("sign-in", { email: email.value, remember: remember.value });
};
</script>