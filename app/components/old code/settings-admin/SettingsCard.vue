<template>
  <NuxtLink
    :to="to"
    class="rounded-lg border border-gray-700 bg-[#1a2849] p-6 hover:border-cyan-500/50 transition-all group"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-400">{{ title }}</p>
        <p class="mt-2 text-lg font-bold text-white">{{ icon }}</p>
        <p class="mt-1 text-xs text-gray-500">{{ description }}</p>
      </div>
      <div :class="`rounded-full p-3 ${colorBg}`">
        <span :class="`text-xl ${colorText}`">→</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: string;
  to: string;
  color?:
    | "cyan"
    | "orange"
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "pink"
    | "purple"
    | "teal"
    | "indigo"
    | "slate";
}

const props = withDefaults(defineProps<Props>(), {
  color: "cyan",
});

const colorMap = {
  cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  orange: { bg: "bg-orange-500/20", text: "text-orange-400" },
  blue: { bg: "bg-blue-500/20", text: "text-blue-400" },
  red: { bg: "bg-red-500/20", text: "text-red-400" },
  green: { bg: "bg-green-500/20", text: "text-green-400" },
  yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  pink: { bg: "bg-pink-500/20", text: "text-pink-400" },
  purple: { bg: "bg-purple-500/20", text: "text-purple-400" },
  teal: { bg: "bg-teal-500/20", text: "text-teal-400" },
  indigo: { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  slate: { bg: "bg-slate-500/20", text: "text-slate-400" },
};

const colorBg = colorMap[props.color].bg;
const colorText = colorMap[props.color].text;
</script>
