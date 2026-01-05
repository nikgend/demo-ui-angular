import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'fundscoping',
        data: {
            url: 'fundscoping/funddetails'
        },
        loadchildren: () => 
            import('./fundscoping/fundscoping.module').then(
                (m) => m.FundScopingModule)
            
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScopingRoutingModule {}