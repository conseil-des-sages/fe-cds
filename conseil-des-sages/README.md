# Le Conseil des Sages : frontend

Application Angular 22 : compose un conseil, soumets-lui une décision, suis le débat en direct et reçois une synthèse.

## Démarrage

Lance d'abord l'API (voir le README de `be-cds`), puis :

```bash
npm install
npm start
```

Ouvre `http://localhost:4200`. Le proxy (`proxy.conf.json`) transmet `/api` au backend sur le port 8080.

## Vérifications

```bash
ng test --watch=false
ng build
```

## Organisation

| Dossier | Contenu |
| --- | --- |
| `src/styles/` | Design system : `tokens.css`, `typography.css`, `kit.css` (classes `cds-*`) |
| `src/styles.css` | Pont entre Tailwind/Zard et les tokens, styles de base |
| `src/app/models/` | Types partagés (sages, débats, compte) |
| `src/app/services/api/` | Appels HTTP, un fichier par domaine |
| `src/app/services/` | Authentification, conseil du joueur, flux du débat |
| `src/app/ui/` | Composants réutilisables : avatar, cercle, étapes, panneau, popup, cartes |
| `src/app/pages/` | Une page par dossier, avec ses sous-composants |

La salle du conseil est pilotée par `pages/council/debate-room.store.ts`. `turn-player.ts` y rythme l'affichage : un modèle écrit plus vite qu'on ne lit, donc les interventions sont mises en file, écrites à un rythme lisible, puis restent le temps d'être lues.

## Règles du design system

- Les composants n'écrivent aucune couleur en dur : uniquement `var(--token)`, jamais les nuances brutes (`--primary-300`).
- Polices : Fraunces (titres), Manrope (interface et débats), JetBrains Mono (chiffres uniquement).
- Verre : `cds-glass--strong` dès qu'il y a plus de deux lignes de texte, et deux couches superposées au maximum.
- Un seul bouton primaire et un seul élément lumineux par écran.
- Couleur d'un sage : toujours accompagnée de son symbole et de son nom.
- Mobile en dessous de 768px, comme la navbar. Le ton : on tutoie, phrases courtes, pas d'emoji.

Attention aux noms de classes : Tailwind génère des utilitaires comme `.ring` ou `.shadow`, qui s'appliquent en plus des styles du composant.
