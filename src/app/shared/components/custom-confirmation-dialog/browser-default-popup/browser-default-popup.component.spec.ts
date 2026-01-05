import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserDefaultPopupComponent } from "./browser-default-popup.component";
import { Constants } from '../../../../shared/components/constants/constants';

describe("BrowserDefaultPopupComponent", () => {
  let component: BrowserDefaultPopupComponent;
  let fixture: ComponentFixture<BrowserDefaultPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      declarations: [BrowserDefaultPopupComponent]
    });
    fixture = TestBed.createComponent(BrowserDefaultPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for YesButtonText and NoButtonText', () => {
    expect(component.YesButtonText).toBe('Leave');
    expect(component.NoButtonText).toBe('Cancel');
  });

  it('should have browserPopupHeaderText and browserPopupBodyText from Constants', () => {
    expect(component.browserPopupHeaderText).toBe(Constants.browserPopupHeaderText);
    expect(component.browserPopupBodyText).toBe(Constants.browserPopupBodyText);
  });

  it('should call openPopup on CustomBrowserPopupComponent when triggerOpen is called', () => {
    const customBrowserPopupComponent = jasmine.createSpyObj('CustomBrowserPopupComponent', ['openPopup']);
    component.customBrowserPopupComponent = customBrowserPopupComponent;
    component.triggerOpen();
    expect(customBrowserPopupComponent.openPopup).toHaveBeenCalled();
  });

  it('should call closePopup on CustomBrowserPopupComponent when triggerClose is called', () => {
    const customBrowserPopupComponent = jasmine.createSpyObj('CustomBrowserPopupComponent', ['closePopup']);
    component.customBrowserPopupComponent = customBrowserPopupComponent;
    component.triggerClose();
    expect(customBrowserPopupComponent.closePopup).toHaveBeenCalled();
  });

  it('should call closePopup on CustomBrowserPopupComponent when triggerCloseBtnIcon is called', () => {
    const customBrowserPopupComponent = jasmine.createSpyObj('CustomBrowserPopupComponent', ['closePopup']);
    component.customBrowserPopupComponent = customBrowserPopupComponent;
    component.triggerCloseBtnIcon();
    expect(customBrowserPopupComponent.closePopup).toHaveBeenCalled();
  });

  it('should emit true and call closePopup on CustomBrowserPopupComponent when triggerCloseBtn is called', () => {
    spyOn(component.onClosePopUp, 'emit');
    const customBrowserPopupComponent = jasmine.createSpyObj('CustomBrowserPopupComponent', ['closePopup']);
    component.customBrowserPopupComponent = customBrowserPopupComponent;
    component.triggerCloseBtn();
    expect(component.onClosePopUp.emit).toHaveBeenCalledWith(true);
    expect(customBrowserPopupComponent.closePopup).toHaveBeenCalled();
  });

  it('should handle popUpClosed event', () => {
    const event = 'some event';
    component.popUpClosed(event);
    expect(component.popUpClosed).toBeDefined();
  });

  it('should not emit any value for onIsUserConfirmed when component is initialized', () => {
    spyOn(component.onIsUserConfirmed, 'emit');
    fixture.detectChanges();
    expect(component.onIsUserConfirmed.emit).not.toHaveBeenCalled();
  });
});