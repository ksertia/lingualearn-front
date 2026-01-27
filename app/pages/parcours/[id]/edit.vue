<template>
    <formComponent :id="id" />
</template>

<script setup lang="ts">
import formComponent from '~/components/parcours/formComponent.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string

definePageMeta({
    layout: 'lms'
})
</script>
