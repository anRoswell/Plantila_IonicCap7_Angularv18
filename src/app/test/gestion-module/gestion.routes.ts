import { Routes } from '@angular/router';

export const GESTION_ROUTES: Routes = [
  {
    path: 'list',
    loadComponent: ()=> import('./list/list.component').then((c)=>c.ListComponent),
  },
  {
    path: 'form/:id',
    loadComponent: ()=> import('./tab/tab.component').then((c)=>c.TabComponent),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
];
