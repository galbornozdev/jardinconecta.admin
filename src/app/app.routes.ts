import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'panel',
    loadComponent: () => import('./pages/panel/panel.component').then(m => m.PanelComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'alumnos', pathMatch: 'full' },
      {
        path: 'alumnos',
        loadComponent: () => import('./pages/panel/alumnos/alumnos.component').then(m => m.AlumnosComponent),
        canActivate: [authGuard]
      },
      {
        path: 'salas',
        loadComponent: () => import('./pages/panel/salas/salas.component').then(m => m.SalasComponent),
        canActivate: [authGuard]
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
