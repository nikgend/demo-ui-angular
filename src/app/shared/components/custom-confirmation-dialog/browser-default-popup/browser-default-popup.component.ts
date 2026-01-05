import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CustomBrowserPopupComponent } from 'src/app/features/modal/component/custom-browser-popup/custom-browser-popup.component';
import { Constants } from '../../../../shared/components/constants/constants';


@Component({
  selector: 'browser-default-popup',
  templateUrl: './browser-default-popup.component.html',
  styleUrls: ['./browser-default-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BrowserDefaultPopupComponent {
  @ViewChild(CustomBrowserPopupComponent) customBrowserPopupComponent!: CustomBrowserPopupComponent;
  @Output() onIsUserConfirmed = new EventEmitter<boolean>();
  @Output() onClosePopUp = new EventEmitter<boolean>(false);
  YesButtonText: string = 'Leave';
  NoButtonText: string = 'Cancel';
  browserPopupHeaderText = Constants.browserPopupHeaderText;
  browserPopupBodyText = Constants.browserPopupBodyText;

  onbtn2Click() {
    this.onIsUserConfirmed.emit(true);
  }

  triggerOpen() {
    this.customBrowserPopupComponent.openPopup();
  }
  triggerClose() {
    this.customBrowserPopupComponent.closePopup();
  }
  triggerCloseBtnIcon() {
    this.customBrowserPopupComponent.closePopup();
  }
  triggerCloseBtn(){
    this.onClosePopUp.emit(true);
    this.customBrowserPopupComponent.closePopup();
  }

  popUpClosed(event: String) {}
}
