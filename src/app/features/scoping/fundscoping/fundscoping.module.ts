import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScopingModule } from '../scoping.module';
import { FundScopingRoutingModule } from './fundscoping-routing.module';
import { FundScopingComponent } from './fundscoping.component';
import { FundscopingDetailsComponent } from './component/fundscoping-details/fundscoping-details.component';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { EngagementDetailsComponent } from 'src/app/shared/components/engagement-details/engagement-details.component';

@NgModule({
  declarations: [
    FundScopingComponent,
    FundscopingDetailsComponent
  ],
  imports: [
    CommonModule,
    FundScopingRoutingModule,
    ScopingModule,
    GridModule,
    GridAllModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownListAllModule,
    EngagementDetailsComponent
  ]
})
export class FundscopingModule { }