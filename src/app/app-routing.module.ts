import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundListComponent } from './shared/components/fund-scoping/fund-list/fund-list';
export const routes: Routes = [
  {
    path: 'scoping',
    loadChildren: () => import('./features/scoping/scoping.module').then(m => m.ScopingModule)
  },
  { path: 'fund-scoping', component: FundListComponent },
  {
    path: '',
    redirectTo: 'scoping',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'scoping'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    initialNavigation: 'enabledNonBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
