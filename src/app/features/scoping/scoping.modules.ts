import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScopingRoutingModule } from './scoping-routing.module';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule } from '@angular/forms';
import { AddFundComponent } from './component/add-fund/add-fund.component';
import { FundScopingRoutineModule } from './fundscoping/fundscoping-routing.module';

@NgModule({
  declarations: [
    AddFundComponent
  ],
  imports: [
    CommonModule,
    ScopingRoutingModule,
    TextBoxModule,
    FormsModule
  ],
  exports: [AddFundComponent],
  providers: []
})
export class ScopingModule { }