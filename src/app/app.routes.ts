import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AuthCallbackComponent } from './component/auth-callback/auth-callback.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'auth/callback', component: AuthCallbackComponent},
    { path: 'dashboard', component: DashboardComponent},
];
