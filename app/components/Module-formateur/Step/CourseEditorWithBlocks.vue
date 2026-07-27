<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Titre du cours -->
      <div class="md:col-span-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Titre du cours *</label>
        <input
          v-model="local.title"
          type="text"
          placeholder="Titre du cours"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
        />
      </div>

      <!-- Résumé -->
      <div class="md:col-span-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Résumé (optionnel)</label>
        <textarea
          v-model="local.summary"
          rows="2"
          placeholder="Résumé court du cours"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        ></textarea>
      </div>

      <!-- Actif -->
      <label class="flex items-center gap-3 cursor-pointer">
        <input v-model="local.isActive" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
        <span class="text-sm font-semibold text-slate-600">Actif</span>
      </label>
    </div>

    <!-- Gestionnaire de blocs -->
    <div class="border-t pt-6">
      <h3 class="text-sm font-bold text-slate-700 mb-4">Blocs de contenu</h3>
      <CourseBlockManager v-model="local.blocks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import CourseBlockManager from "./CourseBlockManager.vue"
import type { LessonBlock, LessonSectionType, LessonContentType } from "~/types/learning"

interface CourseFormWithBlocks {
  title: string
  summary?: string | null
  isActive: boolean
  blocks: BlockForm[]
}

interface BlockForm extends Partial<LessonBlock> {
  tempId: string
  isDirty?: boolean
}

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(["update:modelValue"])

const normalize = (value: any): CourseFormWithBlocks => {
  const v = value && typeof value === "object" ? value : {}

  const blocks = Array.isArray(v.blocks)
    ? v.blocks.map((b: any, i: number) => ({
        ...b,
        tempId: b.tempId || `block-${Date.now()}-${i}`,
        sectionType: (b.sectionType || "main") as LessonSectionType,
        contentType: (b.contentType || "text") as LessonContentType,
        content: typeof b.content === "string" ? b.content : "",
        caption: b.caption ?? null,
        index: i,
      }))
    : []

  return {
    title: typeof v.title === "string" ? v.title : "",
    summary: v.summary ?? null,
    isActive: typeof v.isActive === "boolean" ? v.isActive : true,
    blocks,
  }
}

const local = ref<CourseFormWithBlocks>(normalize(props.modelValue))
const syncingFromParent = ref(false)

watch(
  () => props.modelValue,
  (value) => {
    syncingFromParent.value = true
    local.value = normalize(value)
    queueMicrotask(() => {
      syncingFromParent.value = false
    })
  },
  { deep: true }
)

watch(
  local,
  (value) => {
    if (syncingFromParent.value) return
    emit("update:modelValue", value)
  },
  { deep: true }
)
</script>
