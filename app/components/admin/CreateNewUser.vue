<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#00ced1]/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#000099]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-[#000099]">Créer un utilisateur</h2>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-2 gap-4">

        <!-- Prénom -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">Prénom</label>
          <input
            v-model="form.prenom"
            placeholder="Jean"
            class="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition-all"
            :class="errors.prenom ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1]'"
          />
          <p v-if="errors.prenom" class="text-red-500 text-xs">{{ errors.prenom }}</p>
        </div>

        <!-- Nom -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">Nom</label>
          <input
            v-model="form.nom"
            placeholder="Dupont"
            class="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition-all"
            :class="errors.nom ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1]'"
          />
          <p v-if="errors.nom" class="text-red-500 text-xs">{{ errors.nom }}</p>
        </div>

        <!-- Email -->
        <div class="col-span-2 space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              v-model="form.email"
              placeholder="exemple@mail.com"
              class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition-all"
              :class="errors.email ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1]'"
            />
          </div>
          <p v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</p>
        </div>

        <!-- Téléphone -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">Téléphone</label>
          <input
            v-model="form.phone"
            placeholder="+226 00000000"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1]"
          />
        </div>

        <!-- Rôle -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">Rôle</label>
          <div class="relative">
            <select
              v-model="form.accountType"
              class="w-full appearance-none px-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1]"
            >
              <option value="admin">Administrateur</option>
              <option value="plateform_manager">Gestionnaire</option>
              <option value="teacher">Formateur</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Mot de passe -->
        <div class="col-span-2 space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-500">Mot de passe</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition-all"
              :class="errors.password ? 'border-red-400 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:ring-4 focus:ring-[#00ced1]/20 focus:border-[#00ced1]'"
            />
          </div>
          <p v-if="errors.password" class="text-red-500 text-xs">{{ errors.password }}</p>
        </div>

      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-all"
        >
          Annuler
        </button>
        <button
          @click="submit"
          class="px-5 py-2.5 rounded-xl bg-[#00ced1] text-[#000099] text-sm font-bold shadow-lg shadow-[#00ced1]/20 hover:shadow-[#00ced1]/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          Créer l'utilisateur
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/userStore'
import type { AccountType } from '~/types/user'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const userStore = useUserStore()

const form = ref({
  prenom: '',
  nom: '',
  email: '',
  password: '',
  phone: '',
  accountType: 'teacher'
})

const errors = ref({
  prenom: '',
  nom: '',
  email: '',
  password: '',
  phone: ''
})

const validateForm = () => {
  errors.value = { prenom: '', nom: '', email: '', password: '', phone: '' }
  let isValid = true

  if (!form.value.prenom.trim()) {
    errors.value.prenom = 'Le prénom est requis'
    isValid = false
  }

  if (!form.value.nom.trim()) {
    errors.value.nom = 'Le nom est requis'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = "L'email est requis"
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Email invalide'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Le mot de passe est requis'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères'
    isValid = false
  } else if (!/[a-zA-Z]/.test(form.value.password)) {
    errors.value.password = 'Le mot de passe doit contenir au moins une lettre'
    isValid = false
  }

  return isValid
}

const submit = async () => {
  if (!validateForm()) return

  await userStore.createUser({
    firstName: form.value.prenom,
    lastName: form.value.nom,
    email: form.value.email,
    password: form.value.password,
    accountType: form.value.accountType as AccountType,
  })

  if (!userStore.error) {
    form.value = {
      prenom: '',
      nom: '',
      email: '',
      password: '',
      phone: '',
      accountType: 'teacher'
    }
    emit('close')
  }
}
</script>
