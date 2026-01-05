import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomConfirmationDialogComponent } from './custom-confirmation-dialog.component';
import { CustomPopupComponent } from 'src/app/features/modal/component/custom-popup/custom-popup.component';
import { Constants } from '../constants/constants';

describe('CustomConfirmationDialogComponent', () => {
  let component: CustomConfirmationDialogComponent;
  let fixture: ComponentFixture<CustomConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CustomConfirmationDialogComponent, CustomPopupComponent], // Declare the CustomPopupComponent
    });
    fixture = TestBed.createComponent(CustomConfirmationDialogComponent);
    component = fixture.componentInstance;

    // Manually create and assign the CustomPopupComponent
    const popupFixture = TestBed.createComponent(CustomPopupComponent);
    component.customPopupComponent = popupFixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`deletModalConfirmMessage has default value`, () => {
    expect(component.deletModalConfirmMessage).toEqual(
      Constants.confirmationText
    );
  });

  it(`deletModalMainMessage has default value`, () => {
    expect(component.deletModalMainMessage).toEqual(
      Constants.ConfirmDialogwithDataImportMessage
    );
  });

  it(`buttonYesValue has default value`, () => {
    expect(component.buttonYesValue).toEqual(`Yes`);
  });

  it(`buttonNoValue has default value`, () => {
    expect(component.buttonNoValue).toEqual(`No`);
  });

  it(`isbuttonNoValue has default value`, () => {
    expect(component.isbuttonNoValue).toEqual(false);
  });

  it(`deleteMember has default value`, () => {
    expect(component.deleteMember).toEqual(false);
  });

  it(`isDeleteEngagementByUser has default value`, () => {
    expect(component.isDeleteEngagementByUser).toEqual(false);
  });

  it(`isDeleteUserByEngagement has default value`, () => {
    expect(component.isDeleteUserByEngagement).toEqual(false);
  });

  it(`isDeleteAdminUser has default value`, () => {
    expect(component.isDeleteAdminUser).toEqual(false);
  });

  it(`htmlBody has default value`, () => {
    expect(component.htmlBody).toEqual(false);
  });

  it(`modelTitle has default value`, () => {
    expect(component.modelTitle).toEqual(`Confirmation`);
  });

  // Additional positive test cases

  it('should emit true on onIsUserConfirmed when onbtn2Click is called without any delete flags set', () => {
    spyOn(component.onIsUserConfirmed, 'emit');
    component.onbtn2Click();
    expect(component.onIsUserConfirmed.emit).toHaveBeenCalledWith(true);
  });

  it('should emit true on onDeleteConfirm when deleteMember is true and onbtn2Click is called', () => {
    spyOn(component.onDeleteConfirm, 'emit');
    component.deleteMember = true;
    component.onbtn2Click();
    expect(component.onDeleteConfirm.emit).toHaveBeenCalledWith(true);
  });

  it('should emit true on onDeleteManageEngagement when isDeleteEngagementByUser is true and onbtn2Click is called', () => {
    spyOn(component.onDeleteManageEngagement, 'emit');
    component.isDeleteEngagementByUser = true;
    component.onbtn2Click();
    expect(component.onDeleteManageEngagement.emit).toHaveBeenCalledWith(true);
  });

  it('should emit true on onDeleteUserByEngagement when isDeleteUserByEngagement is true and onbtn2Click is called', () => {
    spyOn(component.onDeleteUserByEngagement, 'emit');
    component.isDeleteUserByEngagement = true;
    component.onbtn2Click();
    expect(component.onDeleteUserByEngagement.emit).toHaveBeenCalledWith(true);
  });

  it('should emit true on onDeleteAdminUser when isDeleteAdminUser is true and onbtn2Click is called', () => {
    spyOn(component.onDeleteAdminUser, 'emit');
    component.isDeleteAdminUser = true;
    component.onbtn2Click();
    expect(component.onDeleteAdminUser.emit).toHaveBeenCalledWith(true);
  });

  // Additional negative test cases

  it('should not emit true on onIsUserConfirmed when deleteMember is true and onbtn2Click is called', () => {
    spyOn(component.onIsUserConfirmed, 'emit');
    component.deleteMember = true;
    component.onbtn2Click();
    expect(component.onIsUserConfirmed.emit).not.toHaveBeenCalledWith(true);
  });

  it('should not emit true on onDeleteConfirm when deleteMember is false and onbtn2Click is called', () => {
    spyOn(component.onDeleteConfirm, 'emit');
    component.deleteMember = false;
    component.onbtn2Click();
    expect(component.onDeleteConfirm.emit).not.toHaveBeenCalledWith(true);
  });

  it('should not emit true on onDeleteManageEngagement when isDeleteEngagementByUser is false and onbtn2Click is called', () => {
    spyOn(component.onDeleteManageEngagement, 'emit');
    component.isDeleteEngagementByUser = false;
    component.onbtn2Click();
    expect(component.onDeleteManageEngagement.emit).not.toHaveBeenCalledWith(true);
  });

  it('should not emit true on onDeleteUserByEngagement when isDeleteUserByEngagement is false and onbtn2Click is called', () => {
    spyOn(component.onDeleteUserByEngagement, 'emit');
    component.isDeleteUserByEngagement = false;
    component.onbtn2Click();
    expect(component.onDeleteUserByEngagement.emit).not.toHaveBeenCalledWith(true);
  });

  it('should not emit true on onDeleteAdminUser when isDeleteAdminUser is false and onbtn2Click is called', () => {
    spyOn(component.onDeleteAdminUser, 'emit');
    component.isDeleteAdminUser = false;
    component.onbtn2Click();
    expect(component.onDeleteAdminUser.emit).not.toHaveBeenCalledWith(true);
  });
});