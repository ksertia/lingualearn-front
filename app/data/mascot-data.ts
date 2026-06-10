import type { MascotCharacter, MascotContext } from '~/types/mascot'

// ─────────────────────────────────────────────────────────────────────────────
// PERSONNAGES TIBI
// Les images sont dans app/assets/images/ — remplaçables par des illustrations
// officielles TiBi sans changer le reste du code.
// ─────────────────────────────────────────────────────────────────────────────

export const MASCOT_CHARACTERS: Record<string, MascotCharacter> = {
  zaki: {
    id: 'zaki',
    name: 'Zaki',
    image: 'assets/images/tibi-zaki.png',
    personality: 'aventurier et enthousiaste',
    tagline: 'Ton compagnon d\'aventure !',
    color: '#1A7A1A'
  },
  awa: {
    id: 'awa',
    name: 'Awa',
    image: 'assets/images/tibi-awa.png',
    personality: 'sage et encourageante',
    tagline: 'Je crois en toi !',
    color: '#E06510'
  },
  kinga: {
    id: 'kinga',
    name: 'Kinga',
    image: 'assets/images/tibi-kinga.png',
    personality: 'joyeuse et créative',
    tagline: 'L\'apprentissage, c\'est la fête !',
    color: '#8B5CF6'
  },
  yuma: {
    id: 'yuma',
    name: 'Yuma',
    image: 'assets/images/tibi-yuma.png',
    personality: 'calme et réfléchi',
    tagline: 'Chaque mot appris est un trésor.',
    color: '#0EA5E9'
  },
  sambo: {
    id: 'sambo',
    name: 'Sambo',
    image: 'assets/images/tibi-sambo.png',
    personality: 'drôle et espiègle',
    tagline: 'Apprendre en s\'amusant !',
    color: '#F59E0B'
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES CONTEXTUELS PAR PERSONNAGE
// Chaque contexte a plusieurs messages — sélection aléatoire
// ─────────────────────────────────────────────────────────────────────────────

export const MASCOT_MESSAGES: Record<string, Record<MascotContext, string[]>> = {
  zaki: {
    greeting: [
      'Bonjour, champion ! Prêt à explorer de nouvelles langues aujourd\'hui ? 🌟',
      'Te voilà de retour ! J\'ai hâte d\'apprendre avec toi ! 🎒',
      'Une nouvelle journée, de nouvelles aventures linguistiques ! 🚀',
      'Salut ! Ta série continue — ne la laisse pas s\'arrêter ! 🔥',
    ],
    lesson_start: [
      'C\'est parti pour une nouvelle leçon ! Tu vas cartonner ! 💪',
      'Je suis là à côté de toi. Allons-y ensemble ! 🤝',
      'Concentre-toi bien, tu vas tout retenir ! 🧠',
      'Cette leçon va être passionnante, j\'en suis sûr ! ✨',
    ],
    lesson_complete: [
      'INCROYABLE ! Tu as terminé la leçon ! 🎉',
      'Bravo ! Chaque leçon te rapproche de la maîtrise ! ⭐',
      'Ouais ! Tu progresses à toute vitesse ! 🚀',
      'Tu es une vraie éponge ! Continue comme ça ! 🌊',
    ],
    quiz_start: [
      'Le quiz commence ! Montre ce que tu sais ! 💥',
      'Tu es prêt ? Tes connaissances vont briller ! ✨',
      'Rappelle-toi de ce qu\'on a appris — tu l\'as dans la poche ! 🎯',
      'Quiz time ! Je parie que tu vas tout réussir ! 🏆',
    ],
    quiz_correct: [
      'C\'est ÇA ! Quelle réponse ! 🎯',
      'Parfait ! Tu es vraiment doué(e) ! ⭐',
      'BOUM ! Exactement la bonne réponse ! 💥',
      'Tu brilles ! Continue comme ça ! ✨',
    ],
    quiz_wrong: [
      'Pas cette fois, mais on apprend de nos erreurs ! 💪',
      'Hm, presque ! Souviens-toi de la prochaine fois ! 🤔',
      'Ne t\'inquiète pas, un faux pas ne ruine pas tout ! 😊',
      'C\'était difficile ! Retiens la bonne réponse pour la suite ! 📝',
    ],
    quiz_complete_win: [
      'CHAMPION ! Tu as réussi le quiz ! 🏆🎉',
      'Extraordinaire ! Tu maîtrises vraiment ces leçons ! 🌟',
      'Je savais que tu pouvais le faire ! Bravo ! 🎊',
      'Quiz terminé avec succès ! Tu es une étoile ! ⭐',
    ],
    quiz_complete_lose: [
      'Tu l\'as vraiment donné à fond ! Réessaie, tu vas y arriver ! 💪',
      'Chaque tentative te rend plus fort(e). Encore un effort ! 🌱',
      'C\'est dur, mais tu t\'en sortiras ! Je crois en toi ! 🤝',
      'Même les champions tombent avant de se relever ! Allez ! 🔄',
    ],
    badge_unlock: [
      'WOW ! Tu as débloqué un nouveau badge ! 🏅✨',
      'Ce badge est bien mérité, champion(ne) ! 🎖️',
      'Un nouveau trophée dans ta collection ! Incroyable ! 🏆',
      'Tu continues de nous épater ! Encore un badge débloqué ! 🌟',
    ],
    level_up: [
      'NIVEAU SUPÉRIEUR ! Tu deviens de plus en plus fort(e) ! 🚀',
      'Wow, tu as monté de niveau ! La légende grandit ! 👑',
      'Plus fort(e), plus grand(e), plus sage ! Nouveau niveau atteint ! ⚡',
      'Un nouveau niveau débloqué ! Ton aventure s\'intensifie ! 🌟',
    ],
    streak: [
      'Ta série de jours est incroyable ! Ne la brise pas ! 🔥',
      `${7} jours d'affilée ! Tu es inarrêtable ! 💪`,
      'Ta régularité paie ! Continue sur ta lancée ! 📅',
      'Chaque jour compte ! Ta série grandit ! 🌱',
    ],
    daily_reminder: [
      'Tu n\'as pas encore fait ta leçon du jour ! J\'ai besoin de toi ! 📚',
      'Ta série t\'attend ! Juste une petite leçon aujourd\'hui ? 🙏',
      'Un tout petit effort quotidien fait les grands champions ! 💪',
      'N\'oublie pas ta pratique du jour ! Je compte sur toi ! ⏰',
    ],
    encouragement: [
      'Tu peux le faire ! J\'y crois ! 🌟',
      'Chaque mot appris t\'ouvre une nouvelle porte ! 🚪',
      'La progression prend du temps — et tu progresses vraiment ! 📈',
      'Les langues s\'apprennent pas à pas. Continue ! 👣',
    ],
    parcours_complete: [
      'PARCOURS TERMINÉ ! Tu es une légende, ${name} ! 🏆✨',
      'Incroyable ! Tu as maîtrisé ce parcours ! Le prochain t\'attend ! 🚀',
      'Quel voyage ! Tu as tout appris avec brio ! 🌟',
      'Bravo, bravo, BRAVO ! Ce parcours n\'a plus de secrets pour toi ! 🎊',
    ],
    chest_open: [
      'Ton coffre quotidien t\'attendait ! Profite de ta récompense ! 🎁',
      'Un cadeau de TiBi pour ta fidélité ! Tu le mérites ! 🎊',
      'Wow ! Regarde ce que tu as gagné ! 🎉',
      'Un trésor quotidien pour le champion que tu es ! 💎',
    ],
    quest_complete: [
      'Quête accomplie ! Tu es une machine ! ⚡',
      'Défi relevé ! Rien ne t\'arrête ! 🏆',
      'Mission réussie ! Prochaine étape ! 🎯',
      'Encore une quête dans la poche ! Tu assures ! ✅',
    ],
  },

  awa: {
    greeting: [
      'Bonjour ! La sagesse des langues t\'attend aujourd\'hui. 🌸',
      'Chaque jour d\'apprentissage est un pas vers la grandeur. 💫',
      'Je suis heureuse de te voir ! Prête pour une nouvelle aventure ? 🌺',
      'Bienvenue ! Les mots ont un pouvoir immense — apprends-les bien. ✨',
    ],
    lesson_start: [
      'Respire, concentre-toi. La connaissance vient à ceux qui s\'y consacrent. 🌿',
      'Chaque nouvelle leçon est une graine que tu plantes. 🌱',
      'Sois attentif(ve) — les détails font la différence ! 👁️',
      'Tu es prêt(e). Allons découvrir ensemble ! 🤝',
    ],
    lesson_complete: [
      'Excellent travail ! La patience et l\'effort portent leurs fruits. 🌸',
      'Tu as bien appris aujourd\'hui. Sois fier(e) de toi ! 🌟',
      'La connaissance s\'installe doucement — tu y es. ✨',
      'Merveilleux ! Tu avances sur le bon chemin. 🌺',
    ],
    quiz_start: [
      'Fais confiance à ce que tu as appris. La mémoire est ton amie. 🧠',
      'Prends ton temps. Chaque bonne réponse est une victoire. ⭐',
      'Montre le chemin parcouru ! Tu peux le faire ! 💪',
      'La connaissance que tu portes en toi va briller ! ✨',
    ],
    quiz_correct: [
      'Magnifique ! Ta mémoire est excellente ! 🌟',
      'C\'est tout à fait ça ! Tu maîtrises bien cette leçon. ✅',
      'Parfait ! La sagesse grandit en toi. 🌸',
      'Bien ! Chaque bonne réponse te rapproche de la maîtrise. 🎯',
    ],
    quiz_wrong: [
      'L\'erreur enseigne plus que la réussite facile. Retiens-le bien ! 📖',
      'C\'est ainsi qu\'on apprend. La prochaine fois sera la bonne ! 💭',
      'Ne te décourage pas. Tout vient à point à qui sait persévérer. 🌱',
      'Un faux pas nous rend plus sage. Continue ! 🌿',
    ],
    quiz_complete_win: [
      'Tu as démontré une belle maîtrise ! Quelle progression ! 🌟',
      'Bravo ! Ta persévérance a payé ! 🏆',
      'La sagesse récompense les travailleurs. Tu en es la preuve ! 🌸',
      'Excellente performance ! Je suis vraiment fière de toi ! ✨',
    ],
    quiz_complete_lose: [
      'La patience est une vertu. Réessaie, tu vas y arriver. 🌱',
      'L\'échec n\'est qu\'un pas vers la réussite. Courage ! 💪',
      'Continue à apprendre. La persévérance vaincra ! 🌺',
      'Ne baisse pas les bras. La victoire appartient aux courageux. 🌟',
    ],
    badge_unlock: [
      'Ce badge témoigne de ta belle progression ! 🏅',
      'Un joli trophée pour une belle personne. Tu le mérites ! ✨',
      'Ta collection de badges grandit avec tes connaissances ! 🌟',
      'Chaque badge est une nouvelle médaille d\'honneur ! 🎖️',
    ],
    level_up: [
      'Tu as atteint un nouveau niveau ! Ta maîtrise grandit. 🌿',
      'Nouveau niveau — nouvelle sagesse. Je suis fière de toi ! 🌸',
      'Ton chemin est beau à voir. Continue ainsi ! ⭐',
      'La progression est constante et admirable ! 🏆',
    ],
    streak: [
      'Ta régularité est exemplaire ! Continue ainsi. 🌸',
      'La constance est la mère du succès. Tu l\'incarnes ! 💫',
      'Chaque jour pratiqué est un investissement pour demain. 🌱',
      'Ton dévouement est remarquable ! Bravo. ✨',
    ],
    daily_reminder: [
      'N\'oublie pas ta pratique quotidienne. La régularité fait la différence. 📅',
      'Un peu chaque jour vaut mieux que beaucoup une fois. 🌿',
      'Ta leçon du jour t\'attend ! Prends un moment pour apprendre. 📚',
      'La sagesse ne s\'acquiert pas en un jour, mais un jour à la fois. 💭',
    ],
    encouragement: [
      'Tu avances à ton propre rythme — et c\'est parfait. 🌸',
      'La persévérance est ta plus belle qualité. Continue ! 💪',
      'Chaque effort, même petit, compte. Je le vois en toi. 🌟',
      'Tu es sur la bonne voie. N\'abandonne jamais ! 🌺',
    ],
    parcours_complete: [
      'Quel parcours magnifique accompli ! Tu devrais être si fier(e) ! 🌸',
      'Le chemin était long, mais tu l\'as parcouru avec grâce ! 🏆',
      'Un parcours de plus dans ta vie de linguiste ! 🌺',
      'La sagesse te sourit aujourd\'hui. Bravo ! ✨',
    ],
    chest_open: [
      'Une petite récompense pour ta fidélité quotidienne ! 🎁',
      'Le coffre du jour te récompense de ta persévérance ! 💫',
      'Ouvre-le ! Il contient une surprise méritée ! 🌸',
      'Ta fidélité quotidienne est récompensée ! 🎊',
    ],
    quest_complete: [
      'Défi relevé avec sagesse et détermination ! 🌟',
      'Tu as accompli ce qui semblait difficile. Bravo ! ✅',
      'Une quête de plus accomplie. Tu grandis chaque jour ! 🌸',
      'Mission réussie ! Ta persévérance est admirable. 🏆',
    ],
  },

  kinga: {
    greeting: [
      'Coucou ! On est là pour s\'amuser ET apprendre ! 🎨',
      'Youpi ! Tu es là ! L\'aventure continue ! 🎉',
      'Hey hey ! Une nouvelle journée de découvertes ! 🌈',
      'Salut champ ! Prêt(e) à colorier ta journée de mots nouveaux ? 🖌️',
    ],
    lesson_start: [
      'Wooohooo ! La leçon commence ! Mets ta casquette de génie ! 🎓',
      'C\'est parti ! Cette leçon va être tellement amusante ! 🎊',
      'Allons découvrir ensemble ! Je suis trop excitée ! 🌟',
      'Ouvre grands tes yeux et tes oreilles — voilà la magie ! ✨',
    ],
    lesson_complete: [
      'OUAAAAAIS ! Tu l\'as fait ! TROP BIEN ! 🎉🎉🎉',
      'Génial ! Tu es une vraie star de l\'apprentissage ! ⭐',
      'Hip hip hip HOURRA ! Leçon terminée ! 🎊',
      'Fantastique ! Tu enchaînes les leçons comme un pro ! 🚀',
    ],
    quiz_start: [
      'Quiz ! Quiz ! Quiz ! Allez champion(ne), montre ce que tu sais ! 🎯',
      'C\'est l\'heure du défi ! Je parie que tu vas tout avoir ! 💫',
      'ON Y VA ! Tes connaissances vont exploser ! 💥',
      'Top chrono ! Le quiz t\'attend ! Prêt(e) ? Set ? GO ! 🏁',
    ],
    quiz_correct: [
      'OHHH OUI ! C\'est exactement ça ! YESSS ! 🎉',
      'BOOM ! Bonne réponse ! Tu déchires tout ! 💥',
      'Tu es TROP FORT(E) ! ✨',
      'MAGNIFIQUE ! La bonne réponse d\'un seul coup ! 🎯',
    ],
    quiz_wrong: [
      'Oh non ! Mais on va pas se laisser abattre hein ? 💪',
      'Aïe ! C\'était quand même courageux d\'essayer ! Prochaine fois ! 😄',
      'Raté, mais c\'est comme ça qu\'on apprend ! Let\'s GO ! 🔄',
      'Même les super-héros font des erreurs ! Allez ! 🦸',
    ],
    quiz_complete_win: [
      'VICTOIRE TOTALE ! TU ES INARRÊTABLE ! 🏆🎉🎊',
      'WOOHOO ! CHAMPION(NE) DU JOUR ! OUIII ! 🥳',
      'PERFECTO ! Je suis trop fière de toi ! ⭐⭐⭐',
      'TU AS TOUT DÉFONCÉ ! (le quiz bien sûr 😄) 💥',
    ],
    quiz_complete_lose: [
      'Hey, pas de stress ! On va ré-essayer et cette fois ça va passer ! 💪',
      'Haha ! Le quiz t\'a résisté mais toi t\'es plus fort(e) ! 🔄',
      'C\'était chaud ! Mais on repart de l\'avant ! 🚀',
      'Un essai de plus et tu le bats ce quiz ! J\'en suis sûre ! 😄',
    ],
    badge_unlock: [
      'NOUVEAU BADGE ! C\'EST TROP BEAU ! 🏅✨🎉',
      'OH LÀ LÀ ! Un badge tout neuf dans ta collection ! 🎖️💫',
      'Incroyable ! Ce badge va si bien dans ta collection ! 🌈',
      'YAY YAY YAY ! Badge débloqué ! Tu collectionnes les succès ! 🌟',
    ],
    level_up: [
      'NIVEAU SUPÉRIEUR ! NOUVELLE AVENTURE ! 🚀🌟',
      'WOW WOW WOW ! Tu montes en puissance ! 👑',
      'EPIC ! Nouveau niveau ! La légende grandit ! ⚡💥',
      'YEAHHH ! Plus fort(e) que jamais ! Nouveau niveau ! 🎊',
    ],
    streak: [
      'Ta série c\'est TROP cool ! Continue comme ça ! 🔥',
      'Wow, tous ces jours d\'affilée ! Tu es incroyable ! 📅',
      'La flamme brûle encore ! Ne l\'éteins surtout pas ! 🔥✨',
      'SÉRIE EN COURS ! On continue ? Allez ! 💪',
    ],
    daily_reminder: [
      'Hey ! Tu nous avais pas oublié(e) j\'espère ?! 😄',
      'Psst ! Ta leçon du jour t\'attend tout impatiente ! 📚',
      'La journée sans leçon c\'est une journée incomplète ! 😅',
      'Allez ! Juste une petite leçon et on est bons ! 🌟',
    ],
    encouragement: [
      'Toi + les langues = une combinaison gagnante ! 🌈',
      'Continue ! Tu vas tellement loin ! 🚀',
      'Chaque mot appris c\'est une couleur ajoutée à ta palette ! 🎨',
      'Tu progresses super bien ! Garde cette énergie ! ⚡',
    ],
    parcours_complete: [
      'PARCOURS 100% TERMINÉ ! TU ASSURES COMPLÈTEMENT ! 🏆🎊🎉',
      'YAAAS ! Ce parcours n\'a plus aucun secret pour toi ! 💫',
      'Tu l\'as fait du début à la fin ! RESPECT ! 🌟',
      'GG ! (Good Game, et aussi Génial(e) !) 🎮🏆',
    ],
    chest_open: [
      'COFFRE DU JOUR ! Qu\'est-ce qu\'il y a dedans ?! 🎁😍',
      'SURPRISE SURPRISE ! Le coffre attendait que toi ! 🎊',
      'Wooohooo ! Une récompense rien que pour toi ! 💎',
      'CADEAUUUU ! Ouvre vite ! 🎉',
    ],
    quest_complete: [
      'QUÊTE ACCOMPLIE ! Tu es game ? 🎮⚡',
      'Mission RÉUSSIE ! Style assuré ! ✅💥',
      'ENCORE UNE QUÊTE DANS LA POCHE ! 🏆',
      'CHECKMARK ! Défi relevé avec brio ! 🎯',
    ],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — Obtenir un message aléatoire pour un contexte donné
// ─────────────────────────────────────────────────────────────────────────────

export function getMascotMessage(
  characterId: string,
  context: MascotContext,
  replace?: Record<string, string>
): string {
  const charMessages = MASCOT_MESSAGES[characterId] ?? MASCOT_MESSAGES.zaki
  const contextMessages = charMessages[context] ?? charMessages.encouragement
  const idx = Math.floor(Math.random() * contextMessages.length)
  let msg = contextMessages[idx]

  if (replace) {
    Object.entries(replace).forEach(([key, val]) => {
      msg = msg.replace(`\${${key}}`, val)
    })
  }

  return msg
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPPING CONTEXTE → HUMEUR
// ─────────────────────────────────────────────────────────────────────────────

export const CONTEXT_TO_MOOD: Record<MascotContext, string> = {
  greeting: 'happy',
  lesson_start: 'encouraging',
  lesson_complete: 'celebrating',
  quiz_start: 'excited',
  quiz_correct: 'excited',
  quiz_wrong: 'encouraging',
  quiz_complete_win: 'celebrating',
  quiz_complete_lose: 'encouraging',
  badge_unlock: 'celebrating',
  level_up: 'celebrating',
  streak: 'proud',
  daily_reminder: 'thinking',
  encouragement: 'happy',
  parcours_complete: 'celebrating',
  chest_open: 'excited',
  quest_complete: 'proud'
}

// Mascotte par défaut selon la page
export const PAGE_MASCOT: Record<string, string> = {
  dashboard: 'zaki',
  parcours: 'awa',
  lecon: 'kinga',
  quiz: 'zaki',
  badges: 'kinga',
  profil: 'awa'
}
