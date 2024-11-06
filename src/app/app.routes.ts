import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((p) => p.HomePage),
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.routes').then((r) => r.TEST_ROUTES),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
