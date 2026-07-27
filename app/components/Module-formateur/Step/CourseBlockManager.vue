<template>
  <div class="course-block-manager">
    <div class="blocks-list">
      <div v-if="blocks.length === 0" class="empty-state">
        <p>Aucun bloc. Ajoute le premier bloc pour commencer.</p>
      </div>

      <div v-else class="blocks-draggable">
        <div
          v-for="(block, index) in blocks"
          :key="block.tempId"
          class="block-card"
          draggable="true"
          @dragstart="onDragStart($event, index)"
          @dragover.prevent="onDragOver($event, index)"
          @drop="onDrop($event, index)"
          @dragend="onDragEnd"
        >
          <div class="block-header">
            <span class="block-index" :title="`Position ${index + 1}`">{{ index + 1 }}</span>
            <select
              v-model="block.sectionType"
              class="block-section"
              @change="markBlockDirty(block)"
            >
              <option value="introduction">Introduction</option>
              <option value="main">Contenu principal</option>
              <option value="transcript">Transcription</option>
              <option value="example">Exemple</option>
              <option value="example_audio">Exemple audio</option>
              <option value="key_points">Points clés</option>
            </select>
            <select
              v-model="block.contentType"
              class="block-content"
              @change="markBlockDirty(block); activeBlockIndex = index"
            >
              <option value="text">Texte</option>
              <option value="video">Vidéo</option>
              <option value="audio">Audio</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
            </select>
            <button
              class="btn-remove"
              @click="removeBlock(index)"
              title="Supprimer ce bloc"
            >
              ✕
            </button>
          </div>

          <div class="block-content-input">
            <template v-if="block.contentType === 'text'">
              <textarea
                v-model="block.content"
                placeholder="Contenu texte..."
                class="content-area"
                @input="markBlockDirty(block)"
              ></textarea>
            </template>
            <template v-else>
              <div class="media-upload-section">
                <div class="media-input-group">
                  <input
                    v-model="block.content"
                    type="text"
                    placeholder="URL du fichier ou uploadez un fichier"
                    class="content-input"
                    @input="markBlockDirty(block)"
                  />
                  <button
                    class="btn-upload"
                    @click="triggerFileInput(index)"
                    :title="`Uploader un fichier ${block.contentType}`"
                  >
                    📁 Upload
                  </button>
                </div>
                <p class="upload-hint">
                  Collez une URL ou cliquez sur Upload pour sélectionner un fichier
                </p>
              </div>
            </template>

            <input
              v-model="block.caption"
              type="text"
              placeholder="Légende (optionnel)"
              class="caption-input"
              @input="markBlockDirty(block)"
            />
          </div>

          <!-- Upload progress for this block -->
          <div v-if="activeBlockIndex === index && (isUploading || uploadError || uploadSuccess)" class="upload-status">
            <div v-if="isUploading" class="status-message loading">
              ⏳ Upload en cours...
            </div>
            <div v-else-if="uploadError" class="status-message error">
              ❌ {{ uploadError }}
            </div>
            <div v-else-if="uploadSuccess" class="status-message success">
              ✅ Fichier uploadé avec succès
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="btn-add-block" @click="addBlock">
      + Ajouter un bloc
    </button>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="uploadAccept"
      @change="handleFileSelect"
      class="hidden-file-input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiService } from '~/services/api'
import type { LessonBlock, LessonSectionType, LessonContentType } from '~/types/learning'

interface BlockForm extends Partial<LessonBlock> {
  tempId: string
  isDirty?: boolean
}

interface Props {
  modelValue: BlockForm[]
}

interface Emits {
  (e: 'update:modelValue', value: BlockForm[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const blocks = ref<BlockForm[]>(props.modelValue || [])
const draggedFromIndex = ref<number | null>(null)
const activeBlockIndex = ref<number | null>(null)

// Upload state
const api = useApiService()
const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)
const uploadSuccess = ref(false)

const uploadAccept = computed(() => {
  if (activeBlockIndex.value === null) return '*/*'
  const block = blocks.value[activeBlockIndex.value]
  switch (block?.contentType) {
    case 'video':
      return 'video/*'
    case 'audio':
      return 'audio/*,.mp4,.m4a'
    case 'pdf':
      return 'application/pdf'
    case 'image':
      return 'image/*'
    default:
      return '*/*'
  }
})

type UploadKind = 'image' | 'video' | 'audio' | 'pdf' | 'content'

const uploadKind = computed<UploadKind>(() => {
  if (activeBlockIndex.value === null) return 'content'
  const block = blocks.value[activeBlockIndex.value]
  return (
    block?.contentType === 'text'
      ? 'content'
      : (block?.contentType as UploadKind)
  ) || 'content'
})

const extractUploadUrl = (payload: any): string | null => {
  if (!payload) return null
  if (typeof payload === 'string') return payload
  const candidates = [
    payload.data?.url,
    payload.url,
    payload.fileUrl,
    payload.location,
    payload.path,
    payload.data?.fileUrl,
    payload.data?.location,
    payload.data?.path,
    payload.data?.data?.url,
  ]
  return candidates.find((value) => typeof value === 'string' && value.trim()) || null
}

const getApiOrigin = () => {
  const config = useRuntimeConfig()
  if (config.public.apiBase) {
    try {
      return new URL(config.public.apiBase).origin
    } catch (err) {
      return ''
    }
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

const normalizeUploadUrl = (value: string) => {
  const trimmed = value?.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return encodeURI(trimmed)
  const origin = getApiOrigin()
  if (!origin) return encodeURI(trimmed)
  if (trimmed.startsWith('/')) {
    return encodeURI(`${origin}${trimmed}`)
  }
  return encodeURI(`${origin}/${trimmed}`)
}

const addBlock = () => {
  const newBlock: BlockForm = {
    tempId: `block-${Date.now()}-${Math.random()}`,
    sectionType: 'main' as LessonSectionType,
    contentType: 'text' as LessonContentType,
    content: '',
    caption: null,
    index: blocks.value.length,
    isDirty: true,
  }
  blocks.value.push(newBlock)
  updateModel()
}

const removeBlock = (index: number) => {
  blocks.value.splice(index, 1)
  // Recalculer tous les indices
  blocks.value.forEach((b, i) => {
    b.index = i
  })
  updateModel()
}

const markBlockDirty = (block: BlockForm) => {
  block.isDirty = true
  updateModel()
}

const onDragStart = (event: DragEvent, index: number) => {
  draggedFromIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', (event.target as Element).innerHTML)
  }
}

const onDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event: DragEvent, toIndex: number) => {
  event.preventDefault()
  const fromIndex = draggedFromIndex.value

  if (fromIndex !== null && fromIndex !== toIndex) {
    const item = blocks.value[fromIndex]
    blocks.value.splice(fromIndex, 1)
    blocks.value.splice(toIndex, 0, item)
    // Recalculer tous les indices
    blocks.value.forEach((b, i) => {
      b.index = i
    })
    updateModel()
  }
  draggedFromIndex.value = null
}

const onDragEnd = () => {
  draggedFromIndex.value = null
}

const triggerFileInput = (index: number) => {
  activeBlockIndex.value = index
  fileInputRef.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || activeBlockIndex.value === null) return

  const block = blocks.value[activeBlockIndex.value]
  if (!block) return

  // Validate file type
  if (block.contentType === 'audio' && file.type.startsWith('video/')) {
    uploadError.value = 'Le fichier sélectionné est une vidéo ; choisissez un fichier audio.'
    return
  }
  if (block.contentType === 'video' && !file.type.startsWith('video/')) {
    uploadError.value = 'Le fichier sélectionné n\'est pas une vidéo valide.'
    return
  }
  if (block.contentType === 'image' && !file.type.startsWith('image/')) {
    uploadError.value = 'Le fichier sélectionné n\'est pas une image valide.'
    return
  }
  if (block.contentType === 'pdf' && file.type !== 'application/pdf') {
    uploadError.value = 'Le fichier sélectionné n\'est pas un PDF.'
    return
  }

  // Upload
  isUploading.value = true
  uploadError.value = null
  uploadSuccess.value = false

  try {
    const response = await api.uploadMedia(uploadKind.value, file)
    const url = extractUploadUrl(response)

    if (!url) {
      throw new Error('URL manquante dans la réponse d\'upload.')
    }

    block.content = normalizeUploadUrl(url)
    markBlockDirty(block)

    uploadSuccess.value = true
    setTimeout(() => {
      uploadSuccess.value = false
      uploadError.value = null
      isUploading.value = false
    }, 2000)
  } catch (err) {
    console.error('Upload bloc échoué:', err)
    uploadError.value = 'Échec de l\'upload du fichier.'
    isUploading.value = false
  }

  input.value = ''
}

const updateModel = () => {
  emit('update:modelValue', blocks.value)
}
</script>

<style scoped>
.course-block-manager {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.blocks-list {
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: #999;
  font-style: italic;
}

.blocks-draggable {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.block-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  cursor: move;
  transition: all 0.2s;
}

.block-card:hover {
  border-color: #4caf50;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

.block-card[draggable='true']:active {
  opacity: 0.7;
  background: #f5f5f5;
}

.block-header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.block-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: #666;
  flex-shrink: 0;
}

.block-section,
.block-content {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.btn-remove {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #d32f2f;
  font-weight: bold;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #ffebee;
  border-color: #d32f2f;
}

.block-content-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.content-area {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  resize: vertical;
}

.media-upload-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.media-input-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

.content-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.btn-upload {
  padding: 8px 12px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  flex-shrink: 0;
}

.btn-upload:hover {
  background: #1976d2;
}

.btn-upload:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.caption-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.upload-status {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
}

.status-message {
  padding: 8px;
  border-radius: 4px;
  font-weight: 500;
}

.status-message.loading {
  background: #e3f2fd;
  color: #1976d2;
}

.status-message.success {
  background: #e8f5e9;
  color: #388e3c;
}

.status-message.error {
  background: #ffebee;
  color: #d32f2f;
}

.hidden-file-input {
  display: none;
}

.btn-add-block {
  width: 100%;
  padding: 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add-block:hover {
  background: #45a049;
}
</style>
