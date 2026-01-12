<!-- <template>
    <Header />
  <div>
    <h1>A mettre en place</h1>
  </div>
</template> -->

<template>
  <!-- <Header /> -->
  <div>
    <HeroSection />
    <LanguagesSection />
    <HowItWorks />
    <AppPreview />
    <AudienceSection />
    <ImpactSection />
    <FinalCTA />
    
  </div>
  <TheFooter />
</template>

<script setup>
import Header from "~/components/Header/index.vue";
import HeroSection from "~/components/landing/HeroSection.vue";
import LanguagesSection from "~/components/landing/LanguagesSection.vue";
import HowItWorks from "~/components/landing/HowItWorks.vue";
import AppPreview from "~/components/landing/AppPreview.vue";
import AudienceSection from "~/components/landing/AudienceSection.vue";
import ImpactSection from "~/components/landing/ImpactSection.vue";
import FinalCTA from "~/components/landing/FinalCTA.vue";
import TheFooter from "~/components/Footer/TheFooter.vue";
</script>

<style>

</style>