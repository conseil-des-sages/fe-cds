# Le Conseil des Sages : frontend

Tu hésites entre deux choix ? Soumets ta décision à un conseil d'IA aux personnalités opposées. Les sages en débattent devant toi en trois tours, puis le Greffier te remet une synthèse : notes par critère, points d'accord, désaccords et questions à te poser.

Ce dépôt contient l'application Angular. L'API Spring Boot est dans [`be-cds`](https://github.com/conseil-des-sages/be-cds).

## Fonctionnalités

- **Accueil** : présente le principe et les cinq sages de base, sans compte.
- **Connexion et inscription** : sur la même page. La session se renouvelle toute seule quand le jeton expire.
- **Mon conseil** (`/app`) :
  - compose ton conseil de 2 à 8 sages, parmi les sages de base, les tiens et ceux partagés par la communauté ;
  - pose ta question, avec du contexte si tu veux ;
  - retrouve tes débats récents et les tendances (nombre de débats, thèmes du moment).
- **Salle du conseil** (`/salle/:id`) :
  - le débat s'affiche en direct : Ouverture, Confrontation, Position finale, puis Synthèse ;
  - le sage qui parle s'allume dans le cercle, et son intervention s'écrit à un rythme lisible ;
  - tu peux mettre en pause, passer une intervention, ajouter une précision pour le conseil ou relire tout le fil ;
  - le Greffier glisse ses remarques au fil du débat ;
  - si la connexion coupe, la salle se reconnecte et le débat reprend où il en était ;
  - un débat terminé peut être rejoué.
- **Synthèse** : verdict, tableau de notes par option et par critère, points d'accord, désaccords, questions ouvertes.
- **Mon profil** (`/profil`) : change ton pseudo, archive ou supprime tes débats, crée tes propres sages (prompt, modèle, température, longueur des réponses, couleur, icône, partage avec la communauté).
- **Thème clair ou sombre**, mémorisé, et mise en page mobile.
- **Design system** (`/design-system`) : vitrine des tokens et des composants.

## Stack

| Outil | Usage |
| --- | --- |
| Angular 22 | Composants standalone, signals, pages chargées à la demande |
| Angular SSR | Pré-rendu de l'accueil et de la connexion |
| Tailwind CSS 4 et Zard UI | Styles et composants de base |
| Lucide | Icônes |
| Vitest | Tests unitaires |
| nginx (Docker) | Sert l'application et relaie `/api` vers l'API |

## Démarrage

Prérequis : Node.js 24 et npm, ou Docker. L'API doit tourner : sans elle, seules l'accueil et la vitrine s'affichent.

### Avec Docker

Place `be-cds` et `fe-cds` côte à côte et remplis le `.env` de l'API (voir son README). Puis, depuis `be-cds` :

```bash
docker compose up -d --build
```

L'application est sur `http://localhost:4200`. L'image du front construit l'application, puis la sert avec nginx (`Dockerfile`, `nginx.conf`).

### En développement

Lance l'API (`docker compose up -d database`, puis `mvn spring-boot:run` dans `be-cds`), puis ici :

```bash
cd conseil-des-sages
npm install
npm start
```

Ouvre `http://localhost:4200`. Le proxy (`proxy.conf.json`) transmet `/api` à l'API sur le port 8080, et la page se recharge à chaque modification.

Compte de démo : `demo@conseil.fr` / `demo1234`.

## Pages

| Route | Page | Accès | Rendu |
| --- | --- | --- | --- |
| `/landing-page` | Accueil | Public | Pré-rendu au build |
| `/connexion` | Connexion et inscription | Public | Pré-rendu au build |
| `/app` | Mon conseil | Connecté | Navigateur |
| `/salle/:id` | Salle du conseil | Connecté | Navigateur |
| `/profil` | Mon profil | Connecté | Navigateur |
| `/design-system` | Vitrine du design system | Public | Navigateur |

Une page réservée aux comptes renvoie vers `/connexion`, puis ramène à la page demandée une fois connecté.

## Fonctionnement

### Organisation

| Dossier (`conseil-des-sages/src/`) | Contenu |
| --- | --- |
| `app/pages/` | Une page par dossier, avec ses sous-composants |
| `app/ui/` | Composants réutilisables : avatar, cercle du conseil, étapes, panneau d'intervention, popup, cartes |
| `app/services/api/` | Appels HTTP, un fichier par domaine (compte, sages, débats) |
| `app/services/` | Authentification, conseil du joueur, flux du débat |
| `app/models/` | Types partagés avec l'API |
| `styles/` | Design system : tokens, typographie, classes `cds-*` |

### Authentification

Les jetons JWT renvoyés par l'API sont gardés dans `sessionStorage`. `auth.interceptor.ts` ajoute le jeton à chaque appel `/api`. Sur une réponse 401, il renouvelle le jeton une seule fois et rejoue la requête : si plusieurs requêtes échouent en même temps, elles attendent le même renouvellement. Si le renouvellement échoue, il renvoie à la connexion.

### Le débat en direct

L'API envoie le débat en flux SSE (`GET /api/debates/{id}/events`). `EventSource` ne sait pas envoyer d'en-tête `Authorization` : `debate-stream.service.ts` lit donc le flux avec `fetch`, et `sse-parser.ts` le découpe en événements.

`debate-room.store.ts` applique ces événements à l'état de la salle. Un modèle écrit plus vite qu'on ne lit : `turn-player.ts` met les interventions en file, les écrit à environ 55 caractères par seconde, puis les laisse 2,5 secondes à l'écran. Si le navigateur demande moins d'animations, le texte s'affiche d'un coup.

Si le flux se ferme sans annoncer la fin du débat, la salle recharge le débat et se reconnecte, trois fois au plus avant d'afficher une erreur. Le débat continue côté serveur même si tu quittes la page : tu le retrouves dans tes débats récents.

### Le conseil

`council.store.ts` garde les sages et la composition du conseil. Une modification s'affiche tout de suite et s'enregistre en arrière-plan. Les enregistrements partent dans l'ordre, pour que le serveur garde toujours la dernière composition.

### Déploiement

L'accueil et la connexion sont pré-rendues au build. Les autres pages dépendent du compte : elles s'affichent dans le navigateur. En Docker, nginx sert ces fichiers et relaie `/api` vers l'API, sans mise en tampon et avec un délai d'une heure, pour que le débat arrive au fil de l'eau.

## Design system

Les règles (tokens, polices, verre, couleurs des sages, ton) sont dans le [README de l'application](conseil-des-sages/README.md#règles-du-design-system). Tu peux les voir appliquées sur `/design-system`.

## Tests et build

Depuis `conseil-des-sages` :

```bash
npx ng test --watch=false
npm run build
```

Les tests couvrent le découpage du flux SSE, le rythme d'affichage du débat, le store du conseil, le thème et les composants principaux. Le build sort dans `dist/conseil-des-sages`.

## Limites connues

- Le build signale deux dépassements de budget : le bundle initial (681 kB pour 500 kB conseillés) et `navbar.css` (4,2 kB pour 4 kB). L'application fonctionne, mais le premier chargement pourrait être allégé.
- La session vit dans `sessionStorage` : elle se perd à la fermeture de l'onglet.

## Équipe

Gabriel Combe, Quentin Dufour, Nicolas Danquigny.
