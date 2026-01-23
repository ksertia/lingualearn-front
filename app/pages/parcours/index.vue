<template>
    <div>
        <Parcours />
    </div>
</template>

<script setup>
import Parcours from '~/components/parcours/index.vue';
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "lms",
});

defineProps({
    id: Number,
    name: String,
    description: String,
    status: String,
})
</script>
