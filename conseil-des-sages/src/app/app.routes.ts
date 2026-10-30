import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { LoginPage } from './pages/login-page/login-page';


export const routes: Routes = [
    {path: '', redirectTo: 'landing-page', pathMatch: 'full'},
    {path: 'connexion', component: LoginPage },
    {path: 'landing-page', component: LandingPage},
];
