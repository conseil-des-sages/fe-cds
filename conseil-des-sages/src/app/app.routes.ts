import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { LoginPage } from './pages/login-page/login-page';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPage, title: 'Accueil', data: { label: 'Landing Page', showInMenu: true, order: 1 } },
  { path: 'connexion', component: LoginPage, title: 'Connexion', data: { label: 'Connexion', showInMenu: false, order: 2 } },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    title: 'Mon conseil',
    data: { label: 'Mon conseil', showInMenu: true, order: 3 },
  },
  {
    path: 'salle/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/council/council.page').then((m) => m.CouncilPage),
    title: 'Salle du conseil',
  },
  {
    path: 'profil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
    title: 'Mon profil',
    data: { label: 'Mon profil', showInMenu: true, order: 4 },
  },
  {
    path: 'design-system',
    loadComponent: () => import('./pages/design-system/design-system.page').then((m) => m.DesignSystemPage),
    title: 'Design system',
  },
  { path: '**', redirectTo: 'landing-page' },
];
