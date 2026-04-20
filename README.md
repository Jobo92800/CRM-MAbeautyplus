# MaBeauty+ CRM

CRM visuel pour les centres MaBeauty+. Interface connectée à Airtable en temps réel.

## Fonctionnalités

- **Pipeline Kanban** : 10 colonnes (Nouveau → Converti/Perdu)
- **Fiche prospect** : édition inline avec sync Airtable
- **Agenda** : vue liste + vue journée style Google Agenda
- **Dashboard** : stats par commercial, centre, soin, thérapeute
- **Filtres** : par centre, commercial, soin + recherche texte
- **Automations** : cases Email Relance, Brevo, Rappel Calendly

## Configuration

Au premier lancement, coller votre **Personal Access Token Airtable** :
1. https://airtable.com/create/tokens
2. Scopes : `data.records:read` + `data.records:write`
3. Access : base **CRM 2026**

## Déploiement

Site statique hébergé sur Netlify.
