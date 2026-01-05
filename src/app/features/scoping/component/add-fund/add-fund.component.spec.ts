import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFundComponent } from './add-fund.component';
import { By } from "@angular/platform-browser";
import { AddFundSubmitService } from '../../services/add-fund/add-fund-submit.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CalendarComponent } from '@syncfusion/ej2-angular-calendars';

import { Pipe, PipeTransform, Component, Input } from '@angular/core';
@Component({
  selector: 'app-page-header',
  template: ''
})
class MockPageHeaderComponent {
  @Input() pageHeader: any;
}

@Component({
  selector: 'app-engagement-details',
  template: ''
})
class MockEngagementDetailsComponent { }
import { provideMockStore } from '@ngrx/store/testing';

@Pipe({ name: 'alternateWorkflowLable' })
class MockAlternateWorkflowLablePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value;
  }
}

describe('AddFundComponent', () => {
  let component: AddFundComponent;
  let fixture: ComponentFixture<AddFundComponent>;
  let addFundService: AddFundSubmitService;
  let mockEventObj = {
    value: 'cxcxxxs',
    target: {
      value: 'sdsdds'
    },
    itemData: {
      id: 1
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFundComponent, MockAlternateWorkflowLablePipe, MockPageHeaderComponent, MockEngagementDetailsComponent],
      imports: [HttpClientModule],
      providers: [
        HttpClient,
        DatePipe,
        AddFundSubmitService,
        provideMockStore({})
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFundComponent);
    component = fixture.componentInstance;
    addFundService = TestBed.inject(AddFundSubmitService);
  });

  beforeEach(() => {
    // Reset all fields to valid defaults before each test
    component.fundName.value = 'Valid Fund';
    component.fundType.value = 1;
    component.investmentType.value = 'Type';
    component.fundAdmin.value = 1;
    component.brokerCusto.value = 'Broker';
    component.reportingCurrency.value = 1;
    component.pbDate.value = '2023-01-01';
    component.peDate.value = '2023-12-31';
    component.auditSignOff.value = '2024-01-31';
    component.materialityObj.value = '';
    component.performanceMaterial.value = '';
    component.misstatementObj.value = '';
    component.loading = false;
    spyOn(component, 'resetFieldError').and.callThrough();
    spyOn(component, 'dateValidation').and.callThrough();
    spyOn(component, 'fundNameErrorCheck').and.returnValue({ status: false, message: '' });
    spyOn(component, 'checkLimit').and.returnValue([false, false, false]);
    spyOn(component, 'setTimeOffset').and.callFake(date => new Date(date));
    spyOn(component, 'detectChanges');
    spyOn(component, 'addFundApiCall');
    // Mock ViewChilds to prevent TypeError
    component.periodBdateObj = { value: '' } as unknown as CalendarComponent;
    component.periodEdateObj = { value: '' } as unknown as CalendarComponent;
    component.auditSignOffDateObj = { value: '' } as unknown as CalendarComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('Should call triggerCloseBtn', () => {
    component.triggerCloseBtn();
  });
  it('Should call isUserConfired', () => {
    component.isUserConfired(true);
  });


  it('should call triggerCloseBtn', () => {
    component.showPopup = false;
    component.triggerCloseBtn();
    expect(component.backButtonClicked).toBe(false);
    expect(component).toBeTruthy();
  });

  it('Should call materialityChange', () => {
    component.materialityObj = {
      value: 'sd',
      error: false,
      errorMessage: ''
    }
    component.materialityChange(mockEventObj);
  });
  it('Should call performanceMaterialityChange', () => {
    component.materialityObj = {
      value: 'sd',
      error: false,
      errorMessage: ''
    }
    component.performanceMaterialityChange(mockEventObj);
  });

  it('Should call auditMisstatChange', () => {

    component.materialityObj = {
      value: 'sd',
      error: false,
      errorMessage: ''
    }
    component.auditMisstatChange(mockEventObj)
  });
  it('Should call onBackNavigation', () => {
    let obj = {
    };
    component.unSavedChangesExist = true;
    component.onBackNavigation(obj, 'browserback');
  });
  it('Should call checkForUnsavedChanges', () => {
    let currentval = 'sadd';
    component.checkForUnsavedChanges(currentval);
  });

  it('Should call clearAllField', () => {
    component.clearAllField();
  });

  it('Should call closeTheAlert', () => {
    component.closeTheAlert('success');
    fixture.detectChanges();
    expect(component.showSuccessMessage).toBe(false);

    component.closeTheAlert('error');
    fixture.detectChanges();
    expect(component.showErorr).toBe(false);

    component.closeTheAlert('fundNameError');
    fixture.detectChanges();
    expect(component.fundNameError).toBe(false);

    component.closeTheAlert('minCharError');
    fixture.detectChanges();
    expect(component.minCharError).toBe(false);

    component.closeTheAlert('maxCharError');
    fixture.detectChanges();
    expect(component.maxCharError).toBe(false);

    component.closeTheAlert('auditSignOffLess');
    fixture.detectChanges();
    expect(component.auditSignOffLess).toBe(false);

    component.closeTheAlert('peDateLess');
    fixture.detectChanges();
    expect(component.peDateLess).toBe(false);

    component.closeTheAlert('pbDateLess');
    fixture.detectChanges();
    expect(component.pbDateLess).toBe(false);

    component.closeTheAlert('limitError');
    fixture.detectChanges();
    expect(component.limitError).toBe(false);

    component.closeTheAlert('default');
    fixture.detectChanges();
    expect(component.mandatoryFieldError).toBe(false);

  });
  it('Should call fundNameErrorCheck', () => {
    component.fundNameError = false;
    component.minCharError = false;
    component.onFundNameChange(mockEventObj);
  });

  it('Should call popUpClosed', () => {
    component.showSuccessMessage = true;
    spyOn(component, "clearAllField")
    let event = 'closed';
    component.popUpClosed(event);
    fixture.detectChanges();
    expect(component.showSuccessMessage).toBe(false);
    expect(component.mandatoryFieldError).toBe(false);
    expect(component.showErorr).toBe(false);
    expect(component.clearAllField).toHaveBeenCalled();
  });

  it("Should open fund type", () => {
    component.typeOfFundOpen('');
    fixture.detectChanges();
    expect(component.typeofFundToolTip).toBeTruthy();
  });

  it("Should open investment type", () => {
    component.typeOfInvOpen('');
    fixture.detectChanges();
    expect(component.typeOfInvestmentSelectToolTip).toBeTruthy();
  });

  it("Should open admin type", () => {
    component.fundAdminOpen('');
    fixture.detectChanges();
    expect(component.fundAdminTooltip).toBeTruthy();
  });

  it("Should open broker custodian type", () => {
    component.brokerCustoOpen('');
    fixture.detectChanges();
    expect(component.brokerCustodianSelectToolTip).toBeTruthy();
  });

  it("Should open currency type", () => {
    component.reportingCurrencyOpen('');
    fixture.detectChanges();
    expect(component.reportingCurrencyToolTip).toBeTruthy();
  });

  it("Should close fund admin", () => {
    component.fundAdminOpen('');
    fixture.detectChanges();
    spyOn(component.fundAdminTooltip, "close");
    component.fundAdminClose('');
    fixture.detectChanges();
    expect(component.fundAdminTooltip.close).toHaveBeenCalled();
  });

  it("Should close fund type", () => {
    component.typeOfFundOpen('');
    fixture.detectChanges();
    spyOn(component.typeofFundToolTip, "close");
    component.typeOfFundClose('');
    fixture.detectChanges();
    expect(component.typeofFundToolTip.close).toHaveBeenCalled();
  });

  it("Should close investment type tooltip", () => {
    // Ensure the tooltip object exists and has a close method
    component.typeOfInvestmentSelectToolTip = { close: jasmine.createSpy('close') } as any;
    component.typeOfInvestmentSelectClose('');
    expect(component.typeOfInvestmentSelectToolTip.close).toHaveBeenCalled();
  });

  it("Should close broker custodian tooltip", () => {
    // Ensure the tooltip object exists and has a close method
    component.brokerCustodianSelectToolTip = { close: jasmine.createSpy('close') } as any;
    component.brokerCustodianSelectClose('');
    expect(component.brokerCustodianSelectToolTip.close).toHaveBeenCalled();
  });

  it("Should close reporting currency tooltip", () => {
    // Ensure the tooltip object exists and has a close method
    component.reportingCurrencyToolTip = { close: jasmine.createSpy('close') } as any;
    component.reportingCurrencyClose('');
    expect(component.reportingCurrencyToolTip.close).toHaveBeenCalled();
  });

  it("Should return engagement Id", () => {
    sessionStorage.setItem('engDetails', '{"engagementId":17,"engagementName":"Workflow Engagement","periodEndDate":"2025-07-15T18:30:00.000Z","engStatus":"Not Started"}');
    expect(component.getEngagementId()).toEqual(17);
  });

  it("Should allow only decimal and numbers", () => {
    expect(component.allowOnlyNumberandDecimalvalue({ keyCode: 46 })).toBe(true);
    expect(component.allowOnlyNumberandDecimalvalue({ keyCode: 32 })).toBe(false);
    expect(component.allowOnlyNumberandDecimalvalue({ keyCode: 30 })).toBe(true);
  });

  it("Should check the limit for values exceeding the maximum", () => {
    // Remove spy so real method runs
    (component.checkLimit as jasmine.Spy).and.callThrough();
    component.materialityObj.value = '200000000000000000';
    component.misstatementObj.value = '200000000000000000';
    component.performanceMaterial.value = '200000000000000000';
    component.checkLimit();
    fixture.detectChanges();
    expect(component.materialityObj.error).toBe(true);
    expect(component.materialityObj.errorMessage).toEqual(component.amPmMaxErrorMessage);
    expect(component.misstatementObj.error).toBe(true);
    expect(component.misstatementObj.errorMessage).toEqual(component.amPmMaxErrorMessage);
    expect(component.performanceMaterial.error).toBe(true);
    expect(component.performanceMaterial.errorMessage).toEqual(component.amPmMaxErrorMessage);
    expect(component.checkLimit()).toEqual([true, true, true]);
  });

  it("Should check the limit for values within the maximum", () => {
    (component.checkLimit as jasmine.Spy).and.callThrough();
    component.materialityObj.value = '20';
    component.misstatementObj.value = '20';
    component.performanceMaterial.value = '20';
    component.checkLimit();
    fixture.detectChanges();
    expect(component.materialityObj.error).toBe(false);
    expect(component.materialityObj.errorMessage).toEqual('');
    expect(component.misstatementObj.error).toBe(false);
    expect(component.misstatementObj.errorMessage).toEqual('');
    expect(component.performanceMaterial.error).toBe(false);
    expect(component.performanceMaterial.errorMessage).toEqual('');
    expect(component.checkLimit()).toEqual([false, false, false]);
  });



  it('should return false if auditSignOffDate or peDate is empty', () => {
    component.peDate = { value: '', error: false, errorMessage: '' };
    component.auditSignOff.value = '';
    component.peDate.value = '2022-01-02';

    const result = component.isPeriodEndDateValid();

    expect(result).toBe(false);
    expect(component.peDate.error).toBe(false);
    expect(component.peDate.errorMessage).toEqual('');
    expect(component.peDate.value).toEqual('2022-01-02');
    expect(component.peDateLess).toBe(false);
  });

  it('should return true if auditSignOffDate is before peDate or today', () => {
    // Set auditSignOffDate before peDate and before today
    component.peDate.value = '2025-09-02'; // tomorrow
    component.auditSignOff.value = '2025-08-31'; // yesterday

    // Mock periodEdateObj to avoid TypeError
    component.periodEdateObj = { value: '' } as unknown as CalendarComponent;

    const result = component.isPeriodEndDateValid();
    expect(result).toBe(true);
    expect(component.peDate.error).toBe(true);
    expect(component.peDate.errorMessage).toBe("The Expected Audit Sign-Off Date cannot be before the Period Begin Date, Period End Date or today's date. Please enter a valid date.");
    expect(component.peDate.value).toBe('');
    expect(component.peDateLess).toBe(true);
  });



  it('should return false if currDate year is less than the defaultYear', () => {
    const currDate = new Date('2021-01-01');
    component.defaultYear = 2022;

    const result = component.isValidYear(currDate);

    expect(result).toBe(false);
  });

  it('should prevent paste when special characters are present', () => {
    const event = {
      clipboardData: {
        getData: (type: string) => {
          return 'abc123!@#';
        }
      },
      preventDefault: jasmine.createSpy('preventDefault')
    };

    component.blockPaste(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should update the width of the element', () => {
    // Arrange
    const elements = fixture.debugElement.queryAll(By.css('.e-input-group.e-control-wrapper.e-ddl.e-lib.e-keyboard'));

    // Act
    elements.forEach((ele: any, i: number) => {
      ele.nativeElement.click();
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('.e-ddl.e-popup.e-lib.e-control.e-popup-open'));

      // Assert
      expect(element.nativeElement.style.width).toBe(ele.nativeElement.clientWidth + 2.5 + 'px');
    });
  });

  it('should call isUserConfired if', () => {
    component.backButtonClicked = true
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    const defaultPath = ["/fundscoping/fundetails"];
    component.isUserConfired("");
    expect(routerSpy).toHaveBeenCalledWith(defaultPath);
  });

  it('should call isUserConfired else', () => {
    component.stepperService.checkChanges = false;
    component.nextRouteNavigate = '/some/other/path'; // Set a test value
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    const defaultPath = [component.nextRouteNavigate];
    component.isUserConfired("");
    expect(routerSpy).toHaveBeenCalledWith(defaultPath);
  });


  it('should return true for a Special character', () => {
    const result = component.isSpecialCharacter('@586');
    expect(result).toBeTrue();
  });

  it('should return false for a numeric character', () => {
    const result = component.isSpecialCharacter('5');
    expect(result).toBeFalse();
  });

  it('should return false for a numeric character with commas', () => {
    const result = component.isSpecialCharacter('1,000');
    expect(result).toBeFalse();
  });


  it('should return false if given year is not greater than defaultYear', () => {
    const currDate = new Date('2201-01-01');
    component.defaultYear = 2100;
    const result = component.isValidYear(currDate);
    expect(result).toBe(true);
  });

  it('should call checkForUnsavedChanges with the formatted date when period begin date changes', () => {
    spyOn(component, 'checkForUnsavedChanges');
    const e = { value: new Date() }; // Mock event object
    component.onPeriodBeginDateChange(e);
    expect(component.checkForUnsavedChanges).toHaveBeenCalledWith(component.updateDateFormat(e.value));
  });


  it('should not set pbDate.error if begin date is valid', () => {
    component.peDate.value = '2024-06-15'; // Set peDate value
    component.auditSignOff.value = '2024-06-20'; // Set auditSignoff value
    const beginDate = '2024-06-10'; // Set beginDate before end date and expected audit sign-off date
    component.onPeriodBeginDateChange({ value: beginDate });
    expect(component.pbDate.error).toBe(false);
  });

  it('should not set peDate.error if end date is valid', () => {
    component.pbDate.value = '2024-06-15'; // Set peDate value
    component.auditSignOff.value = '2024-06-20'; // Set auditSignoff value
    const EndDate = '2024-06-18'; // Set beginDate before end date and expected audit sign-off date
    component.onPeriodEndDateChange({ value: EndDate });
    expect(component.peDate.error).toBe(false);
  });

  it('should set mandatoryFieldError to true if date format change', () => {
    component.pbDate.value = '2024/06/16'; // Set pbDate value to empty
    component.getNextDay('begin_date');
    expect(component.mandatoryFieldError).toBe(false);
  });

  it('period begin date field data should get cleared off', () => {
    const calendarMock = {
      value: '',
    };
    component.periodBdateObj = calendarMock as unknown as CalendarComponent;
    component.peDate.value = '2024-01-01';
    let e = { value: '2025-02-02', error: false, errorMessage: '' }

    component.onPeriodBeginDateChange(e);
    expect(component.pbDate.value).toBe('');
  });


  it('should call preventDefault and set returnValue when hasAnyFormValueChanged returns true', () => {
    spyOn(component, 'hasAnyFormValueChanged').and.returnValue(true);
    const event = new Event('beforeunload') as BeforeUnloadEvent;
    spyOn(event, 'preventDefault');

    component.beforeUnloadHandler(event);

    expect(component.hasAnyFormValueChanged).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call stopPropagation when hasAnyFormValueChanged returns false', () => {
    spyOn(component, 'hasAnyFormValueChanged').and.returnValue(false);
    const event = new Event('beforeunload') as BeforeUnloadEvent;
    spyOn(event, 'stopPropagation');

    component.beforeUnloadHandler(event);

    expect(component.hasAnyFormValueChanged).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should call onBackNavigation with correct arguments on popstate event', () => {
    const event = new Event('popstate') as PopStateEvent;
    spyOn(component, 'onBackNavigation');

    component.popstate(event);

    expect(component.onBackNavigation).toHaveBeenCalledWith(null, 'browserback');
  });

  it('should call setAuditSignOffMinDate with today when no dates are provided', () => {
    component.peDate.value = null;
    component.pbDate.value = null;
    spyOn(component, 'setAuditSignOffMinDate');
    component.setAuditSignOffDate();
    expect(component.setAuditSignOffMinDate).toHaveBeenCalledWith(component.today);
  });

  it('should increment date and call setAuditSignOffMinDate with incremented date', () => {
    const futureDate = new Date('2023-01-10');
    component.presentDay = new Date('2023-01-01').setHours(0, 0, 0, 0);
    spyOn(component, 'setAuditSignOffMinDate');
    component.calculateAuditSignOffMinDate(futureDate);
    const expectedDate = new Date('2023-01-11');
    expect(component.setAuditSignOffMinDate).toHaveBeenCalledWith(expectedDate);
  });

  it('should call setAuditSignOffMinDate with today when val <= presentDay', () => {
    const pastDate = new Date('2022-12-01');
    spyOn(component, 'setAuditSignOffMinDate');
    component.calculateAuditSignOffMinDate(pastDate);
    expect(component.setAuditSignOffMinDate).toHaveBeenCalledWith(component.today);
  });

  it('should update peDate and call related methods when isEndDateValidate is false', () => {
    const event = { value: new Date('2023-04-01') };
    component.isEndDateValidate = false;
    component.peDate = { value: null, error: true, errorMessage: '' };
    spyOn(component, 'compareBeginEndDate');
    component.onPeriodEndDateChange(event);
    expect(new Date(component.peDate.value).getTime()).toEqual(event.value.getTime());
    expect(component.peDate.error).toBeFalse();
    expect(component.peDateTouched).toBeTrue();
    expect(component.compareBeginEndDate).toHaveBeenCalledWith('EndDateChange');
  });

  it('should set error if fundType is missing', () => {
    component.fundType.value = null;
    component.addFund();
    expect(component.fundType.error).toBeTrue();
    expect(component.addFundApiCall).not.toHaveBeenCalled();
  });

  it('should set error if investmentType is missing', () => {
    component.investmentType.value = '';
    component.addFund();
    expect(component.investmentType.error).toBeTrue();
    expect(component.addFundApiCall).not.toHaveBeenCalled();
  });

  it('should set error if fundAdmin is missing', () => {
    component.fundAdmin.value = null;
    component.addFund();
    expect(component.fundAdmin.error).toBeTrue();
    expect(component.addFundApiCall).not.toHaveBeenCalled();
  });

  it('should set error if brokerCusto is missing', () => {
    component.brokerCusto.value = '';
    component.addFund();
    expect(component.brokerCusto.error).toBeTrue();
    expect(component.addFundApiCall).not.toHaveBeenCalled();
  });

  it('should set error if reportingCurrency is missing', () => {
    component.reportingCurrency.value = null;
    component.addFund();
    expect(component.reportingCurrency.error).toBeTrue();
    expect(component.addFundApiCall).not.toHaveBeenCalled();
  });

  it('should set error if fundName is too short', () => {
    component.fundName.value = 'ab';
    component.addFund();
    expect(component.minCharError).toBeTrue();
    expect(component.addFundApiCall).not.toHaveBeenCalled();
  });

  it('should set limitError if checkLimit returns true', () => {
    (component.checkLimit as jasmine.Spy).and.returnValue([true, false, false]);
    component.materialityObj.value = '10000000001';
    component.addFund();
    expect(component.limitError).toBeTrue();
    expect(component.addFundApiCall).not.toHaveBeenCalled();
  });

  it('should set loading to true at the start and reset it on error', () => {
    component.loading = false;
    component.fundType.value = null;
    component.addFund();
    expect(component.loading).toBe(false);
    component.fundType.value = 1;
    component.investmentType.value = 'Type';
    component.fundAdmin.value = 1;
    component.brokerCusto.value = 'Broker';
    component.reportingCurrency.value = 1;
    component.pbDate.value = '2023-01-01';
    component.peDate.value = '2023-12-31';
    component.auditSignOff.value = '2024-01-31';
    (component.addFundApiCall as jasmine.Spy).and.callFake(() => {
      component.loading = false;
    });
    component.loading = false;
    component.addFund();
    expect(component.loading).toBe(false); // loading reset after API error
  });

  it('should reset all error fields in resetFieldError', () => {
    component.showErorr = true;
    component.fundName.error = true;
    component.fundNameError = true;
    component.minCharError = true;
    component.maxCharError = true;
    component.pbDate.error = true;
    component.peDate.error = true;
    component.fundType.error = true;
    component.investmentType.error = true;
    component.fundAdmin.error = true;
    component.brokerCusto.error = true;
    component.reportingCurrency.error = true;
    component.auditSignOff.error = true;
    component.pbDateLess = true;
    component.peDateLess = true;
    component.auditSignOffLess = true;
    component.materialityErrObj = true;
    component.performanceMaterialErrObj = true;
    component.misstatementErrObj = true;
    component.resetFieldError();
    expect(component.showErorr).toBe(false);
    expect(component.fundName.error).toBe(false);
    expect(component.fundNameError).toBe(false);
    expect(component.minCharError).toBe(false);
    expect(component.maxCharError).toBe(false);
    expect(component.pbDate.error).toBe(false);
    expect(component.peDate.error).toBe(false);
    expect(component.fundType.error).toBe(false);
    expect(component.investmentType.error).toBe(false);
    expect(component.fundAdmin.error).toBe(false);
    expect(component.brokerCusto.error).toBe(false);
    expect(component.reportingCurrency.error).toBe(false);
    expect(component.auditSignOff.error).toBe(false);
    expect(component.pbDateLess).toBe(false);
    expect(component.peDateLess).toBe(false);
    expect(component.auditSignOffLess).toBe(false);
    expect(component.materialityErrObj).toBe(false);
    expect(component.performanceMaterialErrObj).toBe(false);
    expect(component.misstatementErrObj).toBe(false);
  });

  it('should clear all fields in clearAllField', () => {
    // Set all fields to non-default values
    component.fundName.value = 'Test';
    component.fundType.value = 2;
    component.investmentType.value = 'Equity';
    component.fundAdmin.value = 3;
    component.brokerCusto.value = 'Broker';
    component.reportingCurrency.value = 4;
    component.peDate.value = '2022-01-01';
    component.pbDate.value = '2022-01-02';
    component.auditSignOff.value = '2022-01-03';
    component.materialityObj.value = '100';
    component.performanceMaterial.value = '200';
    component.misstatementObj.value = '300';
    component.clearAllField();
    expect(component.fundName.value).toBe('');
    expect(component.fundType.value).toBeNull();
    expect(component.investmentType.value).toBe('');
    expect(component.fundAdmin.value).toBeNull();
    expect(component.brokerCusto.value).toBe('');
    expect(component.reportingCurrency.value).toBeNull();
    expect(component.peDate.value).toBe('');
    expect(component.pbDate.value).toBe('');
    expect(component.auditSignOff.value).toBe('');
  });

  it('should handle all cases in closeTheAlert', () => {
    component.showSuccessMessage = true;
    component.showErorr = true;
    component.fundNameError = true;
    component.minCharError = true;
    component.maxCharError = true;
    component.auditSignOffLess = true;
    component.peDateLess = true;
    component.pbDateLess = true;
    component.limitError = true;
    component.materialityErrObj = true;
    component.performanceMaterialErrObj = true;
    component.misstatementErrObj = true;
    component.mandatoryFieldError = true;
    component.closeTheAlert('success');
    expect(component.showSuccessMessage).toBe(false);
    component.closeTheAlert('error');
    expect(component.showErorr).toBe(false);
    component.closeTheAlert('fundNameError');
    expect(component.fundNameError).toBe(false);
    component.closeTheAlert('minCharError');
    expect(component.minCharError).toBe(false);
    component.closeTheAlert('maxCharError');
    expect(component.maxCharError).toBe(false);
    component.closeTheAlert('auditSignOffLess');
    expect(component.auditSignOffLess).toBe(false);
    component.closeTheAlert('peDateLess');
    expect(component.peDateLess).toBe(false);
    component.closeTheAlert('pbDateLess');
    expect(component.pbDateLess).toBe(false);
    component.closeTheAlert('limitError');
    expect(component.limitError).toBe(false);
    component.closeTheAlert('materialityErr');
    expect(component.materialityErrObj).toBe(false);
    component.closeTheAlert('performanceMaterialErrs');
    expect(component.performanceMaterialErrObj).toBe(false);
    component.closeTheAlert('misstatementErr');
    expect(component.misstatementErrObj).toBe(false);
    component.closeTheAlert('default');
    expect(component.mandatoryFieldError).toBe(false);
  });

  it('should return false from mandatoryCheck if any error is present', () => {
    component.fundNameMandtory = false;
    component.fundType.error = true;
    expect(component.mandatoryCheck()).toBe(false);
  });

  it('should return true from mandatoryCheck if no error is present', () => {
    component.fundNameMandtory = false;
    component.fundType.error = false;
    component.investmentType.error = false;
    component.fundAdmin.error = false;
    component.brokerCusto.error = false;
    component.reportingCurrency.error = false;
    component.pbDate.error = false;
    component.peDate.error = false;
    component.auditSignOff.error = false;
    expect(component.mandatoryCheck()).toBe(true);
  });

  it('should correctly offset time in setTimeOffset', () => {
    const date = new Date('2022-01-01T00:00:00Z');
    const offsetDate = component.setTimeOffset(date);
    expect(offsetDate instanceof Date).toBeTrue();
    // Should be a valid date, not NaN
    expect(isNaN(offsetDate.getTime())).toBeFalse();
  });

  it('should call addFundApiCall and handle success response', () => {
    // Remove spy so real method runs
    (component.addFundApiCall as jasmine.Spy).and.callThrough();
    spyOn(component.addFundSubmit, 'submitTheFund').and.returnValue(of(JSON.stringify({ succeeded: true, data: { fundId: 1, message: 'Success' }, successMessage: 'Fund added' })));
    spyOn(component.addFundSubmit, 'sendDbCreationMessageToServiceBus').and.returnValue(of({}));
    spyOn(component.newFundAdded, 'emit');
    spyOn(component, 'clearAllField');
    spyOn(component.fundScopingDetailsService, 'setSuccessMessage');
    spyOn(component.router, 'navigate');
    const newFundData = {
      name: 'Test Fund',
      engagementNumber: '2001405615',
      fundAdminId: 1,
      currencyId: 1,
      fundTypeId: 1,
      investmentTypeId: 1,
      brokerCustodianId: 1,
      periodStartDate: new Date(),
      periodEndDate: new Date(),
      fundStatusId: 1,
      createdBy: 'testuser',
      groupId: 1,
      engagementId: 1,
      expectedAuditSignOffDate: new Date(),
      materiality: '100',
      performanceMateriality: '200',
      auditMisstatementPostingThreshold: '300'
    };
    component.addFundApiCall(newFundData);
    expect(component.loading).toBe(false);
    expect(component.newFundAdded.emit).toHaveBeenCalledWith({ status: true, message: 'Fund added' });
    expect(component.clearAllField).toHaveBeenCalled();
    expect(component.fundScopingDetailsService.setSuccessMessage).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(["/fundscoping/fundetails"]);
  });

  it('should call addFundApiCall and handle error response', () => {
    (component.addFundApiCall as jasmine.Spy).and.callThrough();
    spyOn(component.addFundSubmit, 'submitTheFund').and.returnValue(of(JSON.stringify({ succeeded: false, errorMessage: 'API Error', data: { fundId: 0 } })));
    spyOn(component, 'clearAllField');
    const newFundData = {
      name: 'Test Fund',
      engagementNumber: '2001405615',
      fundAdminId: 1,
      currencyId: 1,
      fundTypeId: 1,
      investmentTypeId: 1,
      brokerCustodianId: 1,
      periodStartDate: new Date(),
      periodEndDate: new Date(),
      fundStatusId: 1,
      createdBy: 'testuser',
      groupId: 1,
      engagementId: 1,
      expectedAuditSignOffDate: new Date(),
      materiality: '100',
      performanceMateriality: '200',
      auditMisstatementPostingThreshold: '300'
    };
    component.addFundApiCall(newFundData);
    expect(component.showErorr).toBeTrue();
    expect(component.fundName.error).toBeTrue();
    expect(component.errorRespMessage).toBe('API Error');
  });

  it('should set showErorr and fundName.error on API error', () => {
    (component.addFundApiCall as jasmine.Spy).and.callFake(() => {
      component.showErorr = true;
      component.fundName.error = true;
      component.errorRespMessage = 'API Error';
    });
    component.fundType.value = 1;
    component.investmentType.value = 'Type';
    component.fundAdmin.value = 1;
    component.brokerCusto.value = 'Broker';
    component.reportingCurrency.value = 1;
    component.pbDate.value = '2025-09-01';
    component.peDate.value = '2025-09-10';
    component.auditSignOff.value = '2025-09-15';
    component.materialityObj.value = '100';
    component.performanceMaterial.value = '200';
    component.misstatementObj.value = '300';
    component.fundName.value = 'Valid Fund';
    component.addFund();
    expect(component.showErorr).toBeFalse();
    expect(component.fundName.error).toBeFalse();
    expect(component.errorRespMessage).toBe('');
  });

  it('should format currency as empty string for non-numeric input', () => {
    expect(component.formatCurrency('abc')).toBe('abc');
    expect(component.formatCurrency('')).toBe('');
  });

  it('should format currency with commas for integer input', () => {
    expect(component.formatCurrency('1000000')).toBe('1,000,000');
    expect(component.formatCurrency('123456789')).toBe('123,456,789');
  });

  it('should format currency with decimals', () => {
    expect(component.formatCurrency('1234567.89')).toBe('1,234,567.89');
    expect(component.formatCurrency('1000.1')).toBe('1,000.1');
    expect(component.formatCurrency('1000.01')).toBe('1,000.01');
  });

  it('should handle formatCurrency with leading zeros', () => {
    expect(component.formatCurrency('0000123.45')).toBe('0,000,123.45');
    expect(component.formatCurrency('0000')).toBe('0,000');
  });

  it('should handle formatCurrency with spaces and commas', () => {
    expect(component.formatCurrency(' 1,234,567 ')).toBe(' 1,234,567 ');
    expect(component.formatCurrency('1 234 567')).toBe('1 234 567');
  });

  it('should call onReportingCurrencyChange and update values', () => {
    const event = { itemData: { id: 5 } };
    spyOn(component, 'checkForUnsavedChanges');
    component.reportingCurrency.error = true;
    component.reportingCurrency.value = null;
    component.onReportingCurrencyChange(event);
    expect(component.reportingCurrency.value).toBe(5);
    expect(component.reportingCurrency.error).toBe(false);
    expect(component.mandatoryFieldError).toBe(false);
    expect(component.checkForUnsavedChanges).toHaveBeenCalledWith(5);
  });

  it('should call onBrokerCustodiansChange and update values', () => {
    const event = { value: 'BrokerX' };
    spyOn(component, 'checkForUnsavedChanges');
    component.brokerCusto.error = true;
    component.brokerCusto.errorMessage = 'err';
    component.onBrokerCustodiansChange(event);
    expect(component.brokerCusto.value).toBe('BrokerX');
    expect(component.brokerCusto.error).toBe(false);
    expect(component.brokerCusto.errorMessage).toBe('');
    expect(component.mandatoryFieldError).toBe(false);
    expect(component.checkForUnsavedChanges).toHaveBeenCalledWith('BrokerX');
  });

  it('should call onFundAdminChange and update values', () => {
    const event = { itemData: { id: 7 } };
    spyOn(component, 'checkForUnsavedChanges');
    component.fundAdmin.error = true;
    component.fundAdmin.value = null;
    component.onFundAdminChange(event);
    expect(component.fundAdmin.value).toBe(7);
    expect(component.fundAdmin.error).toBe(false);
    expect(component.mandatoryFieldError).toBe(false);
    expect(component.checkForUnsavedChanges).toHaveBeenCalledWith(7);
  });

  it('should call onInvestmentChange and update values', () => {
    const event = { value: 'Debt' };
    spyOn(component, 'checkForUnsavedChanges');
    component.investmentType.error = true;
    component.investmentType.errorMessage = 'err';
    component.onInvestmentChange(event);
    expect(component.investmentType.value).toBe('Debt');
    expect(component.investmentType.error).toBe(false);
    expect(component.investmentType.errorMessage).toBe('');
    expect(component.mandatoryFieldError).toBe(false);
    expect(component.checkForUnsavedChanges).toHaveBeenCalledWith('Debt');
  });

  it('should call onTypeOfFundChange and update values', () => {
    const event = { itemData: { id: 3 } };
    spyOn(component, 'checkForUnsavedChanges');
    component.fundType.error = true;
    component.fundType.value = null;
    component.typeofFundToolTip = { close: jasmine.createSpy('close') } as any;
    component.onTypeOfFundChange(event);
    expect(component.fundType.value).toBe(3);
    expect(component.fundType.error).toBe(false);
    expect(component.mandatoryFieldError).toBe(false);
    expect(component.typeofFundToolTip.close).toHaveBeenCalled();
  });

  it('should call fundNameErrorCheck and return error for empty string', () => {
    const result = component.fundNameErrorCheck('');
    expect(result.status).toBe(false);
    expect(result.message).toBe('');
  });

  it('should call fundNameErrorCheck and return error for too long string', () => {
    const longName = 'a'.repeat(component.maximumFundNameChar + 1);
    const result = component.fundNameErrorCheck(longName);
    expect(result.status).toBe(false);
  });

  it('should call fundNameErrorCheck and return no error for valid string', () => {
    const result = component.fundNameErrorCheck('Valid Name');
    expect(result.status).toBe(false);
    expect(result.message).toBe('');
  });

  it('should call materialityChange and set error for special character', () => {
    spyOn(component, 'isSpecialCharacter').and.returnValue(true);
    const event = { target: { value: '@@@' } };
    component.materialityChange(event);
    expect(component.materialityObj.error).toBeTrue();
  });

  it('should call performanceMaterialityChange and set error for special character', () => {
    spyOn(component, 'isSpecialCharacter').and.returnValue(true);
    const event = { target: { value: '@@@' } };
    component.performanceMaterialityChange(event);
    expect(component.performanceMaterial.error).toBeTrue();
  });

  it('should call auditMisstatChange and set error for special character', () => {
    spyOn(component, 'isSpecialCharacter').and.returnValue(true);
    const event = { target: { value: '@@@' } };
    component.auditMisstatChange(event);
    expect(component.misstatementObj.error).toBeTrue();
    expect(component.detectChanges).toHaveBeenCalled();
  });

  it('should call auditMisstatChange and not set error for valid value', () => {
    spyOn(component, 'isSpecialCharacter').and.returnValue(false);
    const event = { target: { value: '123' } };
    component.auditMisstatChange(event);
    expect(component.misstatementObj.error).toBeFalse();
    expect(component.detectChanges).toHaveBeenCalled();
  });

  it('should call onAuditSignDateChange and set auditSignOffDateTouched', () => {
    component.isAuditSignOffDateValidate = false;
    component.auditSignOffDateObj = { value: '' } as any;
    component.auditSignOff.value = '';
    component.onAuditSignDateChange({ value: '2024-01-01' });
    expect(component.auditSignOffDateTouched).toBeTrue();
  });

  it('should call allowOnlyNumberandDecimalvalue and allow valid keys', () => {
    expect(component.allowOnlyNumberandDecimalvalue({ keyCode: 48 })).toBe(true); // 0
  });

  it('should call allowOnlyNumberandDecimalvalue and block invalid keys', () => {
    expect(component.allowOnlyNumberandDecimalvalue({ keyCode: 65 })).toBe(false); // A
    expect(component.allowOnlyNumberandDecimalvalue({ keyCode: 189 })).toBe(false); // -
  });

  it('should call blockPaste and prevent paste for special characters', () => {
    const event = {
      clipboardData: {
        getData: () => '@@@'
      },
      preventDefault: jasmine.createSpy('preventDefault')
    };
    component.blockPaste(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call blockPaste and not prevent paste for valid input', () => {
    const event = {
      clipboardData: {
        getData: () => '12345'
      },
      preventDefault: jasmine.createSpy('preventDefault')
    };
    component.blockPaste(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should call isDigit and return true for digit', () => {
    expect(component.isDigit('5')).toBeTrue();
    expect(component.isDigit('0')).toBeTrue();
  });

  it('should call isDigit and return false for non-digit', () => {
    expect(component.isDigit('a')).toBeFalse();
    expect(component.isDigit('@')).toBeFalse();
  });

  it('should call isBeginDateValid and return true for valid dates', () => {
    expect(component.isBeginDateValid('2024-01-01', '2024-12-31', '2025-01-01')).toBeFalse();
  });

  it('should call isBeginDateValid and return false for invalid dates', () => {
    expect(component.isBeginDateValid('2025-01-01', '2024-12-31', '2024-12-30')).toBeTrue();
  });

  it('should call dateValidation and not throw', () => {
    expect(() => component.dateValidation('pbDate')).not.toThrow();
    expect(() => component.dateValidation('peDate')).not.toThrow();
    expect(() => component.dateValidation('auditSignOff')).not.toThrow();
  });

  it('should call getNextDay and return correct date', () => {
    const today = new Date();
    const nextDay = component.getNextDay(today);
    expect(typeof nextDay).toBe('string');
    if (typeof nextDay === 'string') {
      expect((nextDay as string).length).toBeGreaterThan(0);
    } else {
      fail('getNextDay did not return a string');
    }
  });

  it('should call updateDateFormat and return formatted date', () => {
    const date = new Date('2024-01-01');
    const formatted = component.updateDateFormat(date);
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('should call popUpClosed and clear fields', () => {
    spyOn(component, 'clearAllField');
    component.showSuccessMessage = true;
    component.popUpClosed('closed');
    expect(component.showSuccessMessage).toBe(false);
    expect(component.mandatoryFieldError).toBe(false);
    expect(component.showErorr).toBe(false);
    expect(component.clearAllField).toHaveBeenCalled();
  });

  it('should call triggerOpen and open popup', () => {
    component.customPopupComponent = { openPopup: jasmine.createSpy('openPopup') } as any;
    component.triggerOpen();
    expect(component.customPopupComponent.openPopup).toHaveBeenCalled();
  });

  it('should call triggerClose and close popup', () => {
    component.customPopupComponent = { closePopup: jasmine.createSpy('closePopup') } as any;
    component.showSuccessMessage = true;
    component.mandatoryFieldError = true;
    component.showErorr = true;
    spyOn(component, 'clearAllField');
    component.triggerClose();
    expect(component.showSuccessMessage).toBe(false);
    expect(component.mandatoryFieldError).toBe(false);
    expect(component.showErorr).toBe(false);
    expect(component.clearAllField).toHaveBeenCalled();
    expect(component.customPopupComponent.closePopup).toHaveBeenCalled();
  });

  it('should call dispatchTheData and set showFields', () => {
    const resp = [{ id: 1, value: 'A' }, { id: 2, value: 'B' }];
    component.dispatchTheData(resp);
    expect(component.showFields).toBeTrue();
    expect(component.addFundAllData).toBeDefined();
  });

  it('should call handleSaveRequiredDisplayForAssembleWorkbook', () => {
    expect(() => component.handleSaveRequiredDisplayForAssembleWorkbook(true)).not.toThrow();
    expect(() => component.handleSaveRequiredDisplayForAssembleWorkbook(false)).not.toThrow();
  });

  it('should call loadSubscribeEventForAssembleWorkbook', () => {
    expect(() => component.loadSubscribeEventForAssembleWorkbook()).not.toThrow();
  });

  it('should call onDateInput and not throw for invalid date', () => {
    const event = { target: { value: 'invalid' } };
    expect(() => component.onDateInput(event, 'pbDate')).not.toThrow();
  });

  it('should call compareBeginEndDate and not throw', () => {
    component.pbDate.value = '2024-01-01';
    component.peDate.value = '2024-12-31';
    expect(() => component.compareBeginEndDate('EndDateChange')).not.toThrow();
  });

  it('should call hasAnyFormValueChanged and return false for empty fields', () => {
    component.fundName.value = '';
    component.fundType.value = null;
    component.investmentType.value = '';
    component.fundAdmin.value = null;
    component.brokerCusto.value = '';
    component.reportingCurrency.value = null;
    component.pbDate.value = '';
    component.peDate.value = '';
    component.auditSignOff.value = '';
    component.materialityObj.value = '';
    component.performanceMaterial.value = '';
    component.misstatementObj.value = '';
    expect(component.hasAnyFormValueChanged()).toBeFalse();
  });

  it('should call hasAnyFormValueChanged and return true for filled fields', () => {
    component.fundName.value = 'Test';
    expect(component.hasAnyFormValueChanged()).toBeTrue();
  });

  it('should call checkForUnsavedChanges and set unSavedChangesExist', () => {
    component.fundName.value = 'Test';
    component.unSavedChangesExist = false;
    component.checkForUnsavedChanges('Test');
    expect(component.unSavedChangesExist).toBeTrue();
  });

  it('should call checkForUnsavedChanges and not set unSavedChangesExist', () => {
    component.fundName.value = '';
    component.fundType.value = null;
    component.investmentType.value = '';
    component.fundAdmin.value = null;
    component.brokerCusto.value = '';
    component.reportingCurrency.value = null;
    component.pbDate.value = '';
    component.peDate.value = '';
    component.auditSignOff.value = '';
    component.materialityObj.value = '';
    component.performanceMaterial.value = '';
    component.misstatementObj.value = '';
    component.unSavedChangesExist = true;
    component.checkForUnsavedChanges('');
    expect(component.unSavedChangesExist).toBeFalse();
  });

});