<template>
  <div class="space-y-6 max-w-2xl mx-auto mt-6">

    <h1 class="text-2xl font-bold text-[rgb(0,0,153)]">Profil Administrateur</h1>

    <div class="bg-white shadow rounded-lg p-6 space-y-6">

      <!-- Photo de profil -->
      <div class="flex items-center gap-6">
        <div class="relative w-24 h-24">
          <img
            :src="admin?.avatar || defaultAvatar"
            alt="Photo de profil"
            class="w-24 h-24 rounded-full object-cover border-2 border-[rgb(0,206,209)]"
          />
          <input
            type="file"
            @change="onFileChange"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
          />
        </div>
        <div>
          <p class="text-gray-700 font-medium">Cliquez sur la photo pour changer</p>
        </div>
      </div>

      <!-- Informations personnelles -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-600 font-medium mb-1">Prénom</label>
          <input type="text" v-model="admin.firstName" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,206,209)]"/>
        </div>
        <div>
          <label class="block text-gray-600 font-medium mb-1">Nom</label>
          <input type="text" v-model="admin.lastName" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,206,209)]"/>
        </div>
        <div>
          <label class="block text-gray-600 font-medium mb-1">Email</label>
          <input type="email" v-model="admin.email" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,206,209)]"/>
        </div>
        <div>
          <label class="block text-gray-600 font-medium mb-1">Téléphone</label>
          <input type="tel" v-model="admin.phone" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,206,209)]"/>
        </div>
      </div>

      <!-- Rôle -->
      <div>
        <label class="block text-gray-600 font-medium mb-1">Rôle</label>
        <input type="text" v-model="admin.role" disabled class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700"/>
      </div>

      <!-- Mot de passe -->
      <div>
        <label class="block text-gray-600 font-medium mb-1">Mot de passe</label>
        <input type="password" v-model="password" placeholder="********" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,206,209)]"/>
      </div>

      <!-- Boutons -->
      <div class="flex justify-end gap-3 pt-4">
        <button @click="logout" class="px-4 py-2 rounded bg-[rgb(255,127,0)] text-white font-semibold">Déconnexion</button>
        <button @click="updateProfile" class="px-4 py-2 rounded bg-[rgb(0,206,209)] text-[rgb(0,0,153)] font-semibold">Enregistrer</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Layout admin
definePageMeta({ layout: 'admin' })

// Avatar par défaut
const defaultAvatar = '/default-avatar.png' // placer dans /public/

// Données admin
const admin = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  avatar: ''
})
const password = ref('')

// Token JWT (tu peux le stocker après login)
const token = ref(localStorage.getItem('token') || '')

// Charger profil depuis API
onMounted(async () => {
  try {
    const res = await $fetch('http://213.32.120.11:4000/api/v1/users/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    admin.value = res
  } catch (err) {
    console.error('Erreur récupération profil:', err)
    alert('Impossible de charger le profil. Vérifie ton token.')
  }
})

// Changer avatar
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    admin.value.avatar = reader.result
  }
  reader.readAsDataURL(file)
}

// Mettre à jour profil
const updateProfile = async () => {
  try {
    const payload = { ...admin.value }
    if (password.value) payload.password = password.value
    const res = await $fetch('http://213.32.120.11:4000/api/v1/users/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: payload
    })
    alert('Profil mis à jour avec succès !')
  } catch (err) {
    console.error('Erreur mise à jour profil:', err)
    alert('Erreur lors de la mise à jour du profil.')
  }
}

// Déconnexion
const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/connexion'
}
</script>
