import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/user-search/user-search.component')
        .then(m => m.UserSearchComponent)
  }
];
