import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'scoping', loadChildren: () => import('./features/scoping/scoping.module').then(m => m.ScopingModule) },
    { path: '', redirectTo: 'scoping', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
        initialNavigation: 'enabledBlocking'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }