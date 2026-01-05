import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomConfirmationDialogComponent } from './custom-confirmation-dialog.component';
import { BrowserDefaultPopupComponent } from './browser-default-popup/browser-default-popup.component';
import { CustomPopupModule } from 'src/app/features/modal/custom-popup.module';
import { SharedPipesModule } from '../../pipe/shared-pipes.module';
@NgModule({
  declarations: [CustomConfirmationDialogComponent, BrowserDefaultPopupComponent],
  imports: [
    CommonModule,
    CustomPopupModule,
    SharedPipesModule
  ],
  exports:[CustomConfirmationDialogComponent, BrowserDefaultPopupComponent]
})
export class CustomConfirmationDialogModule { }