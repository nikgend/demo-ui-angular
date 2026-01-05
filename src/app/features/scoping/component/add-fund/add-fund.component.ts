import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxSelectionService, MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CustomPopupComponent } from '../../../../../app/features/modal/component/custom-popup/custom-popup.component';
import { AddFundSubmitService } from '../../services/add-fund/add-fund-submit.service';
import { AddFundGetDataService } from '../../services/add-fund/add-fund-get-data.service';
import { Subscription } from 'rxjs';
import { Tooltip, TooltipEventArgs } from '@syncfusion/ej2-angular-popups';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { CustomConfirmationDialogComponent } from '../../../../shared/components/custom-confirmation-dialog/custom-confirmation-dialog.component';
import { FundScopingDetailsService } from '../../fundscoping/services/fundscoping-details.service';
import { StepperService } from '../../../../shared/components/stepper/stepper.service';
import { CalendarComponent } from '@syncfusion/ej2-angular-calendars';
import { EnvService } from '../../../../shared/services/env-service/env.service';
import { SharedSubjectService } from '../../../../core/services/CommonService/shared-subject.service';
import { BrowserDefaultPopupComponent } from '../../../../shared/components/custom-confirmation-dialog/browser-default-popup/browser-default-popup.component';
import { Store } from '@ngrx/store';
import { RootReducerState, getEngDetailEntities } from 'src/app/shared/components/engagement-details/engagement-state/reducers';
import { Constants } from 'src/app/shared/components/constants/constants';
import { asyncScheduler } from 'rxjs';
@Component({

  selector: 'app-add-fund',
  templateUrl: './add-fund.component.html',
  styleUrls: ['./add-fund.component.scss'],
  providers: [CheckBoxSelectionService]
})
export class AddFundComponent implements OnInit, OnDestroy, AfterViewInit {
  addFundGetData!: Subscription;
  addFundSubmitData!: Subscription
  public typeofFundToolTip!: Tooltip;
  public fundAdminTooltip!: Tooltip;
  public reportingCurrencyToolTip!: Tooltip;
  public typeOfInvestmentSelectToolTip!: Tooltip;
  public brokerCustodianSelectToolTip!: Tooltip;

  content: any;
  fundAdminContent: any;
  previousUrl!: string;
  auditSignOffLess: boolean = false;
  editEngagementIdValue: any;
  peDateLess: boolean = false;
  pbDateLess: boolean = false;
  pbDateTouched: boolean = false;
  peDateTouched: boolean = false;
  auditSignOffDateTouched: boolean = false;
  public timeInterval: any;
  public nextRouteNavigate: any;
  public backButtonClicked: boolean = false;
  loading: boolean = false;
  public defaultYear: any = EnvService.calenderMaxDate.substring(0, 4);
  counter: number = 0;
  constructor(
    public store: Store<RootReducerState>,
    private changeDetector: ChangeDetectorRef,
    public addFundSubmit: AddFundSubmitService,
    public addFundGet: AddFundGetDataService,
    public router: Router,
    public fundScopingDetailsService: FundScopingDetailsService,
    public stepperService: StepperService,
    private sharedSubjectService: SharedSubjectService

  ) {
    this.stepperService.updateStepperEventValue$.subscribe((val: any) => {
      if (this.unSavedChangesExist) {
        this.showPopup = true;
        this.detectChanges();
        this.CustomConfirmationDialogComponent?.triggerOpen();
        this.nextRouteNavigate = val;
      }
    })

    window.addEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
    window.addEventListener('popstate', this.popstate.bind(this));
    this.updateState();
  }

  updateState(): void {
    history.pushState({ counter: this.counter }, '', window.location.href);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {  //refresh
    if (this.hasAnyFormValueChanged()) {
      event.preventDefault();
      event.returnValue = '';
    } else {
      event.stopPropagation();
    }
  }

  @HostListener('window:popstate', ['$event'])
  popstate(event: PopStateEvent) {  //back
    this.onBackNavigation(null, 'browserback');
  }

  //set dropdown field key & value.
  public dropDownDataFormat = { text: 'value', value: 'id', tooltip: 'id' };

  //set DataSource for dropDown.
  public addFundAllData: any;
  public showFields: boolean = false;
  //Date Picker
  public datePickerMask: boolean = true;
  public datePickerMskValue: Object = { day: 'd', month: 'M', year: 'y' }
  public maximumFundNameChar: number = 200;
  @ViewChild(CustomPopupComponent) customPopupComponent!: CustomPopupComponent;

  @ViewChild(BrowserDefaultPopupComponent) BrowserDefaultPopupComponent!: BrowserDefaultPopupComponent;

  @ViewChild('checkbox')
  public mulObj!: MultiSelectComponent;
  @ViewChild('selectall')
  public checkboxObj!: CheckBoxComponent;
  @ViewChild('dropdown')
  public dropdownObj!: CheckBoxComponent;
  @ViewChild('select')
  public reorderObj!: CheckBoxComponent;
  @ViewChild('periodBdate') periodBdateObj!: CalendarComponent;
  @ViewChild('periodEdate') periodEdateObj!: CalendarComponent;
  @ViewChild('auditSignOffDate') auditSignOffDateObj!: CalendarComponent;
  @ViewChild('periodEdate') periodEdate!: ElementRef<HTMLInputElement>;
  @ViewChild('auditSignOffDate') auditSignOffDate!: ElementRef<HTMLInputElement>;
  @Output() newFundAdded = new EventEmitter<Object>();


  addFundTitle: string = 'Add Fund';
  showSuccessMessage = false;
  successResponse = '';
  showErorr = false;
  errorRespMessage: string = '';
  fundNameError: Boolean = false;
  fundNameMandtory: Boolean = false;
  minCharError: Boolean = false;
  maxCharError: boolean = false;
  fundNameErrorMessage: any = '';
  minCharErrorMessage: any = '';
  maxCharErrorMesage: string = '';
  isBeginDateValidate: boolean = false;
  isEndDateValidate: boolean = false;
  isAuditSignOffDateValidate: boolean = false;

  public fundName = {
    value: '',
    error: false,
    errorMessage: ''
  }
  // set placeholder to MultiSelect input element
  public placeholder: string = '';

  public multiSelectMode: string = 'delimiter';
  public mode = '';

  public today = new Date();
  public tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  month = (this.tomorrow.getMonth() + 1);
  periodMaxDate = formatDate(this.today, Constants.dateFormatUsedForConvertingDate, Constants.USregion);
  public periodMaxYear = Constants.defaultMaxDate;
  public endDateMin: any = `${this.tomorrow.getFullYear()}-${this.month > 9 ? this.month : '0' + this.month}-${this.tomorrow.getDate() > 9 ? this.tomorrow.getDate() : '0' + this.tomorrow.getDate()}`;
  public auditSignOffDateMin: any = `${this.tomorrow.getFullYear()}-${this.month > 9 ? this.month : '0' + this.month}-${this.tomorrow.getDate() > 9 ? this.tomorrow.getDate() : '0' + this.tomorrow.getDate()}`;
  auditSignOffMinDate: any;
  presentDay = this.today.setHours(0, 0, 0, 0);
  
  public pbDate = {
    value: '',
    error: false,
    errorMessage: ''
  }
  public peDate = {
    value: '',
    error: false,
    errorMessage: ''
  }
  public auditSignOff = {
    value: '',
    error: false,
    errorMessage: ''
  }
  public reportingCurrency = {
    value: null,
    error: false,
    errorMessage: ''
  }
  public brokerCusto = {
    value: '',
    error: false,
    errorMessage: ''
  }
  public fundAdmin = {
    value: null,
    error: false,
    errorMessage: ''
  }
  public investmentType = {
    value: '',
    error: false,
    errorMessage: ''
  }
  public fundType = {
    value: null,
    error: false,
    errorMessage: ''
  }

  public materialityObj = {
    value: '',
    error: false,
    errorMessage: ''
  }
  public performanceMaterial = {
    value: '',
    error: false,
    errorMessage: ''
  }
  public misstatementObj = {
    value: '',
    error: false,
    errorMessage: ''
  }
  public mandatoryFieldError = false;
  public mandatoryMessage = 'Mandatory fields. Please enter valid details and proceed.';
  public deletModalTitle: string = "Save Required";
  public deleteModalMessage: string = "Are you sure you want to leave this page without saving?";
  public showPopup: boolean = false;
  public showBrowserPopup: boolean = false;
  @ViewChild(CustomConfirmationDialogComponent) CustomConfirmationDialogComponent!: CustomConfirmationDialogComponent;
  @Output() onClosePopUp = new EventEmitter<boolean>(false);
  public unSavedChangesExist: boolean = false;
  public readonly amPmMax: number = 10000000000;
  public readonly amPmMaxErrorMessage: string = 'Maximum value is 10,000,000,000';
  public limitError: boolean = false;
  public materialityErrObj: boolean = false;
  public performanceMaterialErrObj: boolean = false;
  public misstatementErrObj: boolean = false;
  public readonly invalidVal: string = 'is not a valid input';
  ngOnInit(): void {

    //Save required dialogbox for assembleWorkbook
    this.loadSubscribeEventForAssembleWorkbook();
    this.mode = 'CheckBox'

    this.getEngagementData();
    this.setAuditSignOffMinDate(this.today);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      document.querySelectorAll(".e-input-group.e-control-wrapper.e-ddl.e-lib.e-keyboard").forEach((ele: any, i: number) => {
        document.querySelectorAll(".e-input-group.e-control-wrapper.e-ddl.e-lib.e-keyboard")[i].addEventListener('click', () => {
          let element: HTMLElement = document.querySelectorAll('.e-ddl.e-popup.e-lib.e-control.e-popup-open')[0] as HTMLElement;
          if (element) {
            element.style.width = ele.clientWidth + 2.5 + "px";
          }
        })
      })
    }, 1000)

  }

  getEngagementData() {
    this.store.select(getEngDetailEntities).subscribe((result: any) => {
      this.fetchAllData(result);
    });
  }

  ngOnDestroy(): void {

    this.stepperService.checkChanges = false;
    if (this.addFundGetData) {
      this.addFundGetData.unsubscribe();
    }
    if (this.addFundSubmitData) {
      this.addFundSubmitData.unsubscribe();
    }
    if (this.sharedSubjectService.saveRequiredDialogForAssembleWorkbook) {
      // this.sharedSubjectService.saveRequiredDialogForAssembleWorkbook.unsubscribe();
      this.sharedSubjectService.deleteLocalStorageItem(this.sharedSubjectService.assembleWorkbookStorageKey)
    }
    window.removeAllListeners('beforeunload');
    window.removeAllListeners('popstate');
  }
  public beforeRender(args: any): void {
    let listElement: any = document.getElementById('fundAdministrator');
    let result: any = listElement.ej2_instances[0].dataSource;
    let i: number;
    for (i = 0; i < result.length; i++) {
      if (result[i].value === args.target.textContent) {
        this.content = result[i].value;
        if (args.target.offsetWidth >= args.target.scrollWidth) {
          args.cancel = true;
        }
        break;
      }
    }
  }
  public formatDate(event: any): void {
    let input = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (input.length > 2) input = input.slice(0, 2) + '/' + input.slice(2);
    if (input.length > 5) input = input.slice(0, 5) + '/' + input.slice(5);
    event.target.value = input;
  }
  public typeOfFundRender(args: TooltipEventArgs): void {
    let listElement: any = document.getElementById('typeofFund');
    let result: any = listElement.ej2_instances[0].dataSource;
    let i: number;
    for (i = 0; i < result.length; i++) {
      if (result[i].value === args.target.textContent) {
        this.content = result[i].value;
        if (args.target.offsetWidth >= args.target.scrollWidth) {
          args.cancel = true;
        }
        break;
      }
    }
  }
  public reportingCurrencyRender(args: TooltipEventArgs): void {
    let listElement: any = document.getElementById('reportingCurrency');
    let result: any = listElement.ej2_instances[0].dataSource;
    let i: number;
    for (i = 0; i < result.length; i++) {
      if (result[i].value === args.target.textContent) {
        this.content = result[i].value;
        if (args.target.offsetWidth >= args.target.scrollWidth) {
          args.cancel = true;
        }
        break;
      }
    }
  }
  public typeOfInvestmentSelectRender(args: TooltipEventArgs): void {
    let listElement: any = document.getElementById('typeOfInvestmentSelect');
    let result: any = listElement.ej2_instances[0].dataSource;
    let i: number;
    for (i = 0; i < result.length; i++) {
      if (result[i].value === args.target.textContent) {
        this.content = result[i].value;
        if (args.target.offsetWidth >= args.target.scrollWidth) {
          args.cancel = true;
        }
        break;
      }
    }
  }
  public brokerCustodianSelectRender(args: TooltipEventArgs): void {
    let listElement: any = document.getElementById('brokerCustodianSelect');
    let result: any = listElement.ej2_instances[0].dataSource;
    let i: number;
    for (i = 0; i < result.length; i++) {
      if (result[i].value === args.target.textContent) {
        this.content = result[i].value;
        if (args.target.offsetWidth >= args.target.scrollWidth) {
          args.cancel = true;
        }
        break;
      }
    }
  }
  typeOfFundOpen(args: any) {
    this.typeofFundToolTip = new Tooltip({
      content: 'Loading....',
      target: '#typeofFund_popup .e-list-item',
      beforeRender: this.typeOfFundRender
    })
    this.typeofFundToolTip.appendTo('body');
  }
  typeOfInvOpen(args: any) {
    this.typeOfInvestmentSelectToolTip = new Tooltip({
      content: '',
      target: '#typeOfInvestmentSelect_popup .e-list-item',
      beforeRender: this.typeOfInvestmentSelectRender
    })
    this.typeOfInvestmentSelectToolTip.appendTo('body');
  }
  fundAdminOpen(args: any) {
    this.fundAdminTooltip = new Tooltip({
      content: 'Loading...',
      target: '#fundAdministrator_popup .e-list-item',
      beforeRender: this.beforeRender,
    })
    this.fundAdminTooltip.appendTo('body');
  }
  brokerCustoOpen(args: any) {
    this.brokerCustodianSelectToolTip = new Tooltip({
      content: '',
      target: '#brokerCustodianSelect_popup .e-list-item',
      beforeRender: this.brokerCustodianSelectRender
    })
    this.brokerCustodianSelectToolTip.appendTo('body');
  }
  reportingCurrencyOpen(args: any) {
    this.reportingCurrencyToolTip = new Tooltip({
      content: '',
      target: '#reportingCurrency_popup .e-list-item',
      beforeRender: this.reportingCurrencyRender
    })
    this.reportingCurrencyToolTip.appendTo('body');
  }
  fundAdminClose(e: any) {
    this.fundAdminTooltip.close();
    const toolElement = document.getElementsByClassName('e-tooltip-wrap e-popup-open');
    toolElement[0]?.classList.remove('e-popup-open');
  }
  typeOfFundClose(e: any) {
    this.typeofFundToolTip.close();
    const toolElement = document.getElementsByClassName('e-tooltip-wrap e-popup-open');
    toolElement[0]?.classList.remove('e-popup-open');
  }
  reportingCurrencyClose(e: any) {
    this.reportingCurrencyToolTip.close();
    const toolElement = document.getElementsByClassName('e-tooltip-wrap e-popup-open');
    toolElement[0]?.classList.remove('e-popup-open');
  }
  typeOfInvestmentSelectClose(e: any) {
    this.typeOfInvestmentSelectToolTip.close();
    const toolElement = document.getElementsByClassName('e-tooltip-wrap e-popup-open');
    toolElement[0]?.classList.remove('e-popup-open');
  }
  brokerCustodianSelectClose(e: any) {
    this.brokerCustodianSelectToolTip.close();
    const toolElement = document.getElementsByClassName('e-tooltip-wrap e-popup-open');
    toolElement[0]?.classList.remove('e-popup-open');
  }
  public fetchAllData(engagementData: any) {
    this.addFundGetData = this.addFundGet.getData(engagementData.engagementTypeId).subscribe(
      (response) => {
        let resource = [];
        resource.push(response);
        let filterresult: string | any[] = [];
        this.showErorr = false;
        if (resource.length > 0) {
          resource.forEach((ele: any) => {
            filterresult = ele.data;
          })
        }
        this.dispatchTheData(filterresult);
      },
      (error) => {
        this.showErorr = true;
        this.errorRespMessage = error;
      }
    )
  }
  public dispatchTheData(resp: any) {
    let Finaldata: any = {}
    resp.map((item: any) => {
      Finaldata[item.type] = { data: item.items };
    });
    this.addFundAllData = Finaldata;
    this.showFields = true;

  }
  triggerOpen() {
    this.customPopupComponent.openPopup();
  }
  triggerClose() {
    this.showSuccessMessage = false;
    this.mandatoryFieldError = false;
    this.showErorr = false;
    this.clearAllField();
    this.customPopupComponent.closePopup();
  }
  popUpClosed(event: String) {
    //Close the pop up on Escape key press
    if (this.showSuccessMessage && event === 'closed') {
      this.showSuccessMessage = false;
    }
    this.mandatoryFieldError = false;
    this.showErorr = false;
    this.clearAllField();
  }
  getNextDay(data: any): void {
    let tomorrow: any;
    const today = new Date(data);
    let currentDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    tomorrow = `${year}/${month > 9 ? month : '0' + month}/${day > 9 ? day : '0' + day}`;
    return tomorrow;
  }
  updateDateFormat(myDate: Date): string {
    if (myDate) {
      return formatDate(myDate, 'yyyy-MM-dd', 'en_US')
    }
    return '';
  }
  onPeriodBeginDateChange = (e: any) => {
    this.pbDateTouched = true;
    if (e?.value) {
      this.checkForUnsavedChanges(this.updateDateFormat(e.value));
      this.pbDate.value = e.value;
      this.setAuditSignOffDate();
      this.compareBeginEndDate('BeginDateChange');
    } else {
      this.pbDate.error = false;
      this.pbDateLess = false;
      this.pbDate.errorMessage = '';
      this.pbDate.value = '';
      this.detectChanges();
    }
  }

  setAuditSignOffDate = () => {
    if (this.peDate.value || this.pbDate.value) {
      if (this.peDate.value) {
        this.calculateAuditSignOffMinDate(this.peDate.value);
      } else if (this.pbDate.value) {
        this.calculateAuditSignOffMinDate(this.pbDate.value);
      }
    } else {
      this.setAuditSignOffMinDate(this.today);
    }
  }

  calculateAuditSignOffMinDate = (val: any) => {
    if (new Date(val) > new Date(this.presentDay)) {
      let value = new Date(val);
      // set next day as minimum date selection for audit signoff date picker control 
      value.setDate(val.getDate() + 1);
      this.detectChanges();
      this.setAuditSignOffMinDate(value);
    } else {
      this.setAuditSignOffMinDate(this.today);
    }
  }

  setAuditSignOffMinDate = (val: any) => {
    this.auditSignOffMinDate = formatDate(val, Constants.dateFormatUsedForConvertingDate, Constants.USregion)
  }

  onPeriodEndDateChange = (e: any) => {
    if (!this.isEndDateValidate) {
      this.checkForUnsavedChanges(this.updateDateFormat(e.value));
      this.peDate.value = e.value;
      this.setAuditSignOffDate();
      this.peDate.error = false;
      this.peDateLess = false;
      this.peDate.errorMessage = '';
      this.peDateTouched = true;
      this.compareBeginEndDate('EndDateChange');
      this.dateValidation('auditsignoff_date');
    } else {
      this.peDate.value = e.value;
      this.setAuditSignOffDate();
      this.dateValidation('auditsignoff_date');
    }

    let formatCurrentDate = formatDate(new Date(), Constants.dateFormatUsedForConvertingDate, Constants.USregion);
    let formatPbdate = this.pbDate.value ? formatDate(this.pbDate.value, Constants.dateFormatUsedForConvertingDate, Constants.USregion) : null;
    let formatPedate = this.peDate.value ? formatDate(this.peDate.value, Constants.dateFormatUsedForConvertingDate, Constants.USregion) : null;
    let formatAuditSignDate = this.auditSignOff.value ? formatDate(this.auditSignOff.value, Constants.dateFormatUsedForConvertingDate, Constants.USregion) : null;

    if (
      this.auditSignOff.value &&
      formatAuditSignDate > formatCurrentDate &&
      (!this.pbDate.value || formatAuditSignDate > formatPbdate) &&
      (!this.peDate.value || formatAuditSignDate > formatPedate)
    ) {
      this.auditSignOff.error = false;
      this.auditSignOff.errorMessage = '';
      this.auditSignOffLess = false;
      this.isAuditSignOffDateValidate = false;
      this.auditSignOff = { ...this.auditSignOff, error: false };
      this.detectChanges();
    }
  }

  onDateInput(event: any, field: string) {
    const value = event.target.value;
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (datePattern.test(value)) {

      event.target.blur();
      const changeEvent = new Event('change', { bubbles: true });
      event.target.dispatchEvent(changeEvent);

      if (field === 'begin_date') {
        this.dateValidation('begin_date');
        this.onPeriodBeginDateChange({ target: event.target, value: value });

        asyncScheduler.schedule(() => {
          this.periodEdate?.nativeElement.focus();
        });
      } else if (field === 'end_date') {
        this.dateValidation('end_date');
        this.onPeriodEndDateChange({ target: event.target, value: value });

        asyncScheduler.schedule(() => {
          this.auditSignOffDate?.nativeElement.focus();
        });
      } else if (field === 'auditsignoff_date') {
        this.dateValidation('auditsignoff_date');
        this.onAuditSignDateChange({ target: event.target, value: value });
      }
    }
  }

  compareBeginEndDate(key: string) {
    let formatPbdate: any;
    let formatPedate: any;

    if (this.pbDate?.value) {
      formatPbdate = formatDate(this.pbDate.value, 'yyyy-MM-dd', 'en_US');
    }

    if (this.peDate?.value) {
      formatPedate = formatDate(this.peDate.value, 'yyyy-MM-dd', 'en_US');
    }

    if (formatPedate && formatPedate <= formatPbdate) {
      switch (key) {
        case 'BeginDateChange':
          this.pbDateLess = true;
          this.pbDate.error = true;
          this.pbDate.errorMessage = formatPedate === formatPbdate ? "The Period End Date cannot be the same as the Period Begin Date. Please enter a valid date." : "The Period Begin date cannot be after the Period End date or Expected Audit Sign-Off Date. Please enter valid date";
          this.periodBdateObj.value = "" as any;
          this.pbDate.value = "";
          this.isEndDateValidate = true;
          break;
        case 'EndDateChange':
          this.peDateLess = true;
          this.peDate.error = true;
          this.peDate.errorMessage = formatPedate === formatPbdate ? "The Period End Date cannot be the same as the Period Begin Date. Please enter a valid date." : "The Period End Date cannot be before the Period Begin Date. Please enter a valid date.";
          this.periodEdateObj.value = "" as any;
          this.peDate.value = "";
          this.isEndDateValidate = true;
          break;
        default:
          break;
      }

    } else {
      this.peDateLess = false;
      this.peDate.error = false;
      this.peDate.errorMessage = '';
      this.isEndDateValidate = false;
    }
    this.detectChanges();
  }

  onReportingCurrencyChange(e: any) {
    this.checkForUnsavedChanges(e.itemData.id);
    this.reportingCurrency.error = false;
    this.reportingCurrency.value = e.itemData.id;
    this.mandatoryFieldError = false;
  }
  onBrokerCustodiansChange(e: any) {
    this.brokerCusto.value = e.value
    this.checkForUnsavedChanges(e.value);
    this.brokerCusto.error = false;
    this.brokerCusto.errorMessage = '';
    this.mandatoryFieldError = false;
    this.detectChanges();
  }
  onFundAdminChange(e: any) {
    this.checkForUnsavedChanges(e.itemData.id);
    this.fundAdmin.error = false;
    this.fundAdmin.value = e.itemData.id
    this.mandatoryFieldError = false;
  }
  onInvestmentChange(e: any) {
    this.investmentType.value = e.value;
    this.checkForUnsavedChanges(e.value);
    this.investmentType.error = false;
    this.investmentType.errorMessage = '';
    this.mandatoryFieldError = false;
    this.detectChanges();
  }
  fundNameErrorCheck(data: string) {
    let error = {
      status: false,
      message: ''
    }
    if (data.length > 0) {
      this.fundNameMandtory = false;
      if (data.length < 3) {
        this.fundNameError = false;
        error.status = true;
        this.minCharError = true;
        this.minCharErrorMessage = Constants.minimumThreeCharacters;
      } else {
        this.minCharError = false;
        const atleastOneAlphabet = data.match(".*[a-zA-Z]+.*");
        if (atleastOneAlphabet === null) {
          error.status = true;
          if (!this.fundNameError) {
            this.fundNameError = true;
            this.fundNameErrorMessage = 'Fund name should contain at least 1 letter. Please enter a different fund name to proceed';
          }
        } else {
          this.fundNameError = false;
          if (data.length > this.maximumFundNameChar) {
            this.maxCharError = true;
            this.maxCharErrorMesage = "Fund name cannot exceed 200 characters";
          } else {
            this.maxCharError = false;
            error.status = false;
          }
        }
      }
    } else {
      this.fundNameMandtory = true;
      error.status = true;
    }
    return error;
  }
  onFundNameChange(e: any) {
    if (!this.fundNameError && !this.minCharError) {

      this.checkForUnsavedChanges(e.target.value);
      this.fundName.error = false;
    }
  }
  onTypeOfFundChange(e: any) {
    this.checkForUnsavedChanges(e.itemData.id);
    this.fundType.error = false;
    this.fundType.value = e.itemData?.id;
    this.typeofFundToolTip.close();
    this.mandatoryFieldError = false;
  }
  resetFieldError() {
    this.showErorr = false;
    this.fundName.error = false;
    this.fundNameError = false;
    this.minCharError = false;
    this.maxCharError = false;
    this.pbDate.error = false;
    this.peDate.error = false;
    this.fundType.error = false;
    this.investmentType.error = false;
    this.fundAdmin.error = false;
    this.brokerCusto.error = false;
    this.reportingCurrency.error = false;
    this.auditSignOff.error = false;
    this.pbDateLess = false;
    this.peDateLess = false;
    this.auditSignOffLess = false;
    this.materialityErrObj = false;
    this.performanceMaterialErrObj = false;
    this.misstatementErrObj = false;
  }
  clearAllField() {
    this.fundName.value = '';
    this.fundType.value = null;
    this.investmentType.value = '';
    this.fundAdmin.value = null;
    this.brokerCusto.value = '';
    this.reportingCurrency.value = null;
    this.peDate.value = '';
    this.pbDate.value = '';
    this.auditSignOff.value = '';
    this.resetFieldError();
  }
  closeTheAlert(item: string) {
    switch (item) {
      case 'success':
        this.showSuccessMessage = false;
        break;
      case 'error':
        this.showErorr = false;
        break;
      case 'fundNameError':
        this.fundNameError = false;
        break;
      case 'minCharError':
        this.minCharError = false;
        break;
      case 'maxCharError':
        this.maxCharError = false;
        break;
      case 'auditSignOffLess':
        this.auditSignOffLess = false;
        break;
      case 'peDateLess':
        this.peDateLess = false;
        break;
      case 'pbDateLess':
        this.pbDateLess = false;
        break;
      case 'limitError':
        this.limitError = false;
        break;
      case 'materialityErr':
        this.materialityErrObj = false;
        break;
      case 'performanceMaterialErrs':
        this.performanceMaterialErrObj = false;
        break;
      case 'misstatementErr':
        this.misstatementErrObj = false;
        break;
      default:
        this.mandatoryFieldError = false;
        break;
    }
  }
  mandatoryCheck() {
    const fieldsErrorStatus = [this.fundNameMandtory, this.fundType.error, this.investmentType.error, this.fundAdmin.error, this.brokerCusto.error, this.reportingCurrency.error, this.pbDate.error, this.peDate.error, this.auditSignOff.error];

    if (fieldsErrorStatus.indexOf(true) > -1) {
      return false;
    } else {
      return true;
    }
  }
  checkLimit(): boolean[] {
    const eachError: boolean[] = [];
    this.materialityObj.value.length > 0 || this.misstatementObj.value.length > 0 || this.performanceMaterial.value.length > 0
    if (this.materialityObj.value.length > 0) {
      var materiality: any = this.materialityObj.value;
      if ((parseFloat(materiality.replaceAll(',', '')) > this.amPmMax)) {
        this.materialityObj.error = true;
        this.materialityObj.errorMessage = this.amPmMaxErrorMessage;
        eachError[0] = true;
      } else {
        this.materialityObj.error = false;
        this.materialityObj.errorMessage = '';
        eachError[0] = false;
      }
    }
    if (this.misstatementObj.value.length > 0) {
      var misstatement: any = this.misstatementObj.value;
      if ((parseFloat(misstatement.replaceAll(',', '')) > this.amPmMax)) {
        this.misstatementObj.error = true;
        this.misstatementObj.errorMessage = this.amPmMaxErrorMessage;
        eachError[1] = true;
      } else {
        this.misstatementObj.error = false;
        this.misstatementObj.errorMessage = '';
        eachError[1] = false;
      }
    }
    if (this.performanceMaterial.value.length > 0) {
      var performanceMaterialObj: any = this.performanceMaterial.value;
      if ((parseFloat(performanceMaterialObj.replaceAll(',', '')) > this.amPmMax)) {
        this.performanceMaterial.error = true;
        this.performanceMaterial.errorMessage = this.amPmMaxErrorMessage;
        eachError[2] = true;
      } else {
        this.performanceMaterial.error = false;
        this.performanceMaterial.errorMessage = '';
        eachError[2] = false;
      }
    }
    this.detectChanges();
    return eachError;
  }
  setTimeOffset(date: any) {
    const newDate = new Date(date);
    const offset = newDate.getTimezoneOffset() / 60;
    newDate.setTime(newDate.getTime() - offset * 3600 * 1000);
    return newDate;
  }
  addFund() {
    if (!this.loading) {
      this.loading = true;
      this.resetFieldError();
      if (this.fundType.value === null) {
        this.fundType.error = true;
      }
      if (this.investmentType.value.length <= 0) {
        this.investmentType.error = true;
      }
      if (this.fundAdmin.value === null) {
        this.fundAdmin.error = true;
      }
      if (this.brokerCusto.value.length <= 0) {
        this.brokerCusto.error = true;
      }
      if (this.reportingCurrency.value === null) {
        this.reportingCurrency.error = true;
      }
      if (this.isSpecialCharacter(this.materialityObj.value)) {
        this.materialityErrObj = true;
      }
      if (this.isSpecialCharacter(this.performanceMaterial.value)) {
        this.performanceMaterialErrObj = true;
      }
      if (this.isSpecialCharacter(this.misstatementObj.value)) {
        this.misstatementErrObj = true;
      }

      if (this.fundName.value != '' && this.fundName.value.length < 3) {
        this.minCharError = true;
        this.minCharErrorMessage = Constants.minimumThreeCharacters;
      } else {
        this.detectChanges();
        this.minCharError = false;
        this.minCharErrorMessage = '';
      }

      this.dateValidation('all');

      const fundNameValue = this.fundName.value;
      const fundNameValid = this.fundNameErrorCheck(fundNameValue);
      this.fundName.error = fundNameValid.status;
      this.fundName.errorMessage = fundNameValid.message;
      let checkOptionalFieldError: boolean[] = [];
      if (this.materialityObj.value.length > 0 || this.misstatementObj.value.length > 0 || this.performanceMaterial.value.length > 0) {
        checkOptionalFieldError = this.checkLimit();
      }
        const fieldsErrorStatus = [this.fundName.error, this.fundType.error, this.investmentType.error, this.fundAdmin.error, this.brokerCusto.error, this.reportingCurrency.error, this.pbDate.error, this.peDate.error, this.auditSignOff.error, this.materialityErrObj, this.performanceMaterialErrObj, this.misstatementErrObj];
        const mandatoryStatus = this.mandatoryCheck();
        let filterNonDatesMandate: boolean[] = [];
        if ((this.auditSignOffLess && this.auditSignOff.value.length === 0) || (this.peDateLess && this.peDate.value.length === 0) || (this.pbDateLess && this.pbDate.value.length === 0)) {
          filterNonDatesMandate = [this.fundName.error, this.fundType.error, this.investmentType.error, this.fundAdmin.error, this.brokerCusto.error, this.reportingCurrency.error];
        }

        if (checkOptionalFieldError.indexOf(true) > -1) {
          this.limitError = true;
        } else {
          this.limitError = false;
        }
        this.mandatoryFieldError = (this.auditSignOff.value.length === 0 || this.peDate.value.length === 0 || this.pbDate.value.length === 0) ? true : mandatoryStatus;
        if (fieldsErrorStatus.indexOf(true) <= -1 && mandatoryStatus && checkOptionalFieldError.indexOf(true) <= -1) {
          const periodStartDate = this.setTimeOffset(this.pbDate.value);
          const periodEndDate = this.setTimeOffset(this.peDate.value);
          const expectedAuditSignOffDate = this.setTimeOffset(this.auditSignOff.value);
          this.mandatoryFieldError = (this.auditSignOff.value.length === 0 || this.peDate.value.length === 0 || this.pbDate.value.length === 0) ? true : false;
          this.showErorr = (this.auditSignOff.value.length === 0 || this.peDate.value.length === 0 || this.pbDate.value.length === 0) ? true : false;

          this.editEngagementIdValue = this.getEngagementId();

          const newFundData = {
            "name": this.fundName.value,
            "engagementNumber": '2001405615',
            "fundAdminId": this.fundAdmin.value,
            "currencyId": this.reportingCurrency.value,
            "fundTypeId": this.fundType.value,
            "investmentTypeId": this.investmentType.value,
            "brokerCustodianId": this.brokerCusto.value,
            "periodStartDate": periodStartDate,
            "periodEndDate": periodEndDate,
            "fundStatusId": 1,
            "createdBy": "testuser",
            "groupId": 1,
            "engagementId": this.editEngagementIdValue,
            "expectedAuditSignOffDate": expectedAuditSignOffDate,
            "materiality": this.materialityObj.value ? this.materialityObj.value.replace(/,/gi, "") : null,
            "performanceMateriality": this.performanceMaterial.value ? this.performanceMaterial.value.replace(/,/gi, "") : null,
            "auditMisstatementPostingThreshold": this.misstatementObj.value ? this.misstatementObj.value.replace(/,/gi, "") : null
          }
          this.detectChanges();
          this.addFundApiCall(newFundData);
        }
        else {

          if (filterNonDatesMandate.indexOf(true) >= 0 || (filterNonDatesMandate.length === 0 && !mandatoryStatus) || mandatoryStatus) {
            this.mandatoryFieldError = !mandatoryStatus;
            this.showErorr = false; // API error messages;
          }

          this.loading = false;
        }
    }
  }

  addFundApiCall(newFundData: any) {
    this.addFundSubmitData = this.addFundSubmit.submitTheFund(newFundData).subscribe({
      next: (resp) => {
          this.loading = false;
          let newdata = JSON.parse(resp);
          /* // if (newdata.succeeded == true) { */
          if (newdata?.succeeded && newdata.data.fundId > 0) {
            let serviceBusRequest = {
              "fundId": newdata.data.fundId,
              "fundName": newFundData.name,
              "engagementId": newFundData.engagementId,
            }

            this.addFundSubmit.sendDbCreationMessageToServiceBus(serviceBusRequest).subscribe((res) => { });

            this.newFundAdded.emit({ status: true, message: newdata.successMessage });
            this.clearAllField();
            this.unSavedChangesExist = false;

            let data = {
              isSucceeded: newdata.succeeded,
              successMessage: newdata.data.message
            }
            this.fundScopingDetailsService.setSuccessMessage(data);
            const addFundCompletd = "true";
            sessionStorage.setItem('fromAddFund', addFundCompletd);
            sessionStorage.setItem('addedFundId', newdata.data.fundId.toString());
            this.router.navigate(["/fundscoping/fundetails"]);

          }
          else {
            this.showErorr = true;
            this.fundName.error = true;
            this.errorRespMessage = newdata.errorMessage;
          } 
        },
        error: (error) => {
          // API error messages;
          this.loading = false;
          this.showErorr = true;
          this.errorRespMessage = error.message; 
        }
    });
  }
  materialityChange(event: any) {
    this.checkForUnsavedChanges(event.target.value);
    this.materialityObj.error = false;
    this.materialityObj.errorMessage = '';
    this.materialityObj.value = event.target.value;

    if (this.isSpecialCharacter(this.materialityObj.value)) {
      this.materialityErrObj = true;
      this.materialityObj.error = true;
    }
    else {
      this.materialityErrObj = false;
      this.materialityObj.error = false;
    }
    this.detectChanges();
  }
  performanceMaterialityChange(event: any) {
    this.checkForUnsavedChanges(event.target.value);
    this.performanceMaterial.error = false;
    this.performanceMaterial.errorMessage = '';
    this.performanceMaterial.value = event.target.value;
    if (this.isSpecialCharacter(this.performanceMaterial.value)) {
      this.performanceMaterialErrObj = true;
      this.performanceMaterial.error = true;
    }
    else {
      this.performanceMaterialErrObj = false;
      this.performanceMaterial.error = false;
    }
    this.detectChanges();
  }
  auditMisstatChange(event: any) {
    this.checkForUnsavedChanges(event.target.value);
    this.misstatementObj.error = false;
    this.misstatementObj.errorMessage = '';
    this.misstatementObj.value = event.target.value;
    if (this.isSpecialCharacter(this.misstatementObj.value)) {
      this.misstatementErrObj = true;
      this.misstatementObj.error = true;
    }
    else {
      this.misstatementErrObj = false;
      this.misstatementObj.error = false;
    }
    this.detectChanges();
  }
  onAuditSignDateChange(event: any) {
    //Added check not to call onchange event more than once
    if (!this.isAuditSignOffDateValidate) {
      this.checkForUnsavedChanges(this.updateDateFormat(event.value));
      this.auditSignOff.value = event.value;
      this.auditSignOff.error = false;
      this.auditSignOff.errorMessage = '';
      this.auditSignOffLess = false;
      this.auditSignOffDateTouched = true;

      let formatPbdate: any;
      let formatCurrentDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
      let formatPedate: any;
      let formatAuditSignDate: any;

      if (this.pbDate.value != null && this.pbDate.value.toString().length !== 0)
        formatPbdate = formatDate(this.pbDate.value, 'yyyy-MM-dd', 'en_US');

      if (this.peDate.value != null && this.peDate.value.toString().length !== 0)
        formatPedate = formatDate(this.peDate.value, 'yyyy-MM-dd', 'en_US');

      if (this.auditSignOff.value != null && this.auditSignOff.value.toString().length > 0) {
        //Merge all 3 cases in one - current Date, Begin Date and End Date
        formatAuditSignDate = formatDate(this.auditSignOff.value, 'yyyy-MM-dd', 'en_US');
        if ((formatAuditSignDate < formatCurrentDate) || (this.pbDate.value.toString().length > 0 && (formatPbdate && formatAuditSignDate < formatPbdate)) || (this.peDate.value.toString().length > 0 && (formatPedate && formatAuditSignDate < formatPedate))) {

          this.auditSignOff.error = true;
          this.auditSignOffLess = true;
          this.auditSignOff.errorMessage = "The Expected Audit Sign-Off Date cannot be before the Period Begin Date, Period End Date or today's date. Please enter a valid date.";
          this.auditSignOffDateObj.value = "" as any;
          this.auditSignOff.value = "";
          this.isAuditSignOffDateValidate = true;
        }
      }
      this.detectChanges();
    }
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }
  isUserConfired(event: any) {

    if (this.backButtonClicked) {
      this.backButtonClicked = false;
      return this.router.navigate(["/fundscoping/fundetails"]);
    } else {

      this.stepperService.checkChanges = false;

      //Save required dialogbox for assembleWorkbook
      this.handleSaveRequiredDisplayForAssembleWorkbook(false);

      return this.router.navigate([this.nextRouteNavigate || "/fundscoping/fundetails"])
    }
  }
  triggerCloseBtn() {
    this.showPopup = false;
    this.showBrowserPopup = false;
    this.backButtonClicked = false;
    this.onClosePopUp.emit(true);
    this.CustomConfirmationDialogComponent?.triggerClose();
    this.BrowserDefaultPopupComponent?.triggerClose();
  }
  onBackNavigation(event: any, evenTriggerBy: string) {
    if (this.hasAnyFormValueChanged()) {
      if (evenTriggerBy === 'button') {
        this.showPopup = true;
        this.showBrowserPopup = false;
        this.detectChanges();
        this.CustomConfirmationDialogComponent?.triggerOpen();
      } else {
        this.showPopup = false;
        this.showBrowserPopup = true;
        this.detectChanges();
        this.BrowserDefaultPopupComponent?.triggerOpen();
      }
    } else {
      this.showPopup = false;
      this.showBrowserPopup = false;
      this.router.navigate(["/fundscoping/fundetails"]);
    }
  }

  hasAnyFormValueChanged() {
    if (this.fundName.value ||
      this.fundType.value ||
      this.investmentType.value.length ||
      this.fundAdmin.value ||
      this.brokerCusto.value.length ||
      this.reportingCurrency.value ||
      this.pbDate.value ||
      this.peDate.value ||
      this.auditSignOff.value ||
      this.materialityObj.value ||
      this.performanceMaterial.value ||
      this.misstatementObj.value) {
      return true;
    }
    return false;
  }

  checkForUnsavedChanges(currentVal: any) {

    if (currentVal.length !== 0 || ((this.fundName.value !== null && this.fundName.value !== "") ||
      this.fundType.value !== null ||
      this.investmentType.value.length > 0 ||
      this.fundAdmin.value !== null ||
      this.brokerCusto.value.length > 0 ||
      this.reportingCurrency.value !== null ||
      this.pbDate.value.length !== 0 ||
      this.peDate.value.length !== 0 ||
      this.auditSignOff.value.length !== 0 ||
      this.materialityObj.value !== '' ||
      this.performanceMaterial.value !== '' ||
      this.misstatementObj.value !== '')) {
      this.unSavedChangesExist = true;
      this.stepperService.checkChanges = this.unSavedChangesExist;
    } else {
      this.unSavedChangesExist = false;
      this.stepperService.checkChanges = this.unSavedChangesExist;
    }

    //Save required dialogbox for assembleWorkbook
    this.handleSaveRequiredDisplayForAssembleWorkbook(this.unSavedChangesExist);
  }

  public RegExppp = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/

  valid(e: any) {


    const restrictSpecialCharacters = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;

    const pasteData = e.clipboardData?.getData('text/plain') as string;
    if (!restrictSpecialCharacters.test(pasteData)) {
      e.preventDefault()
    }
  }
  allowOnlyNumberandDecimalvalue(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      return true;
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  loadSubscribeEventForAssembleWorkbook() {
    this.sharedSubjectService.saveRequiredDialogForAssembleWorkbook.subscribe((val: any) => {

      if (this.unSavedChangesExist &&
        this.sharedSubjectService.getLocalStorageItem(this.sharedSubjectService.assembleWorkbookStorageKey) != null ?
        this.sharedSubjectService.getLocalStorageItem(this.sharedSubjectService.assembleWorkbookStorageKey) == "true" : false
      ) {
        this.showPopup = true;
        this.detectChanges();
        this.CustomConfirmationDialogComponent?.triggerOpen();
        this.nextRouteNavigate = val;
      }
    });
  }
  handleSaveRequiredDisplayForAssembleWorkbook(value: boolean) {
    if (value) {
      this.sharedSubjectService.setNextNavigationUrl('assemble-workbook');
      this.sharedSubjectService.setCurrentNavigationUrl('/fundscoping/add-fund');
    }
    this.sharedSubjectService.setLocalStorageItem(this.sharedSubjectService.assembleWorkbookStorageKey, value);
  }
  getEngagementId() {
    let engagementObj: any = sessionStorage.getItem('engDetails');
    engagementObj = JSON.parse(engagementObj);
    let engagementId;
    if (engagementObj) {
      engagementId = engagementObj?.engagementId;
    }
    return engagementId;
  }
  blockPaste(e: any) {
    const restrictSpecialCharacters = /^[1-9]\d*(\.\d+)?$/g;
    const pasteData = e.clipboardData?.getData('text/plain') as string;
    if (!restrictSpecialCharacters.test(pasteData)) {
      e.preventDefault()
    }
  }
  allowOnlyDateValue(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 || charCode === 47 || (charCode >= 48 && charCode <= 57)) {
      return true;
    }
    return false;
  }

  dateValidation(dateField: string) {
    let formatPbdate: any;
    let formatCurrentDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
    let formatPedate: any;
    let formatAuditSignDate: any;
    if (!this.pbDate?.value && this.pbDate.value != null && this.pbDate.value.toString().length !== 0)
      this.pbDate = { value: '', error: false, errorMessage: '' };
    if (!this.peDate?.value && this.peDate.value != null && this.peDate.value.toString().length !== 0)
      this.peDate = { value: '', error: false, errorMessage: '' };
    if (!this.auditSignOff?.value && this.auditSignOff.value != null && this.auditSignOff.value.toString().length !== 0)
      this.auditSignOff = { value: '', error: false, errorMessage: '' };

    if (this.pbDate.value != null && this.pbDate.value.toString().length !== 0)
      formatPbdate = formatDate(this.pbDate.value, 'yyyy-MM-dd', 'en_US');
    if (this.peDate.value != null && this.peDate.value.toString().length !== 0)
      formatPedate = formatDate(this.peDate.value, 'yyyy-MM-dd', 'en_US');
    if (this.auditSignOff.value != null && this.auditSignOff.value.toString().length !== 0)
      formatAuditSignDate = formatDate(this.auditSignOff.value, 'yyyy-MM-dd', 'en_US');

    if (dateField === "begin_date" || dateField === "all") {
      this.pbDateLess = false;   //Clear error pop-up before checking
      this.isBeginDateValidate = false;
      if ((this.pbDate.value === null || this.pbDate.value.toString().length === 0) && dateField === "all") {
        this.mandatoryFieldError = true;
        this.pbDate.error = true;
        this.pbDate.value = "";
        this.periodBdateObj.value = "" as any;
        this.pbDateLess = false;
      }

      if (this.pbDate.value != null && this.pbDate.value.toString().length !== 0) {
        const formatPDminDate = '1753-01-01';
        this.isBeginDateValid(this.pbDate.value, this.peDate.value, this.auditSignOff.value);
        if (formatPbdate > formatCurrentDate) {
          this.pbDate.error = true;
          this.pbDateLess = true;
          this.pbDate.value = "";
          this.isBeginDateValidate = true;
          this.periodBdateObj.value = "" as any;
          this.pbDate.errorMessage = "The Period Begin date should not be greater than the current date.";
          this.detectChanges();
        } else if (formatPbdate < formatPDminDate) {
          this.pbDate.error = false;
          this.pbDate.value = "";
          this.periodBdateObj.value = "" as any;
        } else {
          this.mandatoryFieldError = false;
        }
        //Added code to handle valid date after invalid date
        if (!this.isBeginDateValidate) {
          this.pbDate.error = false;
          this.pbDate.errorMessage = '';
          this.detectChanges();
          this.pbDateLess = false;
          this.isBeginDateValidate = true;
        }
      }
      if (this.pbDate?.value?.toString().length > 0 && this.isValidYear(new Date(this.pbDate.value))) {
        this.pbDate.value = "";
        this.periodBdateObj.value = "" as any;
      }

      if (this.pbDate.errorMessage == '' && this.pbDate?.value?.toString().length > 0) {
        this.endDateMin = this.getNextDay(formatPbdate);
      }
    }

    if (dateField === "end_date" || dateField === "all") {
      this.isEndDateValidate = false;
      this.peDateLess = false; //Clear error pop-up before checking
      if ((this.peDate.value === null || this.peDate.value.toString().length === 0) && dateField === "all") {
        this.mandatoryFieldError = true;
        this.peDate.error = true;
        this.peDate.value = "";
        this.periodEdateObj.value = "" as any;
        this.peDateLess = false;
      }

      if (this.peDate.value != null && this.peDate.value.toString().length > 0) {
        if (this.isPeriodEndDateValid()) { return; }

        if (formatPedate <= formatPbdate && this.peDate.value.length !== 0) {
          this.peDateLess = true;
          this.peDate.error = true;
          this.peDate.errorMessage = formatPedate === formatPbdate ? "The Period End Date cannot be the same as the Period Begin Date. Please enter a valid date." : "The Period End Date cannot be before the Period Begin Date. Please enter a valid date.";
          this.detectChanges();
          this.periodEdateObj.value = "" as any;
          this.peDate.value = "";
          this.isEndDateValidate = true;
        }
        else if (formatPedate > formatPbdate) {
          this.peDateLess = false;
          this.peDate.error = false;
          this.peDate.errorMessage = "";
          this.detectChanges();
          this.mandatoryFieldError = false;
        }
        if (formatAuditSignDate != undefined && formatAuditSignDate <= formatPedate) {
          this.peDate.error = true;
          this.peDateLess = true;
          this.peDate.errorMessage = "The Expected Audit Sign-Off Date cannot be before the Period Begin Date, Period End Date or today's date. Please enter a valid date.";
          this.detectChanges();
          this.peDate.value = "";
          this.periodEdateObj.value = "" as any;
          this.isEndDateValidate = true;
        }
        //Added code to handle valid date after invalid date
        if (!this.isEndDateValidate) {
          this.peDate.error = false;
          this.peDate.errorMessage = '';
          this.detectChanges();
          this.peDateLess = false;
          this.isEndDateValidate = true;
        }
        if (this.isValidYear(new Date(this.peDate.value))) {
          this.peDate.value = "";
          this.periodEdateObj.value = "" as any;
        }
        if (this.peDate.errorMessage == '') {
          if (formatPedate < this.periodMaxDate) {
            this.auditSignOffDateMin = this.periodMaxDate;
          } else {
            this.auditSignOffDateMin = this.getNextDay(formatPedate);
          }
        }
      }
    }

    if (dateField === "auditsignoff_date" || dateField === "all") {
      this.auditSignOffLess = false; //Clear error pop-up before checking
      this.isAuditSignOffDateValidate = false;
      if ((this.auditSignOff.value === null || this.auditSignOff.value.toString().length === 0) && dateField === "all") {
        this.mandatoryFieldError = true;
        this.auditSignOff.error = true;
        this.auditSignOff.value = "";
        this.auditSignOffDateObj.value = "" as any;
        this.auditSignOffLess = false;
      }

      if (this.auditSignOff?.value != null && this.auditSignOff?.value?.toString().length > 0) {
        //Merge all 3 cases in one - current Date, Begin Date and End Date
        if ((formatAuditSignDate < formatCurrentDate) || (this.pbDate?.value?.toString().length > 0 && formatAuditSignDate < formatPbdate) || (this.peDate?.value?.toString().length > 0 && formatAuditSignDate < formatPedate)) {

          this.auditSignOff.error = true;
          this.auditSignOffLess = true;
          this.auditSignOff.errorMessage = "The Expected Audit Sign-Off Date cannot be before the Period Begin Date, Period End Date or today's date. Please enter a valid date.";
          this.detectChanges();
          this.auditSignOffDateObj.value = "" as any;
          this.auditSignOff.value = "";
          this.isAuditSignOffDateValidate = true;
        }
      }

      //Added code to handle valid date after invalid date
      if (!this.isAuditSignOffDateValidate && this.auditSignOff?.value?.toString().length > 0) {
        this.auditSignOff.error = false;
        this.auditSignOff.errorMessage = '';
        this.detectChanges();
        this.auditSignOffLess = false;
        this.isAuditSignOffDateValidate = true;
      }
      if (this.auditSignOff?.value?.toString().length > 0 && this.isValidYear(new Date(this.auditSignOff.value))) {
        this.auditSignOff.value = ""; this.auditSignOffDateObj.value = "" as any;
      }

      if (
        this.auditSignOff.value &&
        formatAuditSignDate > formatCurrentDate &&
        (!this.pbDate.value || formatAuditSignDate > formatPbdate) &&
        (!this.peDate.value || formatAuditSignDate > formatPedate)
      ) {
        this.auditSignOff.error = false;
        this.auditSignOff.errorMessage = '';
        this.auditSignOffLess = false;
        this.isAuditSignOffDateValidate = false;
        this.detectChanges();
      }
    }
  }

  isSpecialCharacter(char: any): boolean {
    return isNaN(Number(char.replaceAll(',', '')));
  }

  isDigit(char: string): boolean {
    // Check if the character is a digit
    return '0' <= char && char <= '9';
  }

  isBeginDateValid(beginDate: string, endDate: string, expectedAuditSignOffDate: string): boolean {
    let beginDateObj: any;
    let endDateObj: any;
    let expectedAuditSignOffDateObj: any;

    if (beginDate) {
      beginDateObj = new Date(beginDate);
    } else {
      beginDateObj = null;
      this.pbDate.error = false;
      this.pbDate.errorMessage = '';
      this.detectChanges();
      this.pbDate.value = '';
      this.isBeginDateValidate = false;
      this.pbDateLess = false;
    }

    if (endDate) {
      endDateObj = new Date(endDate);
    } else {
      endDateObj = null;
      this.peDate.error = false;
      this.peDate.errorMessage = '';
      this.detectChanges();
      this.peDate.value = '';
      this.isEndDateValidate = false;
      this.peDateLess = false;
    }

    if (expectedAuditSignOffDate) {
      endDateObj = new Date(expectedAuditSignOffDate);
    } else {
      expectedAuditSignOffDateObj = null;
      this.auditSignOff.error = false;
      this.auditSignOff.errorMessage = '';
      this.auditSignOff.value = '';
      this.isAuditSignOffDateValidate = false;
      this.auditSignOffLess = false;
      this.detectChanges();
    }

    if (((beginDateObj && endDateObj) && beginDateObj > endDateObj) || (beginDateObj && expectedAuditSignOffDateObj && (beginDateObj > expectedAuditSignOffDateObj))) {
      this.pbDate.error = true;
      this.pbDate.errorMessage = "The Period Begin date cannot be after the Period End date or Expected Audit Sign-Off Date. Please enter valid date";
      this.pbDate.value = '';
      this.isBeginDateValidate = true;
      this.periodBdateObj.value = "" as any;
      this.pbDateLess = true;
      this.detectChanges();
      return true;
    }
    return false;
  }

  isPeriodEndDateValid(): boolean {
    if (this.auditSignOff.value && this.peDate.value &&
      this.auditSignOff.value.length > 0 && this.peDate.value.length > 0) {
      let formatPedate: any = formatDate(this.peDate.value, 'yyyy-MM-dd', 'en_US');
      let formatCurrentDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
      let requiredDate = formatCurrentDate > formatPedate ? formatCurrentDate : formatPedate;
      let formatAuditSignDate: any = formatDate(this.auditSignOff.value, 'yyyy-MM-dd', 'en_US');
      if ((formatAuditSignDate < requiredDate) || (formatAuditSignDate <= formatPedate)) {
        this.peDate.error = true;
        this.peDateLess = true;
        this.peDate.errorMessage = "The Expected Audit Sign-Off Date cannot be before the Period Begin Date, Period End Date or today's date. Please enter a valid date.";
        this.peDate.value = "";
        this.periodEdateObj.value = "" as any;
        this.isEndDateValidate = true;
        this.detectChanges();
        return true;
      }
    }
    return false;
  }

  isValidYear(currDate: Date) {
    if (isNaN(currDate.getTime())) {
      return false;
    }
    return currDate.getFullYear() > this.defaultYear;
  }

  formatCurrency(inputElement: any) {
    let value = inputElement.toString().replace(/,/g, '');
    value = value.includes('.')
      ? value.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      '.' +
      value.split('.')[1]
      : value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas for thousands
    return value;
  }
}