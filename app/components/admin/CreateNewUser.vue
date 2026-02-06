<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 class="text-xl font-bold mb-4 text-[rgb(0,0,153)]">
        Créer un utilisateur
      </h2>

      <div class="space-y-3">
        <!-- Prénom -->
        <div>
          <label class="block text-sm font-medium mb-1">Prénom</label>
          <input
            v-model="form.prenom"
            placeholder="Ex: Jean"
            class="w-full border px-3 py-2 rounded"
            :class="{ 'border-red-500': errors.prenom }"
          />
          <p v-if="errors.prenom" class="text-red-500 text-sm mt-1">
            {{ errors.prenom }}
          </p>
        </div>

        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium mb-1">Nom</label>
          <input
            v-model="form.nom"
            placeholder="Ex: Dupont"
            class="w-full border px-3 py-2 rounded"
            :class="{ 'border-red-500': errors.nom }"
          />
          <p v-if="errors.nom" class="text-red-500 text-sm mt-1">
            {{ errors.nom }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            v-model="form.email"
            placeholder="exemple@mail.com"
            class="w-full border px-3 py-2 rounded"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Mot de passe -->
        <div>
          <label class="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••"
            class="w-full border px-3 py-2 rounded"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- Rôle -->
        <div>
          <label class="block text-sm font-medium mb-1">Rôle</label>
          <select
            v-model="form.role"
            class="w-full border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="plateform_manager">Plateform manager</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end mt-4 gap-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Annuler
        </button>

        <button
          @click="submit"
          class="px-4 py-2 bg-[rgb(0,206,209)] text-[rgb(0,0,153)] rounded hover:brightness-90"
        >
          Créer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', payload: any): void
}>()

const form = ref({
  prenom: '',
  nom: '',
  email: '',
  password: '',
  role: 'admin'
})

const errors = ref({
  prenom: '',
  nom: '',
  email: '',
  password: ''
})

const validateForm = () => {
  errors.value = { prenom: '', nom: '', email: '', password: '' }
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
  }

  return isValid
}

const submit = () => {
  if (!validateForm()) return

  const payload = {
    firstName: form.value.prenom,
    lastName: form.value.nom,
    email: form.value.email,
    password: form.value.password,
    accountType: form.value.role,
    // phone: null,
    // username: null,
    // parentId: null
  }

  console.log('Payload envoyé au backend :', payload)
  emit('create', payload)
}
</script>
