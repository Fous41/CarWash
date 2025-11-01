import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard] //protect dashboard
  },
  { 
    path: 'services', 
    loadComponent: () => import('./services/services').then(m => m.ServicesComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'booking', 
    loadComponent: () => import('./booking/booking').then(m => m.BookingComponent),
    canActivate: [authGuard]
  }
];
