import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import {
  CheckBoxSelectionService,
  MultiSelectComponent,
} from '@syncfusion/ej2-angular-dropdowns';


import { Subscription } from 'rxjs';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-angular-popups';
import { CustomPopupComponent } from 'src/app/features/modal/component/custom-popup/custom-popup.component';
import { Constants } from '../constants/constants';

@Component({
  selector: 'custom-confiramtion-dialog',
  templateUrl: './custom-confirmation-dialog.component.html',
  styleUrls: ['./custom-confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomConfirmationDialogComponent implements OnInit, OnDestroy {
  @ViewChild(CustomPopupComponent) customPopupComponent!: CustomPopupComponent;
  public deletModalConfirmMessage: string = Constants.confirmationText;
  public deletModalMainMessage: string = Constants.ConfirmDialogwithDataImportMessage;
  @Input() deletModalTitle!: string;
  @Input() deleteModalMessage?: string;
  @Input() specialClass: string = '';
  @Input() dynamicClassForList: string = '';
  @Input() noteTitle: string = '';
  @Input() noteMessage: string = '';

  @Input() customData!: string[];

  @Input() buttonYesValue: string = 'Yes';
  @Input() buttonNoValue: string = 'No';
  @Input() isbuttonNoValue: boolean =false ;
  @Input() deleteMember: boolean =false ;
  @Input() isDeleteEngagementByUser: boolean =false ;
  @Input() isDeleteUserByEngagement: boolean =false;
  @Input() isDeleteAdminUser: boolean =false;

  @Output() onIsUserConfirmed = new EventEmitter<boolean>();
  @Output() onClosePopUp = new EventEmitter<boolean>(false);
  @Input() public widthFlag!:number;
  @Input() public specialNoteExists!:Boolean;
  @Input() public htmlBody?: boolean = false;
  @Input() public specialBackExists!:Boolean;
  @Output() onDeleteConfirm = new EventEmitter()
  @Output() onDeleteManageEngagement = new EventEmitter();
  @Output() onDeleteUserByEngagement = new EventEmitter();
  @Output() onDeleteAdminUser = new EventEmitter();

  modelTitle: string = 'Confirmation';

  constructor() {}

  ngOnInit(): void {
   // console.log( this.customData);
  }
  ngOnDestroy(): void {}

  //component event

  // onbtn1Click() {
   
  //   this.onIsUserConfirmed.emit(false);
  // }

  onbtn2Click() {
    if(this.deleteMember){
      this.onDeleteConfirm.emit(true);
      this.triggerCloseBtn();
    } else if (this.isDeleteEngagementByUser){
        this.onDeleteManageEngagement.emit(true);
      this.triggerCloseBtn();
    } else if (this.isDeleteUserByEngagement) {
      this.onDeleteUserByEngagement.emit(true);
      this.triggerCloseBtn();
    } else if (this.isDeleteAdminUser) {
      this.onDeleteAdminUser.emit(true);
      this.triggerCloseBtnIcon();
    }
    else {
      this.onIsUserConfirmed.emit(true);
    }
  }

  triggerOpen() {
    this.customPopupComponent.openPopup();
  }
  triggerClose() {
    // this.onClosePopUp.emit(true); //commented and called in below triggerClose()
    this.customPopupComponent.closePopup();
  }
  triggerCloseBtnIcon(){
    this.customPopupComponent.closePopup();

  }
  triggerCloseBtn(){
    
    if(this.isDeleteAdminUser) {
      this.customPopupComponent.closePopup();
    } else {
    this.onClosePopUp.emit(true);
    this.customPopupComponent.closePopup();
   } 
  }

  popUpClosed(event: String) {
    //Close the pop up on Escape key press
  }
}
