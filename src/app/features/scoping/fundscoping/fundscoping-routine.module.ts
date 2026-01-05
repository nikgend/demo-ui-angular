import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundscopingDetailsComponent } from './component/fundscoping-details/fundscoping-details.component';
import { ViewEngagementComponent } from './component/view-engagement/view-engagement.component';
import { AddFundComponent } from '../component/add-fund/add-fund.component';

const routes: Routes = [];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FundscopingRoutingModule {}
