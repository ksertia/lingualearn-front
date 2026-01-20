<template>
    <Dashboard />
</template>

<script setup>
import Dashboard from "~/components/Dashboard/Dashboard.vue";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "lms",
});
</script>