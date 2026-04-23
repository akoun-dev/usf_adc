# USF ADC - Plateforme de Gestion Administrative

Une application web moderne pour la gestion administrative de l'Union des Syndicats Financiers Africains (USF ADC).

## 📌 Aperçu

Plateforme complète pour la gestion des membres, projets, formations, événements et communications de l'USF ADC.

## 🚀 Technologies

- **Framework**: React 18 + TypeScript
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **Base de données**: Supabase
- **Gestion d'état**: React Query (TanStack)
- **Internationalisation**: i18next
- **Éditeur riche**: Tiptap
- **Cartographie**: Leaflet
- **Tests**: Vitest, Testing Library

## 🛠️ Fonctionnalités principales

### Authentification & Profils
- Système d'authentification sécurisé
- Gestion des profils membres
- Historique des promotions
- Rôles et permissions (Admin, Membre, Invité)

### Gestion des Membres
- Annuaire des pays membres
- Système d'invitations
- Acceptation/refus d'invitations
- Gestion des promotions

### Contenu Public
- Actualités et annonces
- Projets et appels à projets
- Événements et calendrier
- Documents publics
- Forum de discussion

### Administration
- Tableau de bord complet
- Gestion des formations
- Suivi des activités
- Génération de rapports

## 📁 Structure du projet

```
src/
├── pages/              # Pages principales de l'application
├── features/           # Fonctionnalités organisées par domaine
│   ├── profiles/       # Gestion des profils
│   ├── invitations/    # Système d'invitations
│   ├── public/         # Pages publiques
│   └── training/       # Gestion des formations
├── hooks/              # Hooks personnalisés
├── core/               # Types, constantes et utilitaires
├── integrations/       # Intégrations (Supabase, etc.)
├── assets/             # Ressources statiques
└── lib/                # Utilitaires généraux
```

## 🔧 Configuration requise

- Node.js 18+
- Bun ou npm/yarn
- Compte Supabase (pour la base de données)

## 📦 Installation

```bash
# Cloner le dépôt
git clone [URL_DU_DEPOT]
cd usf_adc

# Installer les dépendances
bun install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Lancer l'application en développement
bun run dev
```

## 🎯 Scripts disponibles

| Commande          | Description                          |
|-------------------|--------------------------------------|
| `bun run dev`     | Lancer le serveur de développement    |
| `bun run build`   | Builder pour production              |
| `bun run lint`    | Vérifier la qualité du code          |
| `bun run test`    | Exécuter les tests                   |
| `bun run preview` | Prévisualiser la build de production  |

## 🌍 Environnements

- **Développement**: `http://localhost:5173`
- **Production**: À configurer selon votre hébergement

## 📂 Variables d'environnement

Créer un fichier `.env` à la racine avec les variables suivantes :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
VITE_APP_TITLE="USF ADC Admin"
```

## 🤝 Contribution

1. Forker le projet
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commiter vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENCE](LICENCE) pour plus de détails.

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement à [support@usf-adc.org].

---

© 2024 Union des Syndicats Financiers Africains (USF ADC). Tous droits réservés.
