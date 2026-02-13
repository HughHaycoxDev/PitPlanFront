import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '**', redirectTo: 'login'},
    { path: 'login', component: LoginComponent },
    { path: 'auth/callback', component: AuthCallbackComponent},
    { path: 'dashboard', component: DashboardComponent},
];
