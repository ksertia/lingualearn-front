# TODO - Annulation des modifications pour connecter les boutons Modifier et Supprimer aux APIs

## Tâches complétées
- [x] Supprimer l'importation et l'utilisation du composant EditUser dans users.vue
- [x] Retirer le modal d'édition du template dans users.vue
- [x] Supprimer les références à editingUser, editUser, et onUserUpdated dans users.vue
- [x] Retirer les gestionnaires d'événements @edit et @delete dans le composant UserTable de users.vue
- [x] Supprimer le fichier EditUser.vue
- [x] Mettre à jour le TODO.md pour refléter l'annulation des modifications

## Notes
- L'erreur 500 côté serveur pour PUT /v1/users/{id} nécessite l'annulation des modifications frontend
- Les APIs restent disponibles pour les tests dans Swagger UI
- Les boutons "Modifier" et "Supprimer" resteront visibles dans UserTable.vue mais ne feront rien
