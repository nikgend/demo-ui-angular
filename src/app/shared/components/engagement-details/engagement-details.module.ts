import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngagementDetailsComponent } from './engagement-details.component';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';



@NgModule({
  declarations: [EngagementDetailsComponent],
  imports: [
    CommonModule,TooltipModule
  ],
  exports: [EngagementDetailsComponent]

})
export class EngagementDetailsModule { }
