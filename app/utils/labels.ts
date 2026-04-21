export const accountTypeLabel: Record<string, string> = {
  admin: 'Administrateur',
  teacher: 'Formateur',
  learner: 'Apprenant',
  sub_account_learner: 'Sous-compte apprenant',
  plateform_manager: 'Gestionnaire de plateforme',
}

export const progressStatusLabel: Record<string, string> = {
  not_started: 'Non commencé',
  in_progress: 'En cours',
  completed: 'Terminé',
}

export const subscriptionStatusLabel: Record<string, string> = {
  active: 'Actif',
  canceled: 'Annulé',
  expired: 'Expiré',
  pending: 'En attente',
}

export const billingCycleLabel: Record<string, string> = {
  monthly: 'Mensuel',
  yearly: 'Annuel',
}

export const genderLabel: Record<string, string> = {
  male: 'Homme',
  female: 'Femme',
  other: 'Autre',
}

export const relationshipTypeLabel: Record<string, string> = {
  child: 'Enfant',
  student: 'Élève',
  ward: 'Pupille',
  parent: 'Parent',
  guardian: 'Tuteur',
}

export const reportFrequencyLabel: Record<string, string> = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
}

export const stepTypeLabel: Record<string, string> = {
  lesson: 'Cours',
  quiz: 'Quiz',
  exercise: 'Exercice',
}

export const exerciseTypeLabel: Record<string, string> = {
  multiple_choice: 'Choix multiple',
  fill_blank: 'Texte à trous',
  matching: 'Association',
}

export const difficultyLabel: Record<string, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
}

export const signalementStatusLabel: Record<string, string> = {
  pending: 'En attente',
  processed: 'Traité',
  resolved: 'Résolu',
  dismissed: 'Rejeté',
}

export const signalementActionLabel: Record<string, string> = {
  warning: 'Avertissement',
  content_removed: 'Contenu supprimé',
  user_suspended: 'Utilisateur suspendu',
  dismissed: 'Rejeté',
}

export const contentStatusLabel: Record<string, string> = {
  active: 'Actif',
  disabled: 'Désactivé',
}

export const booleanStatusLabel = (value: boolean): string => {
  return value ? 'Actif' : 'Inactif'
}

export const verifiedStatusLabel = (value: boolean): string => {
  return value ? 'Vérifié' : 'Non vérifié'
}
