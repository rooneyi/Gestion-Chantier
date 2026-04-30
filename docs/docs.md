# Documentation fonctionnelle

## Périmètre

Cette documentation décrit l’état actuel du projet Gestion Chantier. L’application centralise la gestion des projets, des utilisateurs, du matériel, des présences, des absences, des rapports et de l’audit.

## Rôles métier

- Manager: pilote les projets, supervise le budget et consulte les indicateurs
- Engineer: suit les tâches, initialise les présences et travaille avec les équipes projet
- Worker: consulte ses tâches, déclare sa présence et remonte les incidents
- Magasinier: gère le stock et les sorties de matériel
- ChefChantier: supervise l’exécution terrain et consulte les informations utiles à l’équipe

## Fonctionnement actuel

### Authentification

- accès protégé par Laravel Fortify
- vérification de l’adresse email sur les routes principales
- 2FA disponible pour les comptes utilisateurs

### Tableau de bord

Le tableau de bord adapte les données affichées au rôle connecté.

- Manager: projets, budget total, projets actifs, nombre d’ouvriers, stock total, tâches, activités récentes
- Engineer: tâches liées à ses projets, équipes, présences, statuts d’absence et shifts
- Worker: tâches personnelles, présences enregistrées, incidents déclarés

### Projets

Les projets exposent des données de base de chantier:

- nom
- description
- budget
- deadline
- statut
- ingénieur assigné

Routes principales:

- consultation de la liste des projets
- création d’un projet
- affichage détaillé d’un projet
- mise à jour d’un projet
- suppression d’un projet

### Utilisateurs

Les utilisateurs sont gérés depuis l’interface interne avec les informations suivantes:

- nom
- email
- rôle
- taux journalier
- compétences

### Matériel

Le module matériel permet:

- la création et la maintenance des articles
- les entrées de stock
- les sorties de stock
- l’allocation de matériel à un besoin ou à un projet

### Présences

Le module présence couvre:

- check-in
- check-out
- mise à jour du statut
- vue par ouvrier
- vue mensuelle
- initialisation des présences par projet

### Absences

Les absences détectées sont centralisées dans un module dédié:

- consultation des absences en attente
- affichage détaillé d’une absence
- marquage comme lue
- résolution d’une absence

### Rapports et incidents

- génération de rapports
- soumission de rapports
- déclaration d’incidents

### Journal d’activité

Les actions importantes sont tracées dans `activity_logs` pour garder un historique exploitable.

## Modèle de données principal

Les entités principales du projet sont:

- User
- Project
- Task
- Material
- Attendance
- ResourceRequest
- ActivityLog
- AbsenceNotification
- ReportSubmission

## Routes importantes

| Route | Usage |
|---|---|
| `/dashboard` | Tableau de bord selon le rôle |
| `/users` | Gestion des utilisateurs |
| `/projects` | Gestion des projets |
| `/materials` | Gestion du matériel |
| `/attendance` | Suivi des présences |
| `/absences` | Gestion des absences |
| `/reports` | Rapports |
| `/activity-logs` | Historique des actions |

## Scripts utiles

```bash
php artisan test --compact
vendor/bin/pint --dirty --format agent
npm run lint:check
npm run types:check
php artisan route:list
```

## Notes de mise à jour

Cette page doit être tenue à jour dès qu’une route, un rôle métier ou un module fonctionnel change.