import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'landing-page', renderMode: RenderMode.Prerender },
  { path: 'connexion', renderMode: RenderMode.Prerender },
  // Les autres pages dépendent du compte connecté : elles s'affichent dans le navigateur.
  { path: '**', renderMode: RenderMode.Client },
];
