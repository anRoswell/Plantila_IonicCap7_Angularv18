import { Routes } from '@angular/router';

export const TEST_ROUTES: Routes = [
  {
    path: 'gestion',
    loadChildren: () => import('./gestion-module/gestion.routes').then((r) => r.GESTION_ROUTES),
  },
  {
    path: '',
    redirectTo: 'gestion',
    pathMatch: 'full',
  },
];
