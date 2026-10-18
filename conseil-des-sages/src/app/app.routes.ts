import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';

export const routes: Routes = [
    {path: '', redirectTo: 'landing-page', pathMatch: 'full'},
    {path: 'landing-page', component: LandingPage, title: "Accueil", data: {label: "Landing Page" ,showInMenu: true, order: 1}},
    {path: 'connexion', component: LandingPage, title: "Connexion", data: {label: "Connexion" ,showInMenu: false, order: 2}},
    {path: 'app', component: LandingPage, title: "App", data: {label: "App" ,showInMenu: true, order: 3}},
];
