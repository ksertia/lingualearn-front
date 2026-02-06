<template>
  <ProfilComponent/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProfilComponent from '~/components/admin/profilComponent.vue'

// Layout admin
definePageMeta({ layout: 'admin' })

</script>
