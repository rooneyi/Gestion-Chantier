# Documentation fonctionnelle

## Objectif

Cette application permet de gérer un chantier de construction de bout en bout. Elle rassemble les informations utiles pour organiser les équipes, suivre les projets, contrôler le matériel, enregistrer les présences et garder une trace des actions importantes.

## Rôles métier

- Manager: pilote les projets et consulte la vision globale
- Engineer: organise le suivi opérationnel et les équipes
- Worker: consulte ses tâches et déclare sa présence
- Magasinier: gère le stock et les mouvements de matériel
- ChefChantier: supervise le terrain et le déroulé des tâches

## Fonctionnalités principales

### Gestion des utilisateurs

- création, modification et suppression des utilisateurs
- attribution d’un rôle métier à chaque utilisateur
- gestion des informations de base du personnel

### Gestion des projets

- création d’un projet avec nom, description, budget et dates
- affectation d’un ingénieur ou d’un responsable
- consultation de la liste et du détail des projets
- suivi de l’état d’avancement d’un projet

### Gestion du matériel

- création et modification du matériel
- attribution de matériel à un chantier
- enregistrement des entrées et sorties de stock
- consultation de l’historique des mouvements

### Présences et absences

- pointage d’entrée et de sortie
- mise à jour du statut de présence
- consultation des présences par ouvrier ou par période
- suivi des absences détectées et de leur traitement

### Rapports et incidents

- génération de rapports
- soumission de rapports
- déclaration d’incidents sur le chantier

### Pilotage et suivi

- affichage d’un tableau de bord adapté au rôle connecté
- vision des indicateurs utiles au suivi du chantier
- journalisation des actions importantes pour garder un historique

## Parcours utilisateur

### Manager

Le manager crée les projets, consulte les indicateurs globaux et suit la situation générale du chantier.

### Engineer

L’engineer organise le travail, suit les équipes et utilise les informations de présence pour le pilotage quotidien.

### Worker

Le worker consulte ses tâches, suit son planning et déclare sa présence sur le chantier.

### Magasinier

Le magasinier suit le stock, enregistre les mouvements de matériel et contrôle les disponibilités.

### ChefChantier

Le chef de chantier supervise l’exécution terrain et vérifie l’avancement des tâches.

## Règles métier

- un utilisateur agit selon son rôle
- un projet doit rester cohérent dans son cycle de vie
- les mouvements de stock doivent pouvoir être tracés
- les présences et absences doivent pouvoir être suivies dans le temps
- les rapports et incidents doivent rester consultables

## Résultat attendu

L’application doit offrir une vue claire de l’activité du chantier, limiter les erreurs de suivi et centraliser l’information utile à chaque métier.