# Conseil des Sages — frontend

Application frontend réalisée avec Angular 22. Elle permet de composer un conseil, de soumettre une question et de consulter une salle de discussion.

## Démarrage local

### Prérequis

- Node.js et npm
- Le backend `be-cds` démarré sur `http://localhost:8080`
- La base de données configurée et démarrée pour le backend

Dans un premier terminal, démarre le backend depuis son dossier :

```bash
mvn spring-boot:run
```

Dans un second terminal, démarre le frontend depuis le dossier de ce projet :

```bash
npm install
ng serve
```

Ouvre ensuite `http://localhost:4200`. Le proxy de développement défini dans `proxy.conf.json` transmet les routes API au backend sur le port 8080.

## Changements réalisés

### Authentification reliée au backend

- L’inscription envoie le pseudo, l’adresse e-mail et le mot de passe à `POST /api/auth/register`.
- La connexion envoie l’adresse e-mail et le mot de passe à `POST /api/auth/login`.
- Les jetons d’accès et de renouvellement sont conservés dans `sessionStorage`.
- Un intercepteur ajoute le jeton d’accès aux requêtes API protégées et tente de le renouveler après une réponse 401.
- La déconnexion appelle `POST /api/auth/logout` et efface les jetons locaux.
- La navbar affiche l’action de déconnexion quand une session est active.
- Les erreurs d’authentification sont affichées dans le formulaire.

Le pseudo fourni à l’inscription est conservé localement pour l’affichage dans l’application. L’API d’authentification ne renvoie pas le profil lors d’une connexion ; le pseudo n’est donc pas récupéré depuis le backend pour les sessions déjà existantes.

### Page « Mon conseil »

- Le message d’accueil commence par « Nous sommes cinq… » sans nom d’utilisateur prédéfini.
- Le formulaire enregistre la question dans le store frontend et ouvre la salle du conseil.

### Page de discussion

- La question est affichée en haut de page.
- Les avatars du conseil sont disposés dans une zone circulaire.
- L’intervention est présentée dans une carte indépendante sous les avatars, afin d’éviter le chevauchement.
- La progression du débat reste visible en bas de page.
- La mise en page s’adapte aux écrans mobiles.

**À savoir :** l’intervention et les étapes visibles sont encore des données de démonstration. Le backend actuel n’expose pas encore les routes pour créer et piloter un débat complet.

## Vérifications

Vérifier le typage Angular sans lancer le serveur de développement :

```bash
node node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js -p tsconfig.app.json --noEmit
```

Construire l’application :

```bash
ng build
```

## Structure concernée

- `src/app/services/auth.service.ts` : appels d’authentification et gestion locale des jetons et du pseudo.
- `src/app/auth.interceptor.ts` : ajout du jeton et renouvellement après expiration.
- `src/app/pages/login-page/` : formulaires de connexion et d’inscription.
- `src/app/components/navbar/` : navigation et déconnexion.
- `src/app/pages/dashboard/` : page « Mon conseil » et soumission de la question.
- `src/app/pages/council/council.page.ts` : salle de discussion et sa mise en page.
- `proxy.conf.json` : proxy des appels API en développement.
