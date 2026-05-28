<template>
  <!-- NAVBAR -->
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2">
          <img src="/icons/tibi-logo-final.png" alt="TiBi logo" class="h-10 w-auto object-contain" />
        </div>
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#fonctionnalites" class="hover:text-tibi-green transition-colors duration-200">Fonctionnalités</a>
          <a href="#langues" class="hover:text-tibi-green transition-colors duration-200">Langues</a>
          <a href="#mobile" class="hover:text-tibi-green transition-colors duration-200">Application</a>
          <a href="#apprenants" class="hover:text-tibi-green transition-colors duration-200">Pour qui ?</a>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/connexion"
            class="hidden sm:inline-flex items-center px-4 py-2 rounded-lg border-2 border-tibi-gold text-tibi-green font-semibold text-sm hover:bg-tibi-gold hover:text-gray-900 transition-all duration-200"
            aria-label="Se connecter à TiBi"
          >
            Se connecter
          </NuxtLink>
          <a
            href="#demo"
            class="inline-flex items-center px-4 py-2 rounded-lg bg-tibi-green text-white font-semibold text-sm hover:bg-green-800 transition-all duration-200 shadow-sm"
          >
            Demander une démo
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36" style="background: linear-gradient(135deg, #1A7A1A 0%, #208020 55%, #e8f5e8 100%)">
    <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" style="background: rgba(240,180,41,0.18)"></div>
    <div class="absolute bottom-0 left-0 w-72 h-72 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" style="background: rgba(224,101,16,0.12)"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="grid lg:grid-cols-2 gap-14 items-center">
        <div class="animate-fade-in">
          <div class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border" style="background:rgba(255,255,255,0.10); color:#F0B429; border-color:rgba(240,180,41,0.40)">
            <span class="w-2 h-2 rounded-full animate-pulse" style="background:#F0B429"></span>
            Application d'apprentissage des langues africaines
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-white">
            Apprendre. Préserver.<br/>
            <span class="text-tibi-gold">Innover.</span>
          </h1>
          <p class="text-lg md:text-xl mb-3 font-semibold" style="color:rgba(255,255,255,0.90)">
            Mooré · Dioula · Fulfuldé · et bien d'autres
          </p>
          <p class="text-lg md:text-xl mb-8 leading-relaxed max-w-xl" style="color:rgba(255,255,255,0.80)">
            TiBi est l'application mobile qui rend l'apprentissage des langues africaines accessible, ludique et ancré dans la richesse culturelle de tout un continent.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#mobile" class="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-base text-white transition-all duration-200 shadow-lg hover:-translate-y-0.5" style="background:#E06510">
              Découvrir l'app
              <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <NuxtLink to="/connexion" class="inline-flex items-center justify-center px-7 py-4 rounded-xl border-2 font-bold text-base transition-all duration-200 hover:bg-white/10" style="border-color:#F0B429; color:#F0B429;">
              Se connecter
            </NuxtLink>
          </div>
          <div class="mt-10 flex flex-wrap gap-6 text-sm" style="color:rgba(255,255,255,0.58)">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-tibi-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Langues de l'Afrique entière
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-tibi-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Dès 500 FCFA/mois
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-tibi-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              IA intégrée (ZAKI)
            </div>
          </div>
        </div>

        <!-- Phone mockup hero -->
        <div class="hidden lg:flex justify-center items-center animate-slide-up">
          <div class="relative">
            <div class="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl w-60" style="aspect-ratio:9/19">
              <div class="w-full h-full rounded-[2rem] overflow-hidden bg-gray-800">
                <img :src="imgAccueil" alt="Écran Accueil TiBi" class="w-full h-full object-cover" />
              </div>
            </div>
            <!-- Badge trophy -->
            <div class="absolute -top-6 -right-10 bg-white rounded-xl shadow-lg p-2.5 w-44 border border-gray-100 rotate-2">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-tibi-gold" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-gray-800">Niveau atteint !</div>
                  <div class="text-xs text-gray-500">Module Mooré complété</div>
                </div>
              </div>
            </div>
            <!-- Badge AI -->
            <div class="absolute -bottom-6 -left-10 bg-white rounded-xl shadow-lg p-2.5 w-40 border border-gray-100 -rotate-2">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-tibi-green" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-gray-800">ZAKI</div>
                  <div class="text-xs text-gray-500">IA prête à aider</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TRUST BAND -->
  <section class="py-10 bg-gray-50 border-y border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Commençons avec les langues du Burkina Faso — et visons tout le continent africain</p>
      <div class="flex flex-wrap justify-center items-center gap-10 md:gap-20">
        <div v-for="lang in langBadges" :key="lang.name" class="flex flex-col items-center gap-1">
          <span class="text-2xl font-extrabold tracking-tight" :class="lang.colorClass">{{ lang.name }}</span>
          <span class="text-xs text-gray-400">{{ lang.family }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- LANGUES DISPONIBLES -->
  <section id="langues" class="py-20 md:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 reveal">
        <span class="inline-block bg-amber-50 text-tibi-gold text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">Langues</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Plusieurs langues, tout un continent</h2>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">TiBi commence avec les langues du Burkina Faso et a pour ambition de couvrir toutes les langues de l'Afrique — un patrimoine linguistique immense à préserver et transmettre.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(lang, i) in languages"
          :key="i"
          class="reveal rounded-2xl p-8 border-2 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
          :class="lang.cardClass"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" :class="lang.iconBgClass">
            <svg class="w-6 h-6" :class="lang.iconClass" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="lang.iconPath"/>
            </svg>
          </div>
          <div class="text-xs font-bold uppercase tracking-widest mb-2" :class="lang.badgeClass">{{ lang.code }}</div>
          <h3 class="text-2xl font-extrabold text-gray-900 mb-2">{{ lang.name }}</h3>
          <p class="text-sm font-semibold mb-3" :class="lang.speakersClass">{{ lang.speakers }}</p>
          <p class="text-gray-500 text-sm leading-relaxed">{{ lang.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- MOBILE APP -->
  <section id="mobile" class="py-20 md:py-28 bg-tibi-green relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[450px] h-[450px] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" style="background:rgba(240,180,41,0.18)"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" style="background:rgba(224,101,16,0.15)"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="text-center mb-16 reveal">
        <span class="inline-block text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 border" style="background:rgba(255,255,255,0.10); color:#F0B429; border-color:rgba(240,180,41,0.40)">
          Application Mobile
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-4">L'expérience TiBi dans votre poche</h2>
        <p class="text-lg max-w-2xl mx-auto" style="color:rgba(255,255,255,0.78)">
          Une application mobile conçue pour rendre l'apprentissage des langues africaines accessible, interactif et ancré dans la culture burkinabè.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-16 items-center mb-16">
        <!-- Phone screenshots -->
        <div class="reveal flex justify-center items-end gap-4">
          <div class="flex flex-col gap-4 mb-8">
            <div class="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl w-32 md:w-36" style="aspect-ratio:9/19">
              <div class="w-full h-full rounded-[1.5rem] overflow-hidden bg-gray-800">
                <img :src="imgParcours" alt="Parcours TiBi" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl w-32 md:w-36" style="aspect-ratio:9/19">
              <div class="w-full h-full rounded-[1.5rem] overflow-hidden bg-gray-800">
                <img :src="imgProfil" alt="Profil TiBi" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <!-- Center phone — gold ring -->
          <div class="rounded-[2.5rem] shadow-2xl" style="padding:3px; background: linear-gradient(135deg, #F0B429, #E06510);">
            <div class="bg-gray-900 rounded-[2.5rem] p-1.5 w-40 md:w-48" style="aspect-ratio:9/19">
              <div class="w-full h-full rounded-[2rem] overflow-hidden bg-gray-800">
                <img :src="imgQuiz" alt="Quiz TiBi" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-4 mb-8">
            <div class="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl w-32 md:w-36" style="aspect-ratio:9/19">
              <div class="w-full h-full rounded-[1.5rem] overflow-hidden bg-gray-800">
                <img :src="imgAventure" alt="Aventure TiBi" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl w-32 md:w-36" style="aspect-ratio:9/19">
              <div class="w-full h-full rounded-[1.5rem] overflow-hidden bg-gray-800">
                <img :src="imgProgression" alt="Progression TiBi" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <!-- App features grid -->
        <div class="reveal text-white">
          <div class="grid grid-cols-2 gap-4 mb-8">
            <div v-for="feat in appFeatures" :key="feat.title" class="rounded-xl p-4" style="background:rgba(255,255,255,0.08)">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style="background:rgba(255,255,255,0.12)">
                <svg class="w-5 h-5 text-tibi-gold" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <path :d="feat.iconPath"/>
                </svg>
              </div>
              <div class="text-sm font-bold text-white mb-1">{{ feat.title }}</div>
              <div class="text-xs leading-relaxed" style="color:rgba(255,255,255,0.65)">{{ feat.desc }}</div>
            </div>
          </div>
          <!-- Store badges -->
          <div class="flex flex-wrap gap-3">
            <a href="#" aria-label="Télécharger TiBi sur App Store" class="flex items-center gap-2 border text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-white/10" style="background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.20)">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a href="#" aria-label="Télécharger TiBi sur Google Play" class="flex items-center gap-2 border text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-white/10" style="background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.20)">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.18 23.76c.34.19.74.2 1.1.02l11.65-6.73-2.5-2.5L3.18 23.76zm-1.47-19.4C1.47 4.72 1 5.3 1 6.1v11.8c0 .8.47 1.38 1.71 1.74L13.84 12 1.71 4.36zM20.84 10.5L17.7 8.7l-2.78 2.78 2.8 2.8 3.15-1.82c.9-.52.9-1.43-.03-1.96zM4.28.22c-.36-.18-.76-.17-1.1.02L13.84 10.5 16.32 8 4.28.22z"/></svg>
              Google Play
            </a>
          </div>
        </div>
      </div>

      <!-- Personnages -->
      <div class="reveal">
        <p class="text-center text-xs font-bold uppercase tracking-widest mb-8" style="color:rgba(255,255,255,0.50)">Rencontrez la famille TiBi</p>
        <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          <div
            v-for="char in characters"
            :key="char.name"
            class="flex-none w-40 md:w-44 snap-start group"
          >
            <div class="relative rounded-2xl overflow-hidden shadow-xl" style="aspect-ratio:3/4">
              <img :src="char.img" :alt="char.name" class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)"></div>
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <div class="font-bold text-white text-sm leading-tight">{{ char.name }}</div>
                <div class="text-xs mt-0.5" style="color:rgba(255,255,255,0.70)">{{ char.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section id="fonctionnalites" class="py-20 md:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 reveal">
        <span class="inline-block bg-green-50 text-tibi-green text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">Fonctionnalités</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">Une plateforme complète pour apprendre, enseigner et préserver les langues nationales du Burkina Faso.</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(feature, i) in features"
          :key="i"
          class="reveal group bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-tibi-gold/40"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" :class="feature.bgClass">
            <svg class="w-6 h-6" :class="feature.iconClass" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="feature.iconPath"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section id="comment-ca-marche" class="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-green-50/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 reveal">
        <span class="inline-block bg-amber-50 text-tibi-gold text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">Processus</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Comment ça marche</h2>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">Démarrez en trois étapes simples et commencez votre voyage linguistique.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-10 relative">
        <div class="hidden md:block absolute top-10 left-[calc(33%+2.5rem)] right-[calc(33%+2.5rem)] h-0.5" style="background: linear-gradient(to right, #1A7A1A, #F0B429, #E06510)"></div>
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="reveal flex flex-col items-center text-center"
          :style="{ transitionDelay: `${i * 120}ms` }"
        >
          <div class="w-20 h-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg mb-6" :class="step.textClass" :style="{ background: step.bg }">
            {{ step.number }}
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">{{ step.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed max-w-xs">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- POUR QUI -->
  <section id="apprenants" class="py-20 md:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 reveal">
        <span class="inline-block bg-orange-50 text-tibi-orange text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">Pour qui ?</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">TiBi pour tout le monde</h2>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">Des parcours adaptés à chaque profil, de l'enfant à l'adulte, de l'école à la famille.</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(persona, i) in personas"
          :key="i"
          class="reveal rounded-2xl p-6 border-2 text-center hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
          :class="persona.cardClass"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" :class="persona.iconBgClass">
            <svg class="w-7 h-7" :class="persona.iconClass" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="persona.iconPath"/>
            </svg>
          </div>
          <h3 class="text-lg font-extrabold text-gray-900 mb-2">{{ persona.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ persona.description }}</p>
          <div class="mt-4 inline-block text-xs font-bold px-3 py-1 rounded-full" :class="persona.tagClass">{{ persona.tag }}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- USER ROLES -->
  <section id="roles" class="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-green-50/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 reveal">
        <span class="inline-block bg-green-50 text-tibi-green text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">Rôles</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Un espace pour chaque acteur</h2>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">Chaque utilisateur dispose d'un espace personnalisé selon son rôle.</p>
      </div>
      <div class="flex flex-wrap justify-center gap-2 mb-10 reveal">
        <button
          v-for="(role, i) in roles"
          :key="i"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
          :class="activeRole === i ? 'bg-tibi-green text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          :aria-pressed="activeRole === i"
          @click="activeRole = i"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="role.iconPath"/>
          </svg>
          {{ role.title }}
        </button>
      </div>
      <div class="reveal">
        <transition name="role-fade" mode="out-in">
          <div
            :key="activeRole"
            class="rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 bg-gradient-to-br"
            :class="currentRole.gradientClass"
          >
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-white">
                    <svg class="w-6 h-6" :class="currentRole.checkClass" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                      <path :d="currentRole.iconPath"/>
                    </svg>
                  </div>
                  <h3 class="text-2xl font-extrabold text-gray-900">{{ currentRole.title }}</h3>
                </div>
                <p class="text-gray-600 text-base mb-6 leading-relaxed">{{ currentRole.description }}</p>
                <ul class="space-y-3">
                  <li v-for="(feat, j) in currentRole.features" :key="j" class="flex items-start gap-3">
                    <svg class="w-5 h-5 flex-shrink-0 mt-0.5" :class="currentRole.checkClass" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-gray-700 text-sm">{{ feat }}</span>
                  </li>
                </ul>
              </div>
              <div class="hidden md:flex justify-center">
                <div class="w-52 h-52 rounded-2xl flex items-center justify-center shadow-inner bg-white/60">
                  <svg class="w-24 h-24" :class="currentRole.checkClass" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path :d="currentRole.iconPath"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>

  <!-- STATS -->
  <section class="py-16 md:py-20 bg-white border-y border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="(stat, i) in stats" :key="i" class="reveal" :style="{ transitionDelay: `${i * 80}ms` }">
          <div class="text-4xl md:text-5xl font-extrabold mb-2" :class="stat.colorClass">{{ stat.value }}</div>
          <div class="text-gray-500 text-sm font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="py-20 md:py-28 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 reveal">
        <span class="inline-block bg-green-50 text-tibi-green text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">Témoignages</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Ce que disent nos utilisateurs</h2>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="(t, i) in testimonials"
          :key="i"
          class="reveal bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <div class="flex gap-1 mb-4" aria-label="5 étoiles sur 5">
            <svg v-for="s in 5" :key="s" class="w-4 h-4 text-tibi-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <p class="text-gray-600 text-sm leading-relaxed mb-6 italic">"{{ t.quote }}"</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" :class="t.avatarClass">{{ t.initials }}</div>
            <div>
              <div class="font-semibold text-gray-900 text-sm">{{ t.name }}</div>
              <div class="text-gray-500 text-xs">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section id="demo" class="py-20 md:py-28 bg-tibi-green relative overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="w-[500px] h-[500px] rounded-full blur-3xl" style="background:rgba(240,180,41,0.15)"></div>
    </div>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative reveal">
      <h2 class="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
        Rejoignez l'aventure TiBi
      </h2>
      <p class="text-lg mb-4 leading-relaxed" style="color:rgba(255,255,255,0.72)">
        Apprenez les langues nationales du Burkina Faso. Dès 500 FCFA/mois, paiement via Orange Money ou Moov Money.
      </p>
      <p class="text-base mb-10 font-semibold flex items-center justify-center gap-2" style="color:rgba(255,255,255,0.85)">
        <svg class="w-5 h-5 text-tibi-gold" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
        </svg>
        Objectif : 1 million d'utilisateurs d'ici 3 ans
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="mailto:equipes.tibi@gmail.com"
          class="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base text-white transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          style="background:#E06510"
        >
          Nous contacter
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
        <NuxtLink
          to="/connexion"
          class="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 font-bold text-base transition-all duration-200 hover:bg-white/10"
          style="border-color:rgba(240,180,41,0.60); color:#F0B429"
        >
          Accéder à la plateforme
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="bg-gray-900 text-gray-400 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-10 mb-10">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <img src="/icons/tibi-logo-final.png" alt="TiBi" class="h-9 w-auto object-contain" />
          </div>
          <p class="text-sm leading-relaxed text-gray-500 mb-1">Apprendre. Préserver. Innover.</p>
          <p class="text-sm leading-relaxed text-gray-500 mb-4">L'application d'apprentissage des langues africaines — du Burkina Faso à tout le continent.</p>
          <div class="flex gap-2">
            <a href="#" aria-label="App Store" class="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a href="#" aria-label="Google Play" class="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.18 23.76c.34.19.74.2 1.1.02l11.65-6.73-2.5-2.5L3.18 23.76zm-1.47-19.4C1.47 4.72 1 5.3 1 6.1v11.8c0 .8.47 1.38 1.71 1.74L13.84 12 1.71 4.36zM20.84 10.5L17.7 8.7l-2.78 2.78 2.8 2.8 3.15-1.82c.9-.52.9-1.43-.03-1.96zM4.28.22c-.36-.18-.76-.17-1.1.02L13.84 10.5 16.32 8 4.28.22z"/></svg>
              Google Play
            </a>
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-white text-sm mb-4">Application</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#langues" class="hover:text-white transition-colors">Langues disponibles</a></li>
            <li><a href="#fonctionnalites" class="hover:text-white transition-colors">Fonctionnalités</a></li>
            <li><a href="#mobile" class="hover:text-white transition-colors">Application mobile</a></li>
            <li><a href="#apprenants" class="hover:text-white transition-colors">Pour qui ?</a></li>
            <li><NuxtLink to="/connexion" class="hover:text-white transition-colors">Se connecter</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-white text-sm mb-4">Contact</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="mailto:equipes.tibi@gmail.com" class="hover:text-white transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                equipes.tibi@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+22674974863" class="hover:text-white transition-colors flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +226 74 97 48 63
              </a>
            </li>
            <li><a href="#" class="hover:text-white transition-colors">Mentions légales</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Politique de confidentialité</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
        © 2026 TiBi – Équipe Projet TiBi · Burkina Faso. Tous droits réservés.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import imgAccueil     from '~/assets/images/tibi-accueil.jpeg'
import imgQuiz        from '~/assets/images/tibi-quiz.jpeg'
import imgParcours    from '~/assets/images/tibi-parcours.jpeg'
import imgAventure    from '~/assets/images/tibi-aventure.jpeg'
import imgProfil      from '~/assets/images/tibi-profil.jpeg'
import imgProgression from '~/assets/images/tibi-progression.jpeg'
import charNikiema    from '~/assets/images/tibi-nikiema.png'
import charYuma       from '~/assets/images/tibi-yuma.png'
import charTiga       from '~/assets/images/tibi-tiga.png'
import charAwa        from '~/assets/images/tibi-awa.png'
import charMapin      from '~/assets/images/tibi-mapin.png'
import charKadoua     from '~/assets/images/tibi-kadoua.png'
import charSambo      from '~/assets/images/tibi-sambo.png'
import charZaki       from '~/assets/images/tibi-zaki.png'
import charKinga      from '~/assets/images/tibi-kinga.png'
import charWhaf       from '~/assets/images/tibi-whaf.png'

useHead({ title: "TiBi — Apprendre. Préserver. Innover. Langues nationales du Burkina Faso" })
definePageMeta({ layout: 'default' })

const activeRole = ref(0)
const currentRole = computed(() => roles[activeRole.value]!)

// SVG path constants (Heroicons outline 24px)
const IC_BOOK     = 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
const IC_CHAT     = 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
const IC_GLOBE    = 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
const IC_PUZZLE   = 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
const IC_MAP      = 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
const IC_SPARKLES = 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
const IC_USERS    = 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
const IC_BUILDING = 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
const IC_MUSIC    = 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
const IC_CARD     = 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'

const IC_GRAD     = 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
const IC_CLIP     = 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
const IC_USERCIRCLE = 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'

const langBadges = [
  { name: 'Mooré',   family: 'Langue Gur',       colorClass: 'text-tibi-green'  },
  { name: 'Dioula',  family: 'Langue Mandé',      colorClass: 'text-tibi-gold'   },
  { name: 'Fulfuldé',family: 'Langue Atlantique', colorClass: 'text-tibi-orange' },
]

const languages = [
  {
    code: 'MO', name: 'Mooré',
    iconPath: IC_BOOK, iconBgClass: 'bg-green-100', iconClass: 'text-tibi-green',
    speakers: '~8 millions de locuteurs',
    description: 'La langue du peuple Mossi, majoritaire au Burkina Faso. Langue officielle nationale depuis décembre 2023.',
    cardClass: 'border-green-100 bg-green-50/40', badgeClass: 'text-tibi-green', speakersClass: 'text-tibi-green',
  },
  {
    code: 'DI', name: 'Dioula',
    iconPath: IC_CHAT, iconBgClass: 'bg-amber-100', iconClass: 'text-tibi-gold',
    speakers: '~3 millions de locuteurs',
    description: 'Langue du commerce et des échanges au Burkina Faso et en Afrique de l\'Ouest. Reconnue langue officielle nationale.',
    cardClass: 'border-amber-100 bg-amber-50/40', badgeClass: 'text-tibi-gold', speakersClass: 'text-tibi-gold',
  },
  {
    code: 'FF', name: 'Fulfuldé',
    iconPath: IC_GLOBE, iconBgClass: 'bg-orange-100', iconClass: 'text-tibi-orange',
    speakers: '~2 millions de locuteurs',
    description: 'La langue des Peuls, répandue à travers l\'Afrique de l\'Ouest. Langue officielle nationale du Burkina Faso.',
    cardClass: 'border-orange-100 bg-orange-50/40', badgeClass: 'text-tibi-orange', speakersClass: 'text-tibi-orange',
  },
]

const appFeatures = [
  { iconPath: IC_PUZZLE,   title: 'Quiz interactifs',     desc: 'Exercices ludiques adaptés au niveau de l\'apprenant' },
  { iconPath: IC_MAP,      title: 'Parcours structurés',   desc: 'Progression par niveaux avec objectifs clairs' },
  { iconPath: IC_SPARKLES, title: 'ZAKI — IA',            desc: 'Assistant IA pour corriger et guider l\'apprenant' },
  { iconPath: IC_USERS,    title: 'Espace famille',        desc: 'Suivi parental et contrôle des progrès des enfants' },
  { iconPath: IC_BUILDING, title: 'Mode école',            desc: 'Classes virtuelles pour enseignants et directeurs' },
  { iconPath: IC_BOOK,     title: 'Alphabétisation',       desc: 'Parcours spéciaux pour adultes non scolarisés' },
  { iconPath: IC_MUSIC,    title: 'Patrimoine culturel',   desc: 'Contes, chants et proverbes en langues nationales' },
  { iconPath: IC_CARD,     title: 'Mobile Money',          desc: 'Paiement Orange Money & Moov Money intégré' },
]

const characters = [
  { img: charNikiema, name: 'Tonton NIKIEMA', role: 'Le sage conteur'              },
  { img: charYuma,    name: 'Madame YUMA',    role: 'L\'enseignante bienveillante'  },
  { img: charTiga,    name: 'TIGA',           role: 'L\'élève curieux'              },
  { img: charAwa,     name: 'AWA',            role: 'L\'élève studieuse'            },
  { img: charMapin,   name: 'MAPIN',          role: 'L\'élève sportif'              },
  { img: charKadoua,  name: 'KADOUA',         role: 'La petite curieuse'            },
  { img: charSambo,   name: 'SAMBO',          role: 'Le farceur du village'         },
  { img: charZaki,    name: 'ZAKI',           role: 'L\'assistant IA'               },
  { img: charKinga,   name: 'KINGA',          role: 'Le perroquet bavard'           },
  { img: charWhaf,    name: 'WHAF',           role: 'Le chien joueur'               },
]

const features = [
  { iconPath: IC_GRAD,     iconClass: 'text-tibi-green',  bgClass: 'bg-green-50',  title: 'Parcours pédagogiques',        description: 'Modules structurés en niveaux progressifs pour apprendre Mooré, Dioula et Fulfuldé à son rythme.' },
  { iconPath: IC_PUZZLE,   iconClass: 'text-tibi-gold',   bgClass: 'bg-amber-50',  title: 'Quiz & exercices interactifs', description: 'Des quiz ludiques, exercices de prononciation et activités culturelles pour renforcer l\'apprentissage.' },
  { iconPath: IC_SPARKLES, iconClass: 'text-tibi-orange', bgClass: 'bg-orange-50', title: 'IA ZAKI — correction',         description: 'L\'assistant IA corrige les erreurs, explique les règles et accompagne chaque apprenant personnellement.' },
  { iconPath: IC_USERS,    iconClass: 'text-tibi-green',  bgClass: 'bg-green-50',  title: 'Comptes famille & école',      description: 'Les parents suivent la progression de leurs enfants. Les directeurs gèrent leurs classes en temps réel.' },
  { iconPath: IC_BOOK,     iconClass: 'text-tibi-gold',   bgClass: 'bg-amber-50',  title: 'Alphabétisation des adultes',  description: 'Des parcours spécialement conçus pour les adultes qui n\'ont pas été scolarisés, dans leur langue maternelle.' },
  { iconPath: IC_MUSIC,    iconClass: 'text-tibi-orange', bgClass: 'bg-orange-50', title: 'Patrimoine culturel',          description: 'Contes, proverbes, chants et traditions culturelles intégrés dans chaque parcours d\'apprentissage.' },
]

const steps = [
  { number: '01', bg: '#1A7A1A', textClass: 'text-white',     title: 'Inscrivez-vous',         description: 'Créez votre compte en quelques secondes. Choisissez votre langue et votre niveau de départ.' },
  { number: '02', bg: '#F0B429', textClass: 'text-gray-900',  title: 'Choisissez votre parcours', description: 'Sélectionnez votre langue (Mooré, Dioula ou Fulfuldé) et suivez les modules à votre rythme.' },
  { number: '03', bg: '#E06510', textClass: 'text-white',     title: 'Progressez & pratiquez', description: 'Complétez les quiz, pratiquez avec ZAKI et mesurez votre progression en temps réel.' },
]

const personas = [
  {
    iconPath: IC_USERCIRCLE, iconBgClass: 'bg-green-100',  iconClass: 'text-tibi-green',
    title: 'L\'enfant apprenant',
    description: 'Des activités ludiques et des personnages attachants pour apprendre les langues nationales de manière amusante.',
    tag: '6 – 14 ans', cardClass: 'border-green-100 bg-green-50/30', tagClass: 'bg-green-100 text-tibi-green',
  },
  {
    iconPath: IC_USERS, iconBgClass: 'bg-amber-100', iconClass: 'text-tibi-gold',
    title: 'Le parent engagé',
    description: 'Suivez la progression de vos enfants, encouragez-les et participez ensemble à la valorisation des langues africaines.',
    tag: 'Famille', cardClass: 'border-amber-100 bg-amber-50/30', tagClass: 'bg-amber-100 text-tibi-gold',
  },
  {
    iconPath: IC_BUILDING, iconBgClass: 'bg-orange-100', iconClass: 'text-tibi-orange',
    title: 'Le directeur d\'école',
    description: 'Gérez vos classes, suivez les performances collectives et intégrez TiBi dans votre programme scolaire.',
    tag: 'Établissement', cardClass: 'border-orange-100 bg-orange-50/30', tagClass: 'bg-orange-100 text-tibi-orange',
  },
  {
    iconPath: IC_BOOK, iconBgClass: 'bg-green-100', iconClass: 'text-tibi-green',
    title: 'L\'adulte en alphabétisation',
    description: 'Apprenez à lire et écrire dans votre langue maternelle grâce à des parcours adaptés aux adultes non scolarisés.',
    tag: 'Alphabétisation', cardClass: 'border-green-100 bg-green-50/30', tagClass: 'bg-green-100 text-tibi-green',
  },
]

const roles = [
  {
    iconPath: IC_CLIP, iconBgClass: '', title: 'Gestionnaire',
    gradientClass: 'from-amber-50 to-white', checkClass: 'text-tibi-gold',
    description: 'Supervision du contenu éditorial, gestion des formateurs et pilotage de la discovery de la plateforme.',
    features: ['Supervision des formateurs', 'Organisation du contenu', 'Gestion de la discovery', 'Tableaux de bord analytiques', 'Modération des signalements'],
  },
  {
    iconPath: IC_GRAD, iconBgClass: '', title: 'Formateur',
    gradientClass: 'from-orange-50 to-white', checkClass: 'text-tibi-orange',
    description: 'Création et animation des modules, gestion des apprenants et suivi de leur progression.',
    features: ['Création de modules et parcours', 'Gestion de ses apprenants', 'Messagerie intégrée', 'Exercices et quiz interactifs', 'Suivi de progression détaillé'],
  },
  {
    iconPath: IC_BOOK, iconBgClass: '', title: 'Apprenant',
    gradientClass: 'from-green-50 to-white', checkClass: 'text-tibi-green',
    description: 'Accès à ses cours, suivi de sa progression et découverte de nouveaux contenus via la section discovery.',
    features: ['Accès à tous ses cours', 'Suivi de progression en temps réel', 'Discovery de nouveaux contenus', 'Messagerie avec son formateur', 'Application mobile disponible'],
  },
]

const stats = [
  { value: '2 000+', label: 'Langues parlées en Afrique',       colorClass: 'text-tibi-green'  },
  { value: '500F',   label: 'Abonnement basique / mois',        colorClass: 'text-tibi-gold'   },
  { value: '1M+',    label: 'Utilisateurs ciblés en 3 ans',     colorClass: 'text-tibi-orange' },
  { value: '2',      label: 'Moyens de paiement Mobile Money',  colorClass: 'text-tibi-green'  },
]

const testimonials = [
  {
    quote: "TiBi m'a permis d'apprendre le Mooré de façon ludique. Les quiz sont interactifs et ZAKI corrige mes erreurs immédiatement. Je progresse chaque jour !",
    name: 'Adama Ouédraogo', role: 'Apprenant — Mooré', initials: 'AO', avatarClass: 'bg-tibi-green',
  },
  {
    quote: "En tant que directeur d'école, je peux désormais intégrer l'apprentissage du Dioula dans nos activités scolaires. TiBi est une révolution pédagogique pour le Burkina.",
    name: 'Moussa Diallo', role: "Directeur d'école primaire, Ouagadougou", initials: 'MD', avatarClass: 'bg-tibi-gold',
  },
  {
    quote: "J'utilise TiBi pour apprendre à lire et écrire le Fulfuldé, ma langue maternelle. C'est simple, beau et je suis fière de préserver notre culture.",
    name: 'Fatoumata Sawadogo', role: 'Adulte en alphabétisation', initials: 'FS', avatarClass: 'bg-tibi-orange',
  },
]

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08 }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
.animate-fade-in {
  animation: fadeInUp 0.85s ease forwards;
}
.animate-slide-up {
  animation: fadeInUp 1s ease 0.2s both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
.role-fade-enter-active,
.role-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.role-fade-enter-from { opacity: 0; transform: translateY(12px); }
.role-fade-leave-to  { opacity: 0; transform: translateY(-8px); }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
