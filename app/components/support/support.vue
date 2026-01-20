<template>
  <div class="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#1a2849] py-12">
    <div class="mx-auto max-w-4xl px-6">
      <h1 class="mb-8 text-4xl font-bold text-white">Centre d'Aide</h1>

      <div class="space-y-6 text-white/80">
        <section>
          <h2 class="mb-4 text-2xl font-semibold text-white">
            Questions Fréquemment Posées
          </h2>

          <div class="space-y-4">
            <div class="rounded-lg bg-white/5 p-4">
              <h3 class="mb-2 font-semibold text-white">
                Comment commencer mon apprentissage ?
              </h3>
              <p>
                Créez un compte et choisissez la langue que vous souhaitez
                apprendre.
              </p>
            </div>

            <div class="rounded-lg bg-white/5 p-4">
              <h3 class="mb-2 font-semibold text-white">
                Y a-t-il une période d'essai gratuit ?
              </h3>
              <p>
                Oui, vous pouvez essayer LinguaLearn gratuitement pendant 7
                jours.
              </p>
            </div>

            <div class="rounded-lg bg-white/5 p-4">
              <h3 class="mb-2 font-semibold text-white">
                Comment puis-je obtenir de l'aide ?
              </h3>
              <p>
                Contactez notre équipe d'assistance à support@lingualearn.com
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 text-2xl font-semibold text-white">Nous Contacter</h2>
          <div class="space-y-2">
            <p><strong>Email :</strong> support@lingualearn.com</p>
            <p><strong>Horaires :</strong> Lun - Ven, 9h - 18h (CET)</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});
</script>
