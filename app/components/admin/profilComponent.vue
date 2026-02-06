<template>
  <div class="space-y-6 max-w-2xl mx-auto mt-6">

    <h1 class="text-2xl font-bold text-[rgb(0,0,153)]">Profil Administrateur</h1>

    <div class="bg-white shadow rounded-lg p-6 space-y-6">

      <div class="flex items-center gap-6">
        <div class="relative w-24 h-24">
          <img
            :src="authStore.user?.profile?.avatarUrl || defaultAvatar"
            alt="Photo de profil"
            class="w-24 h-24 rounded-full object-cover border-2 border-[rgb(0,206,209)]"
          />
        </div>
        <!-- <div>
          <p class="text-gray-700 font-medium">Cliquez sur la photo pour changer</p>
        </div> -->
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-600 font-medium mb-1">Prénom</label>
          <input type="text" :value="profile?.firstName??''" readonly 
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,206,209)]"/>
        </div>
        <div>
          <label class="block text-gray-600 font-medium mb-1">Nom</label>
          <input type="text" :value="profile?.lastName??''" readonly  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,206,209)]"/>
        </div>
        <div>
          <label class="block text-gray-600 font-medium mb-1">Email</label>
          <input type="email" :value="authStore.user?.email" readonly  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(0,206,209)]"/>
        </div>
      </div>

      <div>
        <label class="block text-gray-600 font-medium mb-1">Rôle</label>
        <input type="text" :value="authStore.user?.accountType" readonly  disabled class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700"/>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/authStore';


const defaultAvatar = '/default-avatar.png' 
const authStore = useAuthStore()
const profile = computed(() => authStore.user?.profile)

// const token = useCookie('token')

onMounted(async () => {
 if(!authStore.user){
  await authStore.initAuth()
 }
})

</script>
