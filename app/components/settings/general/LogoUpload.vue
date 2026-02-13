<script setup lang="ts">
import { ref } from 'vue'

// Logo actuel (simulé)
const currentLogo = ref<string | null>(null)
const previewLogo = ref<string | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const showSuccess = ref(false)
const dragOver = ref(false)

// Gérer le drag & drop
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      handleFile(file)
    }
  }
}

// Gérer la sélection de fichier
const handleFileInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      handleFile(file)
    }
  }
}

const handleFile = (file: File) => {
  // Valider le type de fichier
  const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('Veuillez sélectionner un fichier image (JPEG, PNG, SVG ou WebP)')
    return
  }

  // Valider la taille (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('La taille du fichier ne doit pas dépasser 2MB')
    return
  }

  // Créer un aperçu
  const reader = new FileReader()
  reader.onload = (e) => {
    previewLogo.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// Sauvegarder le logo
const saveLogo = async () => {
  if (!previewLogo.value) return
  
  isSaving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  currentLogo.value = previewLogo.value
  previewLogo.value = null
  
  isSaving.value = false
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

// Annuler la sélection
const cancelUpload = () => {
  previewLogo.value = null
}

// Supprimer le logo
const removeLogo = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer le logo ?')) return
  
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  currentLogo.value = null
  isLoading.value = false
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-orange-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="20" y="4" width="16" height="16" rx="2" />
          <rect x="36" y="4" width="16" height="16" rx="2" />
          <rect x="4" y="20" width="16" height="16" rx="2" />
          <rect x="20" y="20" width="16" height="16" rx="2" />
          <rect x="36" y="20" width="16" height="16" rx="2" />
          <rect x="4" y="36" width="16" height="16" rx="2" />
          <rect x="20" y="36" width="16" height="16" rx="2" />
          <rect x="36" y="36" width="16" height="16" rx="2" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Logo de la plateforme</h2>
        <p class="text-sm text-slate-500">Téléchargez le logo de votre plateforme</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-[#000099] rounded-full animate-spin"></div>
    </div>

    <div v-else class="space-y-6">
      <!-- Zone d'aperçu actuel -->
      <div v-if="currentLogo && !previewLogo" class="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
        <div class="w-32 h-32 flex items-center justify-center bg-white rounded-xl shadow-sm p-4">
          <img :src="currentLogo" alt="Logo actuel" class="max-w-full max-h-full object-contain" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-slate-900 mb-1">Logo actuel</h3>
          <p class="text-sm text-slate-500 mb-4">Votre logo actuel s'affiche dans la barre de navigation et les emails.</p>
          <button
            @click="removeLogo"
            class="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition"
          >
            Supprimer le logo
          </button>
        </div>
      </div>

      <!-- Zone de prévisualisation -->
      <div v-if="previewLogo" class="flex items-center gap-6 p-6 bg-[#00ced1]/5 rounded-xl border-2 border-[#00ced1]/30">
        <div class="w-32 h-32 flex items-center justify-center bg-white rounded-xl shadow-sm p-4">
          <img :src="previewLogo" alt="Nouveau logo" class="max-w-full max-h-full object-contain" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-slate-900 mb-1">Aperçu du nouveau logo</h3>
          <p class="text-sm text-slate-500 mb-4">Vérifiez l'aperçu avant d'enregistrer.</p>
          <div class="flex gap-2">
            <button
              @click="saveLogo"
              :disabled="isSaving"
              class="px-4 py-2 text-sm font-medium bg-[#000099] text-white rounded-lg hover:bg-[#000066] transition disabled:opacity-50"
            >
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button
              @click="cancelUpload"
              class="px-4 py-2 text-sm font-medium text-slate-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <!-- Zone de dépôt -->
      <div v-if="!previewLogo">
        <div
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          class="border-2 border-dashed rounded-xl p-8 text-center transition"
          :class="dragOver 
            ? 'border-[#00ced1] bg-[#00ced1]/5' 
            : 'border-gray-200 hover:border-[#00ced1] hover:bg-gray-50'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-slate-400 mb-4" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p class="text-slate-600 mb-2">
            <label for="logo-upload" class="cursor-pointer text-[#000099] hover:underline font-medium">
              Cliquez pour télécharger
            </label>
            ou glissez-déposez
          </p>
          <p class="text-sm text-slate-400">JPEG, PNG, SVG ou WebP (max. 2MB)</p>
          <input
            id="logo-upload"
            type="file"
            accept="image/jpeg,image/png,image/svg+xml,image/webp"
            class="hidden"
            @change="handleFileInput"
          />
        </div>
      </div>

      <!-- Message de succès -->
      <div v-if="showSuccess" class="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
          <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
        </svg>
        Logo enregistré avec succès
      </div>
    </div>
  </div>
</template>

