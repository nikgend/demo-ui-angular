import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SimpleChanges, SimpleChange } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { GridAllModule, GridComponent, GridModule } from '@syncfusion/ej2-angular-grids';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { L10n } from '@syncfusion/ej2/base';
import { CloseOutFundComponent } from 'src/app/features/scoping/fundscoping/component/close-out-fund/close-out-fund.component';
import { fundScopingColumnDef } from 'src/app/features/scoping/fundscoping/component/column-definations';
import { AddFundGetDataService } from 'src/app/features/scoping/services/add-fund/add-fund-get-data.service';
import { rowdatamodel } from 'src/app/types/custom-gird/interfaces/custom-grid-row.component';
import { customGridConstants } from '../constants/custom-grid.spec.constant';
import { rootReducer } from '../engagement-details/engagement-state/reducers';
import { CustomGridComponent } from './custom-grid.component';
import { of } from 'rxjs';
import { Constants } from 'src/app/shared/components/constants/constants';

describe('CustomGridComponent', () => {
  let component: CustomGridComponent;
  let fixture: ComponentFixture<CustomGridComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'fundscoping/close-out-fund', component: CloseOutFundComponent }]),
        GridModule,
        GridAllModule,
        ButtonModule,
        TooltipModule,
        HttpClientModule,
      StoreModule.forRoot(rootReducer)
      ],
      providers: [DatePipe, AddFundGetDataService],
      declarations: [CustomGridComponent, CloseOutFundComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomGridComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router)
    fixture.detectChanges();
  });

  it('should create', () => {
    component.showPagin = true;
    expect(component).toBeTruthy();
  });

  it('should call ngAfterOnChange', () => {
    component.ngAfterOnChange();
  })


  it('should call ngOnChanges', () => {
    let changes: SimpleChanges = {};
    component.ngOnChanges(changes);
  })

  // it('should call getEngagementId', () => {
  //   component.getEngagementId();
  // })

  describe('query', () => {
    it('should call rowSelected output event', () => {
      const spy = spyOn(component, 'rowIsSelected');
      const element = fixture.debugElement.query(By.css('ejs-grid'));
      element.nativeElement.dispatchEvent(new Event('rowSelected'));
      expect(spy).toHaveBeenCalledWith(jasmine.any(Event));
    });

    it('should call actionComplete output event', () => {
      const spy = spyOn(component, 'actionEndHandler');
      const element = fixture.debugElement.query(By.css('ejs-grid'));
      element.nativeElement.dispatchEvent(new Event('actionComplete'));
      expect(spy).toHaveBeenCalledWith(jasmine.any(Event));
    });
  });

  describe('collectFundData unit testing', () => {
    it('on collectFundData called', () => {
      component.collectFundData(1);
    });
  });

  describe('openModal unit testing', () => {
    it('on openModal called', () => {
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      const data = "testdata";
      expect(event.stopPropagation()).toBeUndefined();
      component.openModal(event, data);
    });



    it('on viewEngagement called', () => {
      spyOn(component.accessIssue, "next");
      spyOn(router, "navigateByUrl")
      const data = customGridConstants.view_engagement;
      component.viewEngagement(data);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/fundscoping/fundetails');

      const engagement_no_access = customGridConstants.view_engagement_non_access;
      component.viewEngagement(engagement_no_access);
      fixture.detectChanges();
      expect(component.accessIssue.next).toHaveBeenCalledWith(true);
    });



    it('on savePeriodEndDate called', () => {
      spyOn(component, "saveFundData")
      component.periodEndEditting = [false, false, false];
      let data = JSON.parse(JSON.stringify(customGridConstants.fund_detail));
      data['index'] = 1;
      data.periodEndDate = new Date(data.periodEndDate)
      const e = { target: { value: new Date('2022-04-31') } }
      component.savePeriodEndDate(e, data);
      fixture.detectChanges();
      expect(component.periodEndEditting[data.index]).toBe(true);
    });

    it('on closeDateFieldAfterUpdating called', () => {
      const data = "data";
      component.closeDateFieldAfterUpdating(data);
    });

    it('on saveMateriality called', () => {
      const data = "data";
      const event = { target: { value: "" } }
      component.saveMateriality(event, data);
      fixture.detectChanges();
      expect(component.editFundErrorStatus.error).toBe(false);

      const event1 = { target: { value: 30000000000 } }
      component.saveMateriality(event1, data);
      fixture.detectChanges();
      expect(component.editFundErrorStatus.error).toBe(true);
    });

    it('on savePM called', () => {
      const data = "data";
      const event = { target: { value: "" } }
      component.savePM(event, data);
      fixture.detectChanges();
      expect(component.editFundErrorStatus.error).toBe(false);

      const event1 = { target: { value: 30000000000 } }
      component.savePM(event1, data);
      fixture.detectChanges();
      expect(component.editFundErrorStatus.error).toBe(true);
    });

    it('on saveAMPT called', () => {
      const data = "data";
      const event = { target: { value: "" } }
      component.saveAMPT(event, data);
      fixture.detectChanges();
      expect(component.editFundErrorStatus.error).toBe(false);

      const event1 = { target: { value: 30000000000 } }
      component.saveAMPT(event1, data);
      fixture.detectChanges();
      expect(component.editFundErrorStatus.error).toBe(true);
    });

    it('on onPeriodStartDateClick called', () => {
      spyOn(component, "closeEachFieldItem");
      const data = { periodEndDate: new Date() };
      const i = 23;
      component.onPeriodStartDateClick(data, i);
      fixture.detectChanges();
      expect(component.closeEachFieldItem).toHaveBeenCalled();
    });

    it('on onPeriodEndDateClick called', () => {
      const data = "data";
      const i = 23;
      component.onPeriodEndDateClick(data, i);
    });

    it('on onAuditSignOffDateClick called', () => {
      spyOn(component, "closeEachFieldItem");
      let nextdate = component.getNextDay(new Date());
      const data = { periodEndDate: new Date(), };
      const i = 23;
      component.onAuditSignOffDateClick(data, i);
      fixture.detectChanges();
      expect(component.closeEachFieldItem).toHaveBeenCalled()
    });

    it('on onMaterialityClick called', () => {
      const data = "data";
      const i = 23;
      component.onMaterialityClick(data, i);
    });

    it('on onPMClick called', () => {
      const data = "data";
      const i = 23;
      component.onPMClick(data, i);
    });

    it('on onAmptClick called', () => {
      const data = "data";
      const i = 23;
      component.onAmptClick(data, i);
    });

    it('on onBrokoDopdownClose called', () => {
      const i = 23;
      component.onBrokoDopdownClose(i);
    });

    it('on onInvstDropdownClose called', () => {
      component.showInvestMultiSelect = [true, true, true, true];
      const i = 2;
      component.onInvSelectOpen(i, '');
      component.onInvstDropdownClose(i);
      fixture.detectChanges();
      expect(component.showInvestMultiSelect[i]).toBe(false);
    });

    it('on onfundADminSelectClose called', () => {
      const i = 23;
      component.onFundAdminOpen(i, '');
      component.onInvSelectOpen(i, "");
      component.onfundADminSelectClose(i);
      fixture.detectChanges();
      expect(component.showFundAdminSelect[i]).toBe(false);
    });


    it('on allowOnlyNumberandDecimalvalue called', () => {
      const event = jasmine.createSpyObj('event', ['stopPropagation', 'MouseEvent']);
      component.allowOnlyNumberandDecimalvalue(event);
    });


    it('on onMaterialityKeyDown called', () => {
      const i = 23;
      const event = jasmine.createSpyObj('event', ['stopPropagation', 'MouseEvent']);
      component.onMaterialityKeyDown(i, event);
    });

    it('on onPmKeyDown called', () => {
      const i = 23;
      const event = jasmine.createSpyObj('event', ['stopPropagation', 'MouseEvent']);
      component.onPmKeyDown(i, event);
    });

    it('on onAmptKeyDown called', () => {
      const i = 23;
      const event = jasmine.createSpyObj('event', ['stopPropagation', 'MouseEvent']);
      component.onAmptKeyDown(i, event);
    });



    it('on onInvSelectOpen called', () => {
      const i = 23;
      component.onInvSelectOpen(i, '');
    });

    it('on onFundAdminOpen called', () => {
      const i = 23;
      component.onFundAdminOpen(i, '');
    });



    it('on getFormattedDate called', () => {
      const receiveDate = "receivedDate";
      component.getFormattedDate(receiveDate);
      const date = new Date(receiveDate);
      expect(date).toBeTruthy();
    });

    it("Should call type changes", () => {
      spyOn(component, "saveFundData");
      const data = "data";
      const event = true;
      component.onFundTypeChange(data, event);
      fixture.detectChanges();
      expect(component.saveFundData).toHaveBeenCalledWith(data, event, 'fundTypeId', 'fundtypetrue');
    });

    it("Should call close investment type", () => {
      spyOn(component, "closeEachFieldItem");
      component.editFundErrorStatus.error = false;
      component.closeInvestmentType(2);
      fixture.detectChanges();
      expect(component.closeEachFieldItem).toHaveBeenCalledWith(2, 'investmentTypeId');


    })

    it("Should call on investment type change", () => {
      spyOn(component, "saveFundData");
      const data = "data";
      const invEvent = { value: "test" };
      const eventMock = new MessageEvent('value', {
        data: 'Some data',
        origin: 'http://example.com',
        source: window,
      });
      component.editFundErrorStatus.error = false;
      component.onInvestmentTypeChange(invEvent, data);
      fixture.detectChanges();
      expect(component.saveFundData).toHaveBeenCalledWith(data, invEvent, 'investmentTypeId', 'investmenttypetrue');

      spyOn(component, "tirggerMandatoryError");
      const invEvent1 = { value: "" };
      component.onInvestmentTypeChange(invEvent1, data);
      fixture.detectChanges();
      expect(component.tirggerMandatoryError).toHaveBeenCalledWith(data, "investmentTypeId");



    })
  });

  describe('functional unit testing', () => {
    it('onDataStateChanged', () => {
      let args = {};
      component.onDataStateChanged(args);
    });

    it('rowIsSelected', () => {
      let args = {};
      component.rowIsSelected(args);
    });

    it('changeState', () => {
      let args = {
        id: 1,
        name: "",
        phoneNumber: "",
        emailAddress: "",
        show: true,
        analysisId: 2,
        fundName: "",
        fundType: "",
        investmentType: [],
        fundAdminName: "",
        brokerCustodianName: [],
        currencyCode: "",
        periodStartDate: "",
        periodEndDate: "",
        groupName: "",
        createdBy: "",
        createdDate: ""
      };
    });

    it('prepareQuery', () => {
      let args = {}
      component.query = {
        year: '',
        selectedColumns: '',
        sortDirection: "Asc",
        sortBy: 'Asc',
        searchString: 'search',
        pageNumber: 0,
        pageSize: 10,
        filter: []
      };
      component.prepareQuery();
    });

    it('actionEndHandler', () => {
      component.query = {
        year: '',
        selectedColumns: '',
        sortDirection: "Asc",
        sortBy: 'Asc',
        searchString: 'search',
        pageNumber: 0,
        pageSize: 10,
        filter: []
      };
      let args = {
        filterChoiceCount: 0,
        excelSearchOperator: '',
        columnName: "fundType",
        direction: "Ascending",
        name: "actionComplete",
        requestType: "sorting",
        rows: [],
        type: "actionComplete"
      };

      let filterAfterOpenArgs = {
        filterChoiceCount: 0,
        excelSearchOperator: '',
        columnName: "fundType",
        direction: "Ascending",
        name: "actionComplete",
        requestType: "sorting",
        rows: [],
        type: "actionComplete"
      };
      component.grid.pageSettings.pageSize = 9;
      component.grid.pageSettings.currentPage = 2;
      component.showPagin = true;
      component.actionEndHandler(args);


    });
  });
});

describe('Fund Scoping Template', () => {

  let router: Router;
  let component: CustomGridComponent;
  let fixture: ComponentFixture<CustomGridComponent>;
  const fundScopingColumn = fundScopingColumnDef;
  let addFundGetDataService: AddFundGetDataService;
  const fsData: rowdatamodel[] = [{
    analysisId: 764,
    fundName: "CITCO123123213waa",
    fundType: "Venture Capital Fund",
    investmentType: [
      "Options",
      "FX Forwards"
    ],
    fundAdminName: "HC Global",
    brokerCustodianName: [
      "Deutsche",
      "Goldman Sachs",
      "Morgan Stanley"
    ],
    currencyCode: "AFN",
    fundStatusId: 1,
    periodStartDate: "2023-04-07T18:30:00.000Z",
    periodEndDate: "2023-04-09T18:30:00.000Z",
    groupName: "Group1",
    createdBy: "testuser",
    createdDate: "2023-04-07T07:25:45.882",
    show: true, //used to show hide expand view not related to API property.
    editImportStatus: false,
    screenTieOut: false,
    investmentS: false,
    investmentFVR: false,
    existencVS: false,
    DerivativesFVR: false,
    SOIPrep: false,
    SOIPres: false,
    IsSelected: false,
    fundId: 849,
    index: 1,
    fundStatusName: '',
    "invstType": "OptionsFX Forwards",
    expectedAuditSignOffDate: "2023-04-17T18:30:00.000Z",
    "materiality": 73.72,
    "performanceMateriality": 455455455,
    "auditMisstatementPostingThreshold": 98745613,
    "engagementAndFundGroupMappingId": null,
    "fundGroupName": null,
    "engagementFundGroupStatus": "",
    isFundInProgress: false,
    isUpdated: false
  }]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, GridModule,
        GridAllModule,
        ButtonModule,
        TooltipModule,
        HttpClientModule,
        StoreModule.forRoot(rootReducer)
      ],
      providers: [DatePipe, AddFundGetDataService],
      declarations: [CustomGridComponent]
    })
      .compileComponents();
  })
  beforeEach(() => {
    fixture = TestBed.createComponent(CustomGridComponent);
    component = fixture.componentInstance;
    component.UseFundScopingTemple = true;
    component.columnsList = fundScopingColumn;
    component.data = fsData;
    router = TestBed.inject(Router);
    addFundGetDataService = TestBed.inject(AddFundGetDataService);
    fixture.detectChanges();
  })
  // it('should toggle showPeriodStartDate and set setPeriodMinDates on double-click', async () => {
  //   component.showPeriodStartDate = [false, false];
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   const i = 0;
  //   const periodStartDate = new Date('2022-03-29');
  //   const data = { index: i, periodStartDate: periodStartDate };
  //   spyOn(component, 'getNextDay').and.returnValue('2023-04-20');
  //   const tdEl = fixture.debugElement.query(By.css('.fs-pstartDate'));
  //   const clickEle = tdEl.query(By.css('.table-data'));
  //   clickEle.triggerEventHandler('dblclick', null);
  //   fixture.detectChanges();
  //   const inputEl = tdEl.query(By.css('#fsPstartDate'));
  //   expect(component.showPeriodStartDate[i]).toBeTruthy();
  //   expect(component.setPeriodMinDates[i]).toEqual('2023-04-20');
  //   expect(inputEl.nativeElement.value).toEqual('2022-03-29');
  //   inputEl.triggerEventHandler('blur', null);
  //   fixture.detectChanges();

  //   expect(component.showPeriodStartDate[i]).toBeFalsy();
  // });
  // it('should toggle showPeriodEndDate on double-click', async () => {
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   const i = 0;
  //   const periodEndDate = new Date('2022-03-29');
  //   const data = { index: i, periodEndDate };
  //   const tdEl = fixture.debugElement.query(By.css('.fs-pEndDate'));
  //   const clickEle = tdEl.query(By.css('.table-data'));
  //   clickEle.triggerEventHandler('dblclick', null);
  //   fixture.detectChanges();

  //   const inputEl = tdEl.query(By.css('#fsPEndDate'));
  //   expect(component.showPeriodEndDate[i]).toBeTruthy();
  //   expect(inputEl.nativeElement.value).toEqual('2022-03-29');

  //   inputEl.triggerEventHandler('blur', null);
  //   fixture.detectChanges();
  //   expect(component.showPeriodEndDate[i]).toBeFalsy();
  // });
  // it('should toggle auditSign off on double-click', async () => {
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   const i = 0;
  //   const auditSign = new Date('2022-03-29');
  //   const data = { index: i, auditSign };
  //   const tdEl = fixture.debugElement.query(By.css('.fs-auditSign'));
  //   const clickEle = tdEl.query(By.css('.table-data'));
  //   clickEle.triggerEventHandler('dblclick', null);
  //   fixture.detectChanges();
  //   const inputEl = tdEl.query(By.css('#fsAudiSignInput'));

  //   expect(component.showAuditSignOff[i]).toBeTruthy();
  //   expect(inputEl.nativeElement.value).toEqual('2022-03-29');

  //   inputEl.triggerEventHandler('blur', null);
  //   fixture.detectChanges();
  //   expect(component.showAuditSignOff[i]).toBeFalsy();
  // });


  it('should allow only number and decimal values and set materialityEditting flag to true', () => {
    const event = { which: 50 };
    const i = 0;
    spyOn(component, 'allowOnlyNumberandDecimalvalue').and.returnValue(true);
    const result = component.onMaterialityKeyDown(event, i);
    expect(component.allowOnlyNumberandDecimalvalue).toHaveBeenCalledWith(event);
    expect(result).toBe(true);
  });



  it('should allow decimal point', () => {
    const event = { which: 46 };

    const result = component.allowOnlyNumberandDecimalvalue(event);

    expect(result).toBe(true);
  });

  it('should allow only numeric values', () => {
    const event = { which: 50 };

    const result = component.allowOnlyNumberandDecimalvalue(event);

    expect(result).toBe(true);
  });

  it('should not allow non-numeric values', () => {
    const event = { which: 65 };

    const result = component.allowOnlyNumberandDecimalvalue(event);

    expect(result).toBe(false);
  });

  it("Should refresh the grid if grid refresh is required", () => {
    component.isGridRefreshRequired = true;
    spyOn(component.grid, "refresh");
    component.ngAfterOnChange();
    fixture.detectChanges();
    expect(component.grid.refresh).toHaveBeenCalled();

  });

  it("Should execute ngOnChanges if @input variable changes for view engagement", () => {
    component.initialSortSettings = true;
    component.sortOptionsforgrid = [];
    component.data = [];
    component.intialSortSettingValues = [1, 2];
    component.isViewEngagement = true;
    sessionStorage.setItem('isSearch', '1')
    fixture.detectChanges();
    component.ngOnChanges({
      initialSortSettings: new SimpleChange(true, false, false)
    });

    // component.ngOnChanges({ initialSortSettings: { currentValue: 'New Value', previousValue: 'Initial Value', isFirstChange: () => false } });
    expect(component.sortOptionsforgrid).toEqual(component.intialSortSettingValues);
  });

  it("Should execute ngOnChanges if @input variable changes for fond console", () => {
    component.initialSortSettings = true;
    component.sortOptionsforgrid = [];
    component.data = [];
    component.intialSortSettingValues = [1, 2];
    component.isViewEngagement = false;
    component.UseFundConsoleTemple = true;
    sessionStorage.setItem('isSearch', '1');
    fixture.detectChanges();
    component.ngOnChanges({
      initialSortSettings: new SimpleChange(true, false, false)
    });

    expect(component.sortOptionsforgrid).toEqual(component.intialSortSettingValues);
  });

  it("Should initiate change detection ref if there is change in data", () => {
    spyOn(component.cdr, "detectChanges")
    component.initialSortSettings = true;
    component.sortOptionsforgrid = [];
    component.data = [];
    component.intialSortSettingValues = [1, 2];
    component.isViewEngagement = false;
    component.UseFundConsoleTemple = true;
    sessionStorage.setItem('isSearch', '1')
    fixture.detectChanges();
    component.ngOnChanges({ data: { currentValue: 'New Value', previousValue: 'Initial Value', isFirstChange: () => false, firstChange: false } });
    fixture.detectChanges();
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });

  it("Should subscribe to fund detail services", () => {
    spyOn(component, "openEachFieldItem");
    component.subscribeToFundScopingDetailServices();

    component.fundScopingDetailsService.setErrorResponseStatus(true);
    fixture.detectChanges();
    expect(component.editFundErrorResponseStatus).toBe(true);
    expect(component.openEachFieldItem).toHaveBeenCalled();
    expect(component.editFundErrorStatus.error).toBe(true);

    spyOn(component, "closeEachFieldItem");
    component.fundScopingDetailsService.setErrorResponseStatus(false);
    fixture.detectChanges();
    expect(component.editFundErrorResponseStatus).toBe(false);
    expect(component.closeEachFieldItem).toHaveBeenCalled();
    expect(component.editFundErrorStatus.error).toBe(false);

  });

  it("Should collect fund data", () => {
    const responsedata = { data: [{ type: "BrokerCustodian", items: [1, 2, 3] }, { type: "InvestmentType", items: [1, 4, 3] }, { type: "FundType", items: [5, 2, 3] }, { type: "FundAdministrators", items: [1, 2, 9] }, { type: "Currency", items: [8, 2, 3] }] };
    const observableSpy = jasmine.createSpyObj('Observable', ['subscribe']);
    observableSpy.subscribe.and.callFake((successCallback: any) => {
      successCallback(responsedata);
    });
    spyOn(addFundGetDataService, 'getData').and.returnValue(observableSpy);
    component.collectFundData(1);
    fixture.detectChanges();
    expect(component.brokCustData).toEqual(responsedata.data[0].items);
    expect(component.investData).toEqual(responsedata.data[1].items);
    expect(component.fundTypeData).toEqual(responsedata.data[2].items);
    expect(component.fundAdminData).toEqual(responsedata.data[3].items);
    expect(component.currencyData).toEqual(responsedata.data[4].items);

  });

  it('should call subscribeToFundScopingDetailServices', () => {
    spyOn(component, "subscribeToFundScopingDetailServices");
    component.teamManagementTemplate = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.subscribeToFundScopingDetailServices).toHaveBeenCalled();
  })

  it("should open close out", () => {
    const data = customGridConstants.view_engagement;
    spyOn(component.store, "dispatch");
    spyOn(router, 'navigateByUrl')
    component.openCloseOut(data);
    fixture.detectChanges();
    expect(component.store.dispatch).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('fundscoping/close-out-fund');

    const nonAccessData = customGridConstants.view_engagement_non_access;
    component.openCloseOut(nonAccessData);
    fixture.detectChanges();
    expect(component.isMenuOpen).toBe(false);
  });

  it("Should open edit engagement", () => {
    const data = customGridConstants.view_engagement;
    spyOn(router, "navigateByUrl");
    component.openEditEngagement(data);
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledWith('fundscoping/edit-engagement/6');

    const nonAcccess_Data = customGridConstants.view_engagement_non_access;
    component.openEditEngagement(nonAcccess_Data);
    fixture.detectChanges();
    expect(component.isMenuOpen).toBe(false);
  });

  it('should navigate to roll-forward engagement if user has access and status is Closed Out or Roll-Forward Complete', () => {
    const data = { userHasAccessToEngagement: true, engagementStatus: 'Closed Out', engagementId: '123' };
    component.openRollForwardEngagement(data);
    spyOn(router, "navigateByUrl");
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledWith('fundscoping/roll-forward-engagement/123');
    expect(component.accessIssue.next).toHaveBeenCalledWith(false);
  });

  it('should set closeOutIssue to true if user has access and status is not Closed Out or Roll-Forward Complete', () => {
    const data = { userHasAccessToEngagement: true, engagementStatus: 'In Progress', engagementId: '123' };
    component.openRollForwardEngagement(data);
    expect(component.isMenuOpen).toBe(false);
  });

  it('should set accessIssue to true if user does not have access', () => {
    const nonAcccess_Data = customGridConstants.view_engagement_non_access;
    component.openRollForwardEngagement(nonAcccess_Data);
    expect(component.isMenuOpen).toBe(false);
  });

  it("Should open each field item", () => {
    const index = 0;
    component.openEachFieldItem(index, 'fundName');
    fixture.detectChanges();
    expect(component.showFundName[index]).toEqual(true);

    component.openEachFieldItem(index, 'fundAdminId');
    fixture.detectChanges();
    expect(component.showFundAdminSelect[index]).toEqual(true);

    component.openEachFieldItem(index, 'currencycode');
    fixture.detectChanges();
    expect(component.showCurrencyCodeSelct[index]).toEqual(true);

    component.openEachFieldItem(index, 'fundTypeId');
    fixture.detectChanges();
    expect(component.showFundTypeSelect[index]).toEqual(true);

    component.openEachFieldItem(index, 'investmentTypeId');
    fixture.detectChanges();
    expect(component.showInvestMultiSelect[index]).toEqual(true);

    component.openEachFieldItem(index, 'brokercustodiantype');
    fixture.detectChanges();
    expect(component.showMultiSelect[index]).toEqual(true);

    component.openEachFieldItem(index, 'periodstartdate');
    fixture.detectChanges();
    expect(component.showPeriodStartDate[index]).toEqual(true);

    component.openEachFieldItem(index, 'periodenddate');
    fixture.detectChanges();
    expect(component.showPeriodEndDate[index]).toEqual(true);

    component.openEachFieldItem(index, 'expectedauditsignoffdate');
    fixture.detectChanges();
    expect(component.showAuditSignOff[index]).toEqual(true);

    component.openEachFieldItem(index, 'mat');
    fixture.detectChanges();
    expect(component.showMateriality[index]).toEqual(true);

    component.openEachFieldItem(index, 'pm');
    fixture.detectChanges();
    expect(component.showPm[index]).toEqual(true);

    component.openEachFieldItem(index, 'ampt');
    fixture.detectChanges();
    expect(component.showAmpt[index]).toEqual(true);
  });


  it("Should close each field item", () => {
    const index = 0;
    component.closeEachFieldItem(index, 'fundName');
    fixture.detectChanges();
    expect(component.showFundName[index]).toEqual(false);

    component.closeEachFieldItem(index, 'fundAdminId');
    fixture.detectChanges();
    expect(component.showFundAdminSelect[index]).toEqual(false);

    component.closeEachFieldItem(index, 'currencycode');
    fixture.detectChanges();
    expect(component.showCurrencyCodeSelct[index]).toEqual(false);

    component.closeEachFieldItem(index, 'fundTypeId');
    fixture.detectChanges();
    expect(component.showFundTypeSelect[index]).toEqual(false);

    component.closeEachFieldItem(index, 'investmentTypeId');
    fixture.detectChanges();
    expect(component.showInvestMultiSelect[index]).toEqual(false);

    component.closeEachFieldItem(index, 'brokercustodiantype');
    fixture.detectChanges();
    expect(component.showMultiSelect[index]).toEqual(false);

    component.closeEachFieldItem(index, 'periodstartdate');
    fixture.detectChanges();
    expect(component.showPeriodStartDate[index]).toEqual(false);

    component.closeEachFieldItem(index, 'periodenddate');
    fixture.detectChanges();
    expect(component.showPeriodEndDate[index]).toEqual(false);

    component.closeEachFieldItem(index, 'expectedauditsignoffdate');
    fixture.detectChanges();
    expect(component.showAuditSignOff[index]).toEqual(false);

    component.closeEachFieldItem(index, 'mat');
    fixture.detectChanges();
    expect(component.showMateriality[index]).toEqual(false);

    component.closeEachFieldItem(index, 'pm');
    fixture.detectChanges();
    expect(component.showPm[index]).toEqual(false);

    component.closeEachFieldItem(index, 'ampt');
    fixture.detectChanges();
    expect(component.showAmpt[index]).toEqual(false);
  });

  xit("Should add or remove ids list based on select and deselect checkboxes", () => {
    spyOn(component.rowSelected, "emit");
    component.data = customGridConstants.fund_detail_checkbox_selection_data;
    const e = { target: { checked: true, value: 765 } };
    let emittedValue: any;
    component.rowSelected.subscribe((value) => (emittedValue = value));
    component.onCheckboxChange(e);
    fixture.detectChanges();
    expect(component.selectedFundIds).toEqual([{ analysisId: 765 }, { analysisId: 767 }, { analysisId: 768 }]);
    expect(emittedValue).toEqual(component.selectedFundIds);
    expect(component.rowSelected.emit).toHaveBeenCalledWith(component.selectedFundIds);

    spyOn(component, "remove");
    const e1 = { target: { checked: false, value: 765 } };

    component.onCheckboxChange(e1);
    fixture.detectChanges();
    expect(component.selctedFundId).toEqual(765);
    expect(component.rowSelected.emit).toHaveBeenCalledWith(component.selectedFundIds);
    expect(component.remove).toHaveBeenCalledWith(component.selctedFundId);
  });

  it("Should remove the id from the selected analysis ids list if checkbox is unchecked", () => {
    component.selectedFundIds = [{ analysisId: 765 }, { analysisId: 767 }, { analysisId: 768 }];
    component.remove(767);
    fixture.detectChanges();
    expect(component.selectedFundIds).toEqual([{ analysisId: 765 }, { analysisId: 768 }]);
  });

  it("Should call onDoubleClick", () => {
    spyOn(component, "clearErrorStatusAndMsg");
    let data = customGridConstants.fund_detail_double_click;
    component.brokCustData = customGridConstants.fund_detail_brokCustData;
    component.onDoubleClick(data, 0);
    fixture.detectChanges();
    expect(component.clearErrorStatusAndMsg).toHaveBeenCalled();
    expect(component.showMultiSelect[0]).toEqual(true);
    expect(component.brokCustoSelected).toEqual([4, 6, 9, 12, 32]);
  });

  it("Should execute investmentTypeClick", () => {
    spyOn(component, "closeEachFieldItem");
    spyOn(component, "clearErrorStatusAndMsg");
    const event = new MouseEvent('MouseEvent');
    component.investmentTypeClick(event, customGridConstants.fund_detail_double_click, 0);
    fixture.detectChanges();
    expect(component.closeEachFieldItem).toHaveBeenCalled();
    expect(component.clearErrorStatusAndMsg).toHaveBeenCalled();
  });

  it("Should execute onFundTypeClick", () => {
    spyOn(component, "closeEachFieldItem");
    spyOn(component, "clearErrorStatusAndMsg");
    const event = new MouseEvent('MouseEvent');
    component.onFundTypeClick(event, customGridConstants.fund_detail_double_click, 0);
    fixture.detectChanges();
    expect(component.closeEachFieldItem).toHaveBeenCalled();
    expect(component.clearErrorStatusAndMsg).toHaveBeenCalled();
  });

  it("Should execute onFundAdminClick", () => {
    spyOn(component, "closeEachFieldItem");
    spyOn(component, "clearErrorStatusAndMsg");
    component.onFundAdminClick(customGridConstants.fund_detail_double_click, 0);
    fixture.detectChanges();
    expect(component.closeEachFieldItem).toHaveBeenCalled();
    expect(component.clearErrorStatusAndMsg).toHaveBeenCalled();
  });

  it("Should execute onCurrencyCodeClick", () => {
    spyOn(component, "closeEachFieldItem");
    spyOn(component, "clearErrorStatusAndMsg");
    component.onCurrencyCodeClick(customGridConstants.fund_detail_double_click, 0);
    fixture.detectChanges();
    expect(component.closeEachFieldItem).toHaveBeenCalled();
    expect(component.clearErrorStatusAndMsg).toHaveBeenCalled();
  });

  it("Should execute onFundNameClick", () => {
    spyOn(component, "closeEachFieldItem");
    spyOn(component, "clearErrorStatusAndMsg");
    const event = new MouseEvent('MouseEvent');
    component.onFundNameClick(event, customGridConstants.fund_detail_double_click, 0);
    fixture.detectChanges();
    expect(component.closeEachFieldItem).toHaveBeenCalled();
    expect(component.clearErrorStatusAndMsg).toHaveBeenCalled();
  });

  it("Should return payload for save materiality", () => {
    const data = customGridConstants.fund_detail;
    const fieldName = 'mat';
    const event = { srcElement: { className: "saveMateriality" }, target: { value: '' } };
    fixture.detectChanges();
    expect(component.payloadInfoForSaveMateriality(data, event, fieldName)).toEqual(null);

    const event2 = { srcElement: { className: "saveMateriality" }, target: { value: '200' } };
    fixture.detectChanges();
    expect(component.payloadInfoForSaveMateriality(data, event2, fieldName)).toEqual('200');
  });

  it("Should return payload for save PM", () => {
    const data = customGridConstants.fund_detail;
    const fieldName = 'pm';
    const event = { srcElement: { className: "savePM" }, target: { value: '' } };
    fixture.detectChanges();
    expect(component.payloadInfoForSavePM(data, event, fieldName)).toEqual(null);

    const event2 = { srcElement: { className: "savePM" }, target: { value: '200' } };
    fixture.detectChanges();
    expect(component.payloadInfoForSavePM(data, event2, fieldName)).toEqual('200');
  });

  it("Should return payload for save AMPT", () => {
    const data = customGridConstants.fund_detail;
    const fieldName = 'ampt';
    const event = { srcElement: { className: "saveAMPT" }, target: { value: '' } };
    fixture.detectChanges();
    expect(component.payloadInfoForSaveAMPT(data, event, fieldName)).toEqual(null);

    const event2 = { srcElement: { className: "saveAMPT" }, target: { value: '200' } };
    fixture.detectChanges();
    expect(component.payloadInfoForSaveAMPT(data, event2, fieldName)).toEqual('200');
  });

  it("Should check the fund name error", () => {
    spyOn(component.fundNameValidation, "emit");
    const error = { status: true, message: Constants.minimumThreeCharacters }
    const data = 'Ne';
    component.fundNameErrorCheck(data, 1);
    fixture.detectChanges();
    expect(component.isFundNameValid).toBe(false);
    expect(component.fundNameValidation.emit).toHaveBeenCalledWith(error);

    const error1 = { status: true, message: 'Fund name should contain at least 1 letter. Please enter a different fund name to proceed' }
    const data1 = '12234';
    component.fundNameErrorCheck(data1, 1);
    fixture.detectChanges();
    expect(component.isFundNameValid).toBe(false);
    expect(component.fundNameValidation.emit).toHaveBeenCalledWith(error1);


    const error2 = { status: true, message: 'Mandatory fields. Please enter valid details and proceed.' };
    const data2 = '';
    component.fundNameErrorCheck(data2, 1);
    fixture.detectChanges();
    expect(component.isFundNameValid).toBe(true);
    expect(component.fundNameValidation.emit).toHaveBeenCalledWith(error2);

  });

  it("Should check the fundname and set based on its existance", () => {
    const data = customGridConstants.fund_detail;
    component.checkAndSetIfExistingFundName(data);
    fixture.detectChanges();
    expect(component.editFundErrorStatus.error).toBe(true);


    component.selectedIndexValue = 1;
    component.selectedFieldName = 'fundName';
    spyOn(component, "closeEachFieldItem");
    const data1 = null;
    component.checkAndSetIfExistingFundName(data1);
    fixture.detectChanges();
    expect(component.editFundErrorStatus.error).toBe(false);
    expect(component.closeEachFieldItem).toHaveBeenCalledWith(1, 'fundName');
  });

  it("Should save fund name", () => {
    spyOn(component, "saveFundData");
    const data = { fundName: "test fund" };
    const e = { target: { value: "test fund1" } };
    component.saveFundName(e, data, 1);
    fixture.detectChanges();
    expect(component.editFundErrorStatus.error).toBe(false);
    expect(component.saveFundData).toHaveBeenCalled();
  });

  it("Should call Save fund data on fund admin change", () => {
    spyOn(component, "saveFundData");
    const data = { fundName: "New Fund" };
    const e = true;
    component.onFundAdminChange(data, e);
    fixture.detectChanges();
    expect(component.showFundAdminSelect).toEqual([]);
    expect(component.saveFundData).toHaveBeenCalledWith(data, e, 'fundAdminId', 'fundadmintrue');

  });

  it("Should call close each field items on function call of closeBrokerCustodianField", () => {
    spyOn(component, "closeEachFieldItem");
    component.editFundErrorStatus.error = false;
    component.closeBrokerCustodianField(1);
    fixture.detectChanges();
    expect(component.closeEachFieldItem).toHaveBeenCalledWith(1, 'brokercustodiantype');
  });

  it("Should save or throw error on broker custodian change", () => {
    spyOn(component, "saveFundData");
    const data = customGridConstants.fund_detail;
    const e = { value: "ABC" };
    component.onbrokerCustodianNameChange(data, e);
    fixture.detectChanges();
    expect(component.saveFundData).toHaveBeenCalledWith(data, e, 'brokercustodiantype', 'brokercustodiantypetrue');
  })

  it("Should save fund data on currency code change", () => {
    spyOn(component, "saveFundData");
    const data = customGridConstants.fund_detail;
    const e = { value: "ABC" };
    component.onCurrencyCodeChange(data, e);
    fixture.detectChanges();
    expect(component.saveFundData).toHaveBeenCalledWith(data, e, 'currencycode', 'currencytrue');
  });

  it("Should show error if new value is empty", () => {
    spyOn(component, "tirggerMandatoryError");
    const event = { target: { value: '' } };
    const data = { index: 0 };
    component.periodSartEditting = [false];
    component.onFocusIn(event, data, 'psDate');
    expect(component.periodSartEditting[data.index]).toBe(true);
    expect(component.tirggerMandatoryError).toHaveBeenCalledWith(data, 'periodstartdate');

    component.periodEndEditting = [false];
    component.onFocusIn(event, data, 'peDate');
    expect(component.periodEndEditting[data.index]).toBe(true);
    expect(component.tirggerMandatoryError).toHaveBeenCalledWith(data, 'periodenddate');

    component.auditSignOffEditting = [false];
    component.onFocusIn(event, data, 'audiSoffDate');
    expect(component.auditSignOffEditting[data.index]).toBe(true);
    expect(component.tirggerMandatoryError).toHaveBeenCalledWith(data, 'expectedauditsignoffdate');
  });


  it("Should trigger mandatory error", () => {
    spyOn(component.fundNameValidation, "emit");
    const data = { index: 0 };
    const fieldName = 'fundName';
    const error = { status: true, message: "Mandatory fields. Please enter valid details and proceed." };
    component.tirggerMandatoryError(data, fieldName);
    fixture.detectChanges();
    expect(component.editFundErrorStatus.error).toBe(true);
    expect(component.fundNameValidation.emit).toHaveBeenCalledWith(error);
    expect(component.selectedFieldName).toBe(fieldName);
    expect(component.selectedIndexValue).toBe(data.index);
  });

  it('should toggle dropdown', () => {
    component.dropdownOpen = false;
    component.toggleDropdown();
    expect(component.dropdownOpen).toBeTrue();

    component.toggleDropdown();
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should add new option', () => {
    spyOn(component.fundScopingDetailsService, 'saveEngagementFundGroup').and.returnValue(of({ succeeded: true, data: { engagementAndFundGroupMappingId: 1, fundGroupName: 'New Group' }}));
    component.newOption = 'New Group';
    component.addOption(customGridConstants.fund_detail_double_click, 1);
    expect(component.newOption).toBe('');
    expect(component.error).toBe('');
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should clear selection', () => {
    spyOn(component.fundScopingDetailsService, 'deleteEngagementFundGroupAndFundMapping').and.returnValue(of({ succeeded: true, isDeleted: true }));
    component.removeFundGroup(new Event('click'), { fundId: 1, fundGroupName: 'Existing Group', engagementAndFundGroupMappingId: 1, engagementId: 1, analysisId: 1 }, 0);
    expect(component.selectedFundGroup).toBe('');
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should handle fund group click', () => {
    component.engagementFundGroups = [{ id: 1, value: 'Group 1' }, { id: 2, value: 'Group 2' }];
    component.onFundGroupClick(new MouseEvent('click'), { fundGroupName: 'Group 1' }, 0);
    expect(component.selectedFundGroup).toBe(1);
    expect(component.showFundGroupSelect[0]).toBeTrue();
  });

  it('should handle input change', () => {
    component.newOption = 'Test Option';
    component.onInputChange();
    expect(component.newOption).toBe('Test Option');
  });

  it('should prevent special characters if not allowed', () => {
    component.allowSpecialChars = false;
    const event = new KeyboardEvent('keypress', { key: '!' });
    spyOn(event, 'preventDefault');
    component.onKeyPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow alphanumeric characters', () => {
    component.allowSpecialChars = false;
    const event = new KeyboardEvent('keypress', { key: 'A' });
    spyOn(event, 'preventDefault');
    component.onKeyPress(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should handle option selection', () => {
    spyOn(component.fundScopingDetailsService, 'saveEngagementFundGroupAndFundMapping').and.returnValue(of({ succeeded: true }));
    component.selectOption({ engagementAndFundGroupMappingId: 1, fundGroupName: 'Group 1' }, { fundId: 1, fundGroupName: 'Group 1', engagementId: 1, analysisId: 1 }, 0);
    expect(component.selectedFundGroup).toEqual({ engagementAndFundGroupMappingId: 1, fundGroupName: 'Group 1' });
  });

  it('should handle saveAuditSignOff with fund group', () => {
    const event = { target: { value: '2025-12-31' } };
    const data = { fundGroupName: 'Group 1', index: 0 };
    component.saveAuditSignOff(event, data);
    expect(component.showPopup).toBeTrue();
  });

  it('should trigger close button', () => {
    component.triggerCloseBtn();
    expect(component.showPopup).toBeFalse();
  });

  it('should call saveAuditSignOffDate', () => {
    spyOn(component, 'calledSaveAuditSignOffDate');
    component.isUserConfired({});
    expect(component.calledSaveAuditSignOffDate).toHaveBeenCalled();
  });

  it('should save engagement fund group if count is within limit', () => {
    spyOn(component.fundScopingDetailsService, 'saveEngagementFundGroupAndFundMapping').and.returnValue(of({ succeeded: true }));

    const option = { engagementAndFundGroupMappingId: 1, fundGroupName: 'New Group' };
    component.selectOption(option, customGridConstants.fund_detail_double_click, 1);

    expect(component.selectedFundGroup).toEqual(option);
    expect(component.showFundGroupSelect[0]).toBeFalse();
  });

  it('should emit error if fund group count exceeds limit', () => {
    spyOn(component.fundNameValidation, 'emit');

    component.engagementFundGroupCount = 11

    const option = { engagementAndFundGroupMappingId: 1, fundGroupName: 'New Group' };
    component.selectOption(option, customGridConstants.fund_detail_double_click, 1);

    expect(component.fundNameValidation.emit).toHaveBeenCalledWith({
      status: true,
      message: `Only 10 funds can be grouped together.`
    });
  });

  it('should create and select new fund group', () => {
    spyOn(component.fundScopingDetailsService, 'saveEngagementFundGroup').and.returnValue(of({
      succeeded: true,
      data: { engagementAndFundGroupMappingId: 2, fundGroupName: 'New Group' }
    }));

    component.newOption = 'New Group';
    component.addOption(customGridConstants.fund_detail_double_click, 0);

    expect(component.newOption).toBe('');
    expect(component.error).toBe('');
    expect(component.dropdownOpen).toBeFalse();
  });

  it('should set error for invalid group names', () => {
    component.newOption = 'Ungrouped';
    component.addOption(customGridConstants.fund_detail_double_click, 1);

    expect(component.error).toBe(`Please pick a different name – 'Ungrouped' is reserved`);
  });

  it('should remove fund from group and delete if necessary', () => {
    spyOn(component.fundScopingDetailsService, 'deleteEngagementFundGroupAndFundMapping').and.returnValue(of(JSON.stringify({ succeeded: true, isDeleted: true })));

    component.removeFundGroup(new MouseEvent('click'), customGridConstants.fund_detail_double_click, 1);

    expect(component.selectedFundGroup).toBe('');
    expect(customGridConstants.fund_detail_double_click.fundGroupName).toBe('');
  });

  it('should toggle fund group selection', () => {
    spyOn(component, 'clearErrorStatusAndMsg');
    spyOn(component, 'closeEachFieldItem');

    component.onFundGroupClick(new MouseEvent('click'), customGridConstants.fund_detail_double_click, 1);

    expect(component.clearErrorStatusAndMsg).toHaveBeenCalled();
    expect(component.closeEachFieldItem).toHaveBeenCalled();
    expect(component.showFundGroupSelect[0]).toBeTrue();
  });

  it('should display dropdown-container when showFundGroupSelect is true', () => {
    component.showFundGroupSelect = [true];
    fixture.detectChanges();
    const dropdownElement = fixture.debugElement.query(By.css('.dropdown-container'));
    expect(dropdownElement).toBeTruthy();
  });

  it('should display no-group-message when fundGroupName is not present', () => {
    component.data = fsData;
    fixture.detectChanges();
    const noGroupMessageElement = fixture.debugElement.query(By.css('.no-group-message'));
    expect(noGroupMessageElement).toBeTruthy();
  });

  it('should trigger toggleDropdown on dropdown-header click', () => {
    spyOn(component, 'toggleDropdown');
    const dropdownHeaderElement = fixture.debugElement.query(By.css('.dropdown-header'));
    dropdownHeaderElement.triggerEventHandler('click', null);
    expect(component.toggleDropdown).toHaveBeenCalled();
  });

  it('should trigger removeFundGroup on clearSpan icon click', () => {
    spyOn(component, 'removeFundGroup');
    const clearSpanElement = fixture.debugElement.query(By.css('.clearSpan i'));
    clearSpanElement.triggerEventHandler('click', new Event('click'));
    expect(component.removeFundGroup).toHaveBeenCalled();
  });

  it('should display custom-confirmation-dialog when showPopup is true', () => {
    component.showPopup = true;
    fixture.detectChanges();
    const dialogElement = fixture.debugElement.query(By.css('custom-confiramtion-dialog'));
    expect(dialogElement).toBeTruthy();
  });

});

fdescribe('Dashboard Template', () => {
  let component: CustomGridComponent;
  let fixture: ComponentFixture<CustomGridComponent>;
  let router: Router;
  const dashBoardColumn = [
    {
      header: 'Engagement Name',
      type: 'string',
      visible: true,
      key: 'engagementname',
      //  width: 150,
      minWidth: '95',
    },
    {
      header: 'Funds/Entities Name',
      type: 'string',
      visible: true,
      key: 'fundName',
      //  width: 150,
      minWidth: '95',
    },
    {
      header: 'Type of Funds/Entities',
      type: 'string',
      visible: true,
      key: 'fundType',
      // width: 150,
      minWidth: '55',
    },
    {
      header: 'Type of Investments',
      type: 'string',
      visible: true,
      key: 'invstType',
      // width: 180,
      minWidth: '49',
    },
    {
      header: 'Administrator',
      type: 'string',
      visible: true,
      key: 'fundAdminName',
      // width: 180,
      minWidth: '60',
    },
    {
      header: 'Broker/Custodians',
      type: 'string',
      visible: true,
      key: 'brokerCusto',
      // width: 180,
      minWidth: '60',
    },
    {
      header: 'Reporting Currency',
      type: 'string',
      visible: true,
      key: 'currencyCode',
      // width: 180,
      minWidth: '80',
    },
    {
      header: 'Period Begin Date',
      type: 'date',
      visible: true,
      key: 'periodStartDate',
      // width: 150,
      minWidth: '110',
      format: 'MM/dd/YYYY',
    },
    {
      header: 'Period End Date',
      type: 'date',
      visible: true,
      key: 'periodEndDate',
      // width: 150,
      minWidth: '110',
      format: 'MM/dd/YYYY',
    },
  ];
  const dshBoardData: rowdatamodel[] = [{
    analysisId: 764,
    fundName: "CITCO123123213waa",
    fundType: "Venture Capital Fund",
    investmentType: [
      "Options",
      "FX Forwards"
    ],
    fundAdminName: "HC Global",
    brokerCustodianName: [
      "Deutsche",
      "Goldman Sachs",
      "Morgan Stanley"
    ],
    currencyCode: "AFN",
    fundStatusId: 1,
    periodStartDate: "2023-04-07T18:30:00.000Z",
    periodEndDate: "2023-04-09T18:30:00.000Z",
    groupName: "Group1",
    createdBy: "testuser",
    createdDate: "2023-04-07T07:25:45.882",
    show: true, //used to show hide expand view not related to API property.
    editImportStatus: false,
    screenTieOut: false,
    investmentS: false,
    investmentFVR: false,
    existencVS: false,
    DerivativesFVR: false,
    SOIPrep: false,
    SOIPres: false,
    IsSelected: false,
    fundId: 849,
    index: 1,
    fundStatusName: '',
    "invstType": "OptionsFX Forwards",
    expectedAuditSignOffDate: "2023-04-17T18:30:00.000Z",
    "materiality": 73.72,
    "performanceMateriality": 455455455,
    "auditMisstatementPostingThreshold": 98745613,
    "routineReport": null,
    "engagementAndFundGroupMappingId": 1,
    "fundGroupName": "Group 1 ",
    "engagementFundGroupStatus": "",
    isFundInProgress:false,
    isUpdated:false
  }]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, GridModule,
        GridAllModule,
        ButtonModule,
        TooltipModule,
        HttpClientModule,
        StoreModule.forRoot(rootReducer)
      ],
      providers: [DatePipe, AddFundGetDataService],
      declarations: [CustomGridComponent, GridComponent]
    })
      .compileComponents();
  });
  beforeEach(async () => {
    fixture = TestBed.createComponent(CustomGridComponent);
    component = fixture.componentInstance;
    component.UseFundConsoleTemple = true;
    component.UseFundScopingTemple = false;
    component.columnsList = dashBoardColumn;
    component.data = dshBoardData;
    component.showPagin = true;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  })
  xit('Button section is available at section', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.dashboardAccordion = [];
    component.dashboardAccordion[1] = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.query(By.css('.child-button'));
    const primaryBtn = element.query(By.css('.app-btn-primary'));
    expect(primaryBtn).toBeDefined();
  })
  xit('Button section is available with "Go to Analysis" text', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.dashboardAccordion = [];
    component.dashboardAccordion[1] = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.query(By.css('.child-button'));
    const primaryBtn = element.query(By.css('.app-btn-primary'));
    const span = primaryBtn.query(By.css('span')).nativeElement;
    expect(primaryBtn).toBeDefined();
    expect(span.textContent.trim()).toEqual('Go to Analysis');
  });
  xit('The "Go to Anslysis" button should be disabled if the if the fund does not have routine ', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.dashboardAccordion[1] = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.query(By.css('.child-button'));
    const primaryBtn = element.query(By.css('.app-btn-primary')).nativeElement;
    expect(primaryBtn).toHaveClass('btn-disabled');
  })
  xit('The "Type of Investments" and "Broker/Custodians" heading should be there ', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.dashboardAccordion[1] = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.queryAll(By.css('.child-info'));
    const invHead = element[0].query(By.css('h5')).nativeElement;
    expect(invHead.textContent.trim()).toEqual('Type of Investments');
    const brokHead = element[1].query(By.css('h5')).nativeElement;
    expect(brokHead.textContent.trim()).toEqual('Broker/Custodians');
  })
  xit('The Type of Investments section listing the Type of Investments data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.dashboardAccordion[1] = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.nativeElement.querySelector('.child-investment');
    const list = element.querySelectorAll('li');
    const inv: any = dshBoardData[0].investmentType;
    expect(list.length).toEqual(inv.length);
  })
  xit('The Broker/Custodiens section listing the Broker/Custodiens data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.dashboardAccordion[1] = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.nativeElement.querySelector('.child-brok');
    const list = element.querySelectorAll('li');
    const brok: any = dshBoardData[0].brokerCustodianName;
    expect(list.length).toEqual(brok.length);
  })

  it("Should prevent event on block paste", () => {
    const eventMock = {
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.blockPaste(eventMock);
    fixture.detectChanges();
    expect(eventMock.preventDefault).toHaveBeenCalled();
  });

  it('Should hide scroll on data bound', () => {
    spyOn(component.grid, "hideScroll");
    component.dataBound();
    fixture.detectChanges();
    expect(component.grid.hideScroll).toHaveBeenCalled();
  });

  it("Should append tooltip open dropdowns", () => {
    component.onBrokerCustodianOpen(1, "2");
    fixture.detectChanges();
    expect(component.brokerCustodianTooltip).toBeTruthy();

    component.onFundTypeOpen(1, "2");
    fixture.detectChanges();
    expect(component.onFundTypeOpen).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("It should go to analysis", () => {
    // Mock localStorage data for engagementData method
    const mockEngagementTypeData = [
      { engagementTypeId: 1, engagementType: 'Fund' },
      { engagementTypeId: 2, engagementType: 'Entity' }
    ];
    spyOn((component as any).sharedStorageOperationsService, 'getLocalStorage')
      .and.returnValue(JSON.stringify(mockEngagementTypeData));
    
    spyOn(component.sessionStorageService, "setValue");
    spyOn(component.store, "dispatch");
    spyOn(router, "navigateByUrl");
    
    const engDetails = {
      engagementId: 1,
      engagementName: "Test Engagement",
      periodEndDate: new Date(),
      fundId: 123,
      analysisId: 1906,
      engagementTypeId: 1,
      engagementStatus: 'Active',
      regionDisplayName: 'US'
    };
    
    const obj = { slectedFund: engDetails.fundId, analysisId: engDetails.analysisId };
    component.goToAnalysis(engDetails);
    fixture.detectChanges();
    
    expect(component.sessionStorageService.setValue).toHaveBeenCalledWith('slectedFund', obj);
    expect(component.store.dispatch).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('analysis/tie-outs');
  });

  it("Should save engagemen details from the session storage to store", () => {
    spyOn(component.store, "dispatch");
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.store.dispatch).toHaveBeenCalled()

  });

  xit('Filter button will enable after click on dropdown options', () => {
    const filterBtn = fixture.debugElement.nativeElement.querySelector('.e-flmenu-okbtn');
    const dropdownOption = fixture.debugElement.nativeElement.querySelector('.e-flmenu-valuediv');
    dropdownOption.click();
    fixture.detectChanges();
    expect(filterBtn.disabled).toBe(false);
  });

  describe('Fund Highlighting Functionality', () => {
    beforeEach(() => {
      // Clear any existing session storage before each test
      sessionStorage.clear();
      
      // Setup component with mock data
      component.data = [
        { fundId: 1001, fundName: 'Test Fund 1', brokerCustodianName: ['Broker1'] },
        { fundId: 1002, fundName: 'Test Fund 2', brokerCustodianName: ['Broker2'] },
        { fundId: 1003, fundName: 'Newly Added Fund', brokerCustodianName: ['Broker3'] }
      ] as any;
      
      // Mock grid element with all required properties
      component.grid = {
        element: document.createElement('div'),
        getCurrentViewRecords: () => component.data,
        hideScroll: () => {},
        columns: [],
        dataSource: component.data,
        pageSettings: {
          pageSize: 10,
          currentPage: 1
        },
        currentViewData: component.data
      } as any;
      
      fixture.detectChanges();
    });

    describe('clearFundHighlighting', () => {
      it('should remove newly-added-fund class from all elements', () => {
        // Setup: Create mock elements with the highlighting class
        const mockRow1 = document.createElement('tr');
        const mockRow2 = document.createElement('tr');
        mockRow1.classList.add('newly-added-fund');
        mockRow2.classList.add('newly-added-fund');
        document.body.appendChild(mockRow1);
        document.body.appendChild(mockRow2);

        // Set session storage
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');

        // Act
        (component as any).clearFundHighlighting();

        // Assert
        expect(mockRow1.classList.contains('newly-added-fund')).toBeFalse();
        expect(mockRow2.classList.contains('newly-added-fund')).toBeFalse();
        expect(sessionStorage.getItem('fromAddFund')).toBeNull();
        expect(sessionStorage.getItem('addedFundId')).toBeNull();

        // Cleanup
        document.body.removeChild(mockRow1);
        document.body.removeChild(mockRow2);
      });

      it('should clear session storage even if no highlighted elements exist', () => {
        // Setup
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');

        // Act
        (component as any).clearFundHighlighting();

        // Assert
        expect(sessionStorage.getItem('fromAddFund')).toBeNull();
        expect(sessionStorage.getItem('addedFundId')).toBeNull();
      });
    });

    describe('rowDataBound', () => {
      it('should apply highlighting when session storage indicates new fund', () => {
        // Setup
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');
        
        const mockRowElement = document.createElement('tr');
        const mockEvent = {
          data: { fundId: 1003, fundName: 'Newly Added Fund' },
          row: mockRowElement
        };

        // Act
        component.rowDataBound(mockEvent as any);

        // Assert
        expect(mockRowElement.classList.contains('newly-added-fund')).toBeTrue();
      });

      it('should not apply highlighting when fund ID does not match', () => {
        // Setup
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');
        
        const mockRowElement = document.createElement('tr');
        const mockEvent = {
          data: { fundId: 1001, fundName: 'Different Fund' },
          row: mockRowElement
        };

        // Act
        component.rowDataBound(mockEvent as any);

        // Assert
        expect(mockRowElement.classList.contains('newly-added-fund')).toBeFalse();
      });

      it('should not apply highlighting when session storage is not set', () => {
        // Setup - no session storage
        const mockRowElement = document.createElement('tr');
        const mockEvent = {
          data: { fundId: 1003, fundName: 'Test Fund' },
          row: mockRowElement
        };

        // Act
        component.rowDataBound(mockEvent as any);

        // Assert
        expect(mockRowElement.classList.contains('newly-added-fund')).toBeFalse();
      });

      it('should handle primary key setting for brokerCustodian column', () => {
        // Setup
        const mockColumn = { field: 'brokerCustodian', isPrimaryKey: false };
        component.grid.columns = [mockColumn];
        
        const mockEvent = {
          data: { fundId: 1001 },
          row: document.createElement('tr')
        };

        // Act
        component.rowDataBound(mockEvent as any);

        // Assert
        expect(mockColumn.isPrimaryKey).toBeTrue();
      });
    });

    describe('dataBound', () => {
      it('should apply highlighting to matching fund after grid render', (done) => {
        // Setup
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');
        
        const mockRow = document.createElement('tr');
        mockRow.classList.add('e-row');
        const gridElement = document.createElement('div');
        gridElement.appendChild(mockRow);
        
        component.grid.element = gridElement;
        
        // Mock the querySelectorAll to return the mock row
        spyOn(component.grid.element, 'querySelectorAll').and.returnValue([mockRow] as any);
        
        // Mock getCurrentViewRecords to return data with matching fund
        spyOn(component.grid, 'getCurrentViewRecords').and.returnValue([
          { fundId: 1003, fundName: 'Newly Added Fund' }
        ]);

        // Act
        component.dataBound();

        // Assert - use setTimeout to wait for the async operation
        setTimeout(() => {
          expect(mockRow.classList.contains('newly-added-fund')).toBeTrue();
          done();
        }, 150);
      });

      it('should not apply highlighting when no matching fund found', (done) => {
        // Setup
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '9999'); // Non-existent fund ID
        
        const mockRow = document.createElement('tr');
        const gridElement = document.createElement('div');
        gridElement.appendChild(mockRow);
        
        component.grid.element = gridElement;
        spyOn(component.grid.element, 'querySelectorAll').and.returnValue([mockRow] as any);

        // Act
        component.dataBound();

        // Assert
        setTimeout(() => {
          expect(mockRow.classList.contains('newly-added-fund')).toBeFalse();
          done();
        }, 150);
      });
    });

    describe('queryCellInfo', () => {
      it('should apply highlighting to row when cell matches added fund', () => {
        // Setup
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');
        
        const mockRow = document.createElement('tr');
        const mockCell = document.createElement('td');
        mockRow.appendChild(mockCell);
        
        const mockArgs = {
          data: { fundId: 1003 },
          cell: mockCell
        };

        // Act
        component.queryCellInfo(mockArgs);

        // Assert
        expect(mockRow.classList.contains('newly-added-fund')).toBeTrue();
      });

      it('should not apply highlighting when fund ID does not match', () => {
        // Setup
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');
        
        const mockRow = document.createElement('tr');
        const mockCell = document.createElement('td');
        mockRow.appendChild(mockCell);
        
        const mockArgs = {
          data: { fundId: 1001 },
          cell: mockCell
        };

        // Act
        component.queryCellInfo(mockArgs);

        // Assert
        expect(mockRow.classList.contains('newly-added-fund')).toBeFalse();
      });
    });

    describe('User Action Clearing', () => {
      beforeEach(() => {
        // Setup highlighting
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');
        
        const mockRow = document.createElement('tr');
        mockRow.classList.add('newly-added-fund');
        document.body.appendChild(mockRow);
      });

      afterEach(() => {
        // Cleanup
        document.querySelectorAll('.newly-added-fund').forEach(el => {
          document.body.removeChild(el);
        });
      });

      it('should clear highlighting on row selection', () => {
        // Setup
        spyOn(component as any, 'clearFundHighlighting');
        const mockEvent = { data: { fundId: 1001 } };

        // Act
        component.rowIsSelected(mockEvent as any);

        // Assert
        expect((component as any).clearFundHighlighting).toHaveBeenCalled();
      });

      it('should clear highlighting on data state change (sort/filter)', () => {
        // Setup
        spyOn(component as any, 'clearFundHighlighting');
        const mockState = { 
          skip: 0, 
          take: 10,
          group: [],
          sort: [],
          filter: []
        };

        // Act
        component.onDataStateChanged(mockState as any);

        // Assert
        expect((component as any).clearFundHighlighting).toHaveBeenCalled();
      });

      it('should clear highlighting on action complete (grid actions)', () => {
        // Setup
        spyOn(component as any, 'clearFundHighlighting');
        spyOn(component, 'prepareQuery').and.returnValue('mocked-query-string');
        const mockArgs = { 
          requestType: 'sorting',
          searchString: '',
          columnName: 'fundName',
          direction: 'Ascending'
        };

        // Mock the required properties for actionEndHandler
        component.showPagin = true;
        component.query = {
          pageSize: 10,
          pageNumber: 1,
          sortBy: '',
          sortDirection: '',
          searchString: '',
          filter: [],
          year: '',
          selectedColumns: ''
        };

        // Act
        component.actionEndHandler(mockArgs);

        // Assert
        expect((component as any).clearFundHighlighting).toHaveBeenCalled();
      });

      it('should clear highlighting on double click (edit action)', () => {
        // Setup
        spyOn(component as any, 'clearFundHighlighting');
        spyOn(component, 'clearErrorStatusAndMsg');
        spyOn(component, 'closeEachFieldItem');
        
        const mockData = { fundStatusName: 'Active' };

        // Act
        component.onDoubleClick(mockData, 0);

        // Assert
        expect((component as any).clearFundHighlighting).toHaveBeenCalled();
      });

      it('should clear highlighting on fund name click (edit action)', () => {
        // Setup
        spyOn(component as any, 'clearFundHighlighting');
        spyOn(component, 'clearErrorStatusAndMsg');
        spyOn(component, 'closeEachFieldItem');
        
        const mockEvent = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);
        const mockData = { fundId: 1001 };

        // Act
        component.onFundNameClick(mockEvent, mockData, 0);

        // Assert
        expect((component as any).clearFundHighlighting).toHaveBeenCalled();
      });

      it('should clear highlighting on save fund data', () => {
        // Setup
        spyOn(component as any, 'clearFundHighlighting');
        spyOn(component, 'payloadInfoForSaveMateriality').and.returnValue(null);
        spyOn(component, 'payloadInfoForSavePM').and.returnValue(null);
        spyOn(component, 'payloadInfoForSaveAMPT').and.returnValue(null);
        
        const mockData = { fundId: 1001 };
        const mockEvent = { target: { value: 'test' } };

        // Act
        component.saveFundData(mockData, mockEvent, 'testField', 'save');

        // Assert
        expect((component as any).clearFundHighlighting).toHaveBeenCalled();
      });

      it('should clear highlighting on navigation to analysis', () => {
        // Setup
        spyOn(component as any, 'clearFundHighlighting');
        spyOn(component, 'engagementData').and.returnValue({
          engagementId: 1,
          engagementName: 'Test',
          periodEndDate: '2025-12-31',
          engStatus: 'Active',
          regionDisplayName: 'US',
          engagementTypeId: 1,
          engagementType: 'Fund'
        });
        spyOn((component as any).router, 'navigateByUrl');
        
        const mockData = { fundId: 1001, analysisId: 2001 };

        // Act
        component.goToAnalysis(mockData);

        // Assert
        expect((component as any).clearFundHighlighting).toHaveBeenCalled();
      });

      it('should clear highlighting on component destroy', () => {
        // Setup
        spyOn(component as any, 'clearFundHighlighting');
        component.rowSelected = jasmine.createSpyObj('EventEmitter', ['emit']);

        // Act
        component.ngOnDestroy();

        // Assert
        expect((component as any).clearFundHighlighting).toHaveBeenCalled();
      });
    });

    describe('Integration Tests', () => {
      it('should complete full highlighting lifecycle: apply -> user action -> clear', () => {
        // Setup: Simulate new fund added
        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');
        
        const mockRowElement = document.createElement('tr');
        const mockEvent = {
          data: { fundId: 1003, fundName: 'Newly Added Fund' },
          row: mockRowElement
        };

        // Step 1: Apply highlighting
        component.rowDataBound(mockEvent as any);
        expect(mockRowElement.classList.contains('newly-added-fund')).toBeTrue();
        expect(sessionStorage.getItem('fromAddFund')).toBe('true');

        // Step 2: User action (row selection)
        const mockRowSelectEvent = { data: { fundId: 1001 } };
        component.rowIsSelected(mockRowSelectEvent as any);

        // Step 3: Verify clearing
        expect(sessionStorage.getItem('fromAddFund')).toBeNull();
        expect(sessionStorage.getItem('addedFundId')).toBeNull();
      });

      it('should handle multiple highlighted rows correctly', () => {
        // Setup multiple rows with highlighting
        const row1 = document.createElement('tr');
        const row2 = document.createElement('tr');
        const row3 = document.createElement('tr');
        
        row1.classList.add('newly-added-fund');
        row2.classList.add('newly-added-fund');
        // row3 intentionally without highlighting
        
        document.body.appendChild(row1);
        document.body.appendChild(row2);
        document.body.appendChild(row3);

        sessionStorage.setItem('fromAddFund', 'true');
        sessionStorage.setItem('addedFundId', '1003');

        // Act
        (component as any).clearFundHighlighting();

        // Assert
        expect(row1.classList.contains('newly-added-fund')).toBeFalse();
        expect(row2.classList.contains('newly-added-fund')).toBeFalse();
        expect(row3.classList.contains('newly-added-fund')).toBeFalse();
        expect(sessionStorage.getItem('fromAddFund')).toBeNull();

        // Cleanup
        document.body.removeChild(row1);
        document.body.removeChild(row2);
        document.body.removeChild(row3);
      });
    });
  });

});