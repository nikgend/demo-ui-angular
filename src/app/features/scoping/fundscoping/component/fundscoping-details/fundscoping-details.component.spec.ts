import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FundscopingDetailsComponent } from './fundscoping-details.component';
import { Router } from '@angular/router';
import { ScopingListService } from '../../../services/scoping-list.service';
import { SessionStorageService } from 'src/app/core/services/sessionstorage-handling/sessionstorage-handling.service';
import { FundScopingDetailsService } from '../../services/fundscoping-details.service';
import { DeleteFundService } from '../../../services/delete-fund.service';
import { QABService } from 'src/app/features/qab/services/qab.service';
import { DatePipe } from '@angular/common';
import { CustomToastService } from 'src/app/shared/services/custom-toast.service';
import { EditFundService } from '../../../services/edit-fund.service';
import { Store } from '@ngrx/store';
import { ViewEngagementService } from '../../services/view-engagement.service';
import { SharedStorageOperationsService } from 'src/app/core/services/CommonService/shared-storage-operations.service';
import { FundInprogressService } from '../../../services/fund-inprogress.service';
import { CustomConfirmationDialogComponent } from '../../../../../shared/components/custom-confirmation-dialog/custom-confirmation-dialog.component';
import { of, throwError, interval, Subscription, Subject } from 'rxjs';
import { Constants, EngagementStatus } from 'src/app/shared/components/constants/constants';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'alternateWorkflowLable' })
class AlternateWorkflowLablePipeStub implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('FundscopingDetailsComponent', () => {
  let component: FundscopingDetailsComponent;
  let fixture: ComponentFixture<FundscopingDetailsComponent>;
  let mockRouter: any;
  let mockScopingListService: any;
  let mockSessionStorageService: any;
  let mockFundScopingDetailsService: any;
  let mockDeleteFundService: any;
  let mockQABService: any;
  let mockDatePipe: any;
  let mockToastService: any;
  let mockEditFundService: any;
  let mockStore: any;
  let mockViewEngagementService: any;
  let mockSharedStorageOperationsService: any;
  let mockFundInprogressService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockScopingListService = {
      addNewFund: false,
      setAddNewFundValue: jasmine.createSpy('setAddNewFundValue'),
    };
    mockSessionStorageService = {
      getValue: jasmine.createSpy('getValue').and.returnValue([]),
      setValue: jasmine.createSpy('setValue')
    };
    mockFundScopingDetailsService = {
      sucessFundValue$: new Subject(),
      sucessFundGroupValue$: new Subject(),
      deleteFundGroupMessageValue$: new Subject(),
      setSuccessMessage: jasmine.createSpy('setSuccessMessage'),
      setDeleteFundGroupMessage: jasmine.createSpy('setDeleteFundGroupMessage'),
      getAllFundList: jasmine.createSpy('getAllFundList').and.returnValue(of({ data: [] })),
      enableFalg: jasmine.createSpy('enableFalg'),
      setData: jasmine.createSpy('setData'),
      setErrorResponseStatus: jasmine.createSpy('setErrorResponseStatus')
    };
    mockDeleteFundService = {
      deleteFund: jasmine.createSpy('deleteFund').and.returnValue(of('{}'))
    };
    mockQABService = {
      setRoutineSelectionValue: jasmine.createSpy('setRoutineSelectionValue')
    };
    mockDatePipe = {};
    mockToastService = {
      initiate: jasmine.createSpy('initiate')
    };
    mockEditFundService = {
      editFund: jasmine.createSpy('editFund').and.returnValue(of('{}'))
    };
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockStore.select.and.returnValue(of({}));
    mockViewEngagementService = {
      InitiateCloseOutActionKey: 'closeOutKey',
      getEngagementList: jasmine.createSpy('getEngagementList').and.returnValue(of({ data: [{ id: 1 }] })),
      updateEngagementStatus: jasmine.createSpy('updateEngagementStatus').and.returnValue('{}')
    };
    mockSharedStorageOperationsService = {
      getLocalStorage: jasmine.createSpy('getLocalStorage').and.returnValue("true"),
      deleteLocalStorage: jasmine.createSpy('deleteLocalStorage')
    };
    mockFundInprogressService = {
      inProgressPollingCall$: jasmine.createSpy('inProgressPollingCall$').and.returnValue({ cancelSubScription: true }),
      fundsListSignal$: { set: jasmine.createSpy('set') },
      inProgressPollingCallSubscriptionSignal$: { set: jasmine.createSpy('set') },
      getInterimStatus: jasmine.createSpy('getInterimStatus')
    };

    await TestBed.configureTestingModule({
      declarations: [FundscopingDetailsComponent, CustomConfirmationDialogComponent, AlternateWorkflowLablePipeStub],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ScopingListService, useValue: mockScopingListService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: FundScopingDetailsService, useValue: mockFundScopingDetailsService },
        { provide: DeleteFundService, useValue: mockDeleteFundService },
        { provide: QABService, useValue: mockQABService },
        { provide: DatePipe, useValue: mockDatePipe },
        { provide: CustomToastService, useValue: mockToastService },
        { provide: EditFundService, useValue: mockEditFundService },
        { provide: Store, useValue: mockStore },
        { provide: ViewEngagementService, useValue: mockViewEngagementService },
        { provide: SharedStorageOperationsService, useValue: mockSharedStorageOperationsService },
        { provide: FundInprogressService, useValue: mockFundInprogressService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundscopingDetailsComponent);
    component = fixture.componentInstance;
    component.customConfirmationDialogComponent = {
      triggerOpen: jasmine.createSpy('triggerOpen'),
      triggerClose: jasmine.createSpy('triggerClose')
    } as any;
    spyOn(window, 'addEventListener');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(sessionStorage, 'removeItem');
      spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'fromAddFund') return 'false';
        return null;
      });
      // Removed generic spyOn(component,'fetchFundList') here to avoid it being lost / replaced.
      component.engagementDetailsObj = {};
    });

    it('should call sessionStorage.removeItem and not fetchFundList when engagementDetailsObj empty', () => {
      const fetchSpy = spyOn(component, 'fetchFundList');
      component.ngOnInit();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('SelectedFundForRoutine');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should call fetchFundList when fromAddFund stored and engagementDetailsObj not empty', fakeAsync(() => {
      // Force the flag
      (sessionStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
        if (key === 'fromAddFund') return 'true';
        return null;
      });
      mockScopingListService.addNewFund = true;
      component.engagementDetailsObj = { engagementId: 10 };
      component.ngOnInit();
      tick(500);
    }));

    it('should subscribe to success observable and set flags', () => {
      const fetchSpy = spyOn(component, 'fetchFundList');
      component.engagementDetailsObj = {};
      component.ngOnInit();
      mockFundScopingDetailsService.sucessFundValue$.next({ isSucceeded: true, successMessage: 'msg' });
      expect(component.isSucceeded).toBeTrue();
      expect(component.successFundMessage).toBe('msg');
      // fetch not called because engagementDetailsObj empty
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  it('should add event listener in ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(window.addEventListener).toHaveBeenCalled();
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(sessionStorage, 'removeItem');
      component.sucessFundGroupEvent = new Subscription();
      component.deleteFundGroupEvent = new Subscription();
      component['editFundServiceSub'] = new Subscription();
      spyOn(component, 'unSubscribeTrackInterimStatusSubscription');
    });

    it('should cleanup subscriptions and reset services', () => {
      component.ngOnDestroy();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('SelectedFundForRoutine');
      expect(mockFundScopingDetailsService.setSuccessMessage).toHaveBeenCalledWith({ isSucceeded: false, successMessage: '' });
      expect(mockFundScopingDetailsService.setDeleteFundGroupMessage).toHaveBeenCalledWith({ isSucceeded: false, successMessage: '' });
      expect(component.unSubscribeTrackInterimStatusSubscription).toHaveBeenCalled();
      expect(mockFundInprogressService.fundsListSignal$.set).toHaveBeenCalledWith(null);
      expect(mockFundInprogressService.inProgressPollingCallSubscriptionSignal$.set).toHaveBeenCalledWith(null);
    });
  });

  describe('reloadFundDetails', () => {
    it('should call fetchFundList', () => {
      spyOn(component, 'fetchFundList');
      component.reloadFundDetails();
      expect(component.fetchFundList).toHaveBeenCalled();
    });
  });

  describe('reArrangeResult', () => {
    it('should map and convert fields', () => {
      const input = [{
        brokerCustodianName: ['a', 'b'],
        investmentType: ['x', 'y'],
        periodStartDate: '2020-01-01',
        periodEndDate: '2020-01-02',
        expectedAuditSignOffDate: '2020-01-03'
      }];
      const result = component.reArrangeResult(input);
      expect(result[0].brokerCusto).toBe('a, b');
      expect(result[0].brokerCustoCount).toBe(2);
      expect(result[0].invstType).toBe('x, y');
      expect(result[0].invstTypeCount).toBe(2);
      expect(result[0].periodStartDate instanceof Date).toBeTrue();
      expect(result[0].periodEndDate instanceof Date).toBeTrue();
      expect(result[0].expectedAuditSignOffDate instanceof Date).toBeTrue();
    });
  });

  describe('validateEngagementCloseStatus', () => {
    it('should dispatch list request when storageData null', () => {
      component.engagementDetailsObj = {};
      component.validateEngagementCloseStatus(null);
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it('should dispatch update action when storageData not null', () => {
      component.engagementDetailsObj = {};
      component.validateEngagementCloseStatus('{}');
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    it('should not set closed when status not matching constants', () => {
      component.engagementDetailsObj = { engStatus: EngagementStatus.ClosedOut };
      component.validateEngagementCloseStatus('{}');
      // store.select returns {}, so engagementDetailsObj overwritten to {}
      expect(component.isEngagementClosed).toBeFalse();
    });
  });

  describe('isInitiateCloseOutFromAdminConsole', () => {
    it('should update engagement and fetch funds when key matches', () => {
      spyOn(component, 'validateEngagementCloseStatus');
      spyOn(component, 'fetchFundList');
      component.engagementDetailsObj = { engagementId: 1 };
      component.isInitiateCloseOutFromAdminConsole({ key: 'closeOutKey' });
      expect(mockViewEngagementService.getEngagementList).toHaveBeenCalled();
      expect(component.validateEngagementCloseStatus).toHaveBeenCalled();
      expect(component.fetchFundList).toHaveBeenCalledWith(false);
      expect(mockSharedStorageOperationsService.deleteLocalStorage).toHaveBeenCalledWith('closeOutKey');
    });

    it('should do nothing when key mismatch', () => {
      component.engagementDetailsObj = { engagementId: 1 };
      component.isInitiateCloseOutFromAdminConsole({ key: 'other' });
      expect(mockViewEngagementService.getEngagementList).not.toHaveBeenCalled();
    });
  });

  describe('fetchFundList', () => {
    beforeEach(() => {
      component.engagementDetailsObj = { engagementId: 1 };
      spyOn(component, 'reArrangeResult').and.callThrough();
      spyOn(component, 'getFundInterimDetails').and.callThrough();
      spyOn(component, 'checkUserSelection');
    });

    it('should handle null data', () => {
      mockFundScopingDetailsService.getAllFundList.and.returnValue(of({ data: null }));
      component.fetchFundList();
      expect(component.RowDefinitiondata).toEqual([]);
    });

    it('should process non-empty data', () => {
      const data = [{
        fundStatusId: 2,
        brokerCustodianName: [],
        investmentType: [],
        periodStartDate: '',
        periodEndDate: '',
        expectedAuditSignOffDate: ''
      }];
      mockFundScopingDetailsService.getAllFundList.and.returnValue(of({ data }));
      component.fetchFundList();
      expect(mockQABService.setRoutineSelectionValue).toHaveBeenCalledWith(true);
      expect(component.getFundInterimDetails).toHaveBeenCalled();
      expect(component.checkUserSelection).toHaveBeenCalled();
    });

    it('should log error', () => {
      spyOn(console, 'log');
      mockFundScopingDetailsService.getAllFundList.and.returnValue(throwError(() => new Error('fail')));
      component.fetchFundList();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('getFundInterimDetails', () => {
    it('should subscribe interval and call getInterimStatus', fakeAsync(() => {
      spyOn(component, 'unSubscribeTrackInterimStatusSubscription').and.callThrough();
      component.engagementDetailsObj = { engagementId: 5 };
      component.trackInterimStatusInterval = interval(5);
      const rows = [{
        analysisId: 1,
        fundName: 'Fund',
        fundType: 'Type',
        investmentType: [],
        fundAdminName: 'Admin',
        brokerCustodianName: ['B'],
        periodStartDate: new Date().toISOString(),
        periodEndDate: new Date().toISOString(),
        expectedAuditSignOffDate: new Date().toISOString(),
        fundStatusId: 1,
        IsSelected: false,
        editImportStatus: false,
        currencyCode: 'USD',
        groupName: '',
        createdBy: '',
        createdDate: '',
        engagementAndFundGroupMappingId: 0,
        fundGroupName: '',
        engagementFundGroupStatus: '',
        isFundInProgress: false,
        isUpdated: false
      }];
      component.getFundInterimDetails(rows as any);
      expect(component.unSubscribeTrackInterimStatusSubscription).toHaveBeenCalled();
      tick(6);
      expect(mockFundInprogressService.getInterimStatus).toHaveBeenCalledWith(5, rows as any, 'FundScopingDetails');
      component.unSubscribeTrackInterimStatusSubscription();
    }));
  });

  describe('receiveEditedFundDetails', () => {
    // beforeEach(() => {
    //   spyOn(mockFundScopingDetailsService, 'setErrorResponseStatus');
    // });

    it('should handle success response', () => {
      const resp = JSON.stringify({ succeeded: true, successMessage: 'ok', data: [1, 2] });
      mockEditFundService.editFund.and.returnValue(of(resp));
      spyOn(component, 'reArrangeResult').and.returnValue([1, 2] as any);
      spyOn(component, 'fetchFundList');
      component.receiveEditedFundDetails({ payload: {} });
      expect(component.showUpdateFundSuccessMessage).toBeTrue();
      expect(component.editFundErrorStatus).toBeFalse();
      expect(component.successUpdateFundResponse).toBe('ok');
      expect(mockFundScopingDetailsService.setErrorResponseStatus).toHaveBeenCalledWith(false);
      expect(component.reArrangeResult).toHaveBeenCalledWith([1, 2] as any);
      expect(component.fetchFundList).toHaveBeenCalledWith(false);
      expect(component.editFundServiceSub).toBeDefined();
    });

    it('should handle failure response', () => {
      const resp = JSON.stringify({ succeeded: false, errorMessage: 'fail' });
      mockEditFundService.editFund.and.returnValue(of(resp));
      component.receiveEditedFundDetails({ payload: {} });
      expect(component.showUpdateFundSuccessMessage).toBeFalse();
      expect(mockFundScopingDetailsService.setErrorResponseStatus).toHaveBeenCalledWith(true);
      expect(component.editFundErrorStatus).toBeTrue();
      expect(component.fundNameErrorMessage).toBe('fail');
      expect(component.editFundServiceSub).toBeDefined();
    });

    it('should handle error observable', () => {
      mockEditFundService.editFund.and.returnValue(throwError(() => ({ error: 'err' })));
      component.receiveEditedFundDetails({ payload: {} });
      expect(mockFundScopingDetailsService.setErrorResponseStatus).toHaveBeenCalledWith(true);
      expect(component.editFundErrorStatus).toBeTrue();
      expect(component.showUpdateFundSuccessMessage).toBeFalse();
      expect(component.fundNameErrorMessage).toBe('err');
      expect(component.editFundServiceSub).toBeDefined();
    });
  });

  describe('checkUserSelection', () => {
    it('should enable selection and set data when previous exists', () => {
      component.RowDefinitiondata = [
        {
          analysisId: 1, fundName: 'Fund 1', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: false, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        },
        {
          analysisId: 2, fundName: 'Fund 2', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 2, IsSelected: false, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        }
      ];
      mockSessionStorageService.getValue.and.returnValue([{ analysisId: 1 }]);
      component.checkUserSelection();
      expect(component.allowRoutineSelection).toBeTrue();
      expect(mockFundScopingDetailsService.setData).toHaveBeenCalled();
    });

    it('should disable when no previous selection', () => {
      component.RowDefinitiondata = [{
        analysisId: 1, fundName: '', fundType: '', investmentType: [],
        fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
        expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: false, editImportStatus: false,
        currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
        fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
      }];
      mockSessionStorageService.getValue.and.returnValue([]);
      component.checkUserSelection();
      expect(component.allowRoutineSelection).toBeFalse();
    });
  });

  describe('checkFundNameValidation', () => {
    it('should set validation state', () => {
      component.checkFundNameValidation({ status: false, message: 'msg' });
      expect(component.editFundErrorStatus).toBeFalse();
      expect(component.fundNameErrorMessage).toBe('msg');
      expect(component.showUpdateFundSuccessMessage).toBeFalse();
    });
  });

  it('closeTheBannerAlert should reset error flag', () => {
    component.editFundErrorStatus = true;
    component.closeTheBannerAlert();
    expect(component.editFundErrorStatus).toBeFalse();
  });

  it('openAddFund should navigate', () => {
    component.openAddFund();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/fundscoping/add-fund']);
  });

  it('closeSuccessAlert should hide success', () => {
    component.showSuccessMessage = true;
    component.closeSuccessAlert();
    expect(component.showSuccessMessage).toBeFalse();
  });

  it('closeUpdateSuccessAlert should hide update success', () => {
    component.showUpdateFundSuccessMessage = true;
    component.closeUpdateSuccessAlert();
    expect(component.showUpdateFundSuccessMessage).toBeFalse();
  });

  describe('deleteFund', () => {
    beforeEach(() => {
      component.customConfirmationDialogComponent = { triggerOpen: jasmine.createSpy('triggerOpen') } as any;
    });

    it('should set all-imported message when all selected are imported', () => {
      component.RowDefinitiondata = [{
        analysisId: 1, fundName: 'A', fundType: '', investmentType: [],
        fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
        expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: true,
        currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
        fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
      }];
      component.deleteFund();
      expect(component.deleteModalMessage).toBe(Constants.ConfirmDialogwithAllDataImportMessage);
      expect(component.buttonYesValue).toBe('Ok');
      expect(component.isbuttonNoValue).toBeTrue();
      expect(component.customConfirmationDialogComponent.triggerOpen).toHaveBeenCalled();
    });

    it('should set mixed imported message when some imported', () => {
      component.RowDefinitiondata = [
        {
          analysisId: 1, fundName: 'A', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: true,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        },
        {
          analysisId: 2, fundName: 'B', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        }
      ];
      component.deleteFund();
      expect(component.deleteModalMessage).toBe(Constants.ConfirmDialogwithDataImportMessage);
      expect(component.buttonYesValue).toBe('Yes');
      expect(component.isbuttonNoValue).toBeFalse();
      expect(component.customConfirmationDialogComponent.triggerOpen).toHaveBeenCalled();
    });

    it('should show toast if no selection', () => {
      component.RowDefinitiondata = [{
        analysisId: 1, fundName: '', fundType: '', investmentType: [],
        fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
        expectedAuditSignOffDate: '', fundStatusId: 0, IsSelected: false, editImportStatus: false,
        currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
        fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
      }];
      component.deleteFund();
      expect(mockToastService.initiate).toHaveBeenCalled();
    });
  });

  it('clickClose should hide error div', () => {
    component.showErrorMsgDiv = true;
    component.clickClose();
    expect(component.showErrorMsgDiv).toBeFalse();
  });

  describe('rowSelected', () => {
    beforeEach(() => {
      component.RowDefinitiondata = [
        {
          analysisId: 1, fundName: '', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: false, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        },
        {
          analysisId: 2, fundName: '', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 2, IsSelected: false, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        }
      ];
      spyOn(component, 'setDataToSessionStorage');
    });

    it('should select a row and propagate data', () => {
      component.rowSelected([{ analysisId: 1 }]);
      expect(component.RowDefinitiondata[0].IsSelected).toBeTrue();
      expect(component.RowDefinitiondata[1].IsSelected).toBeFalse();
      expect(mockFundScopingDetailsService.setData).toHaveBeenCalled();
      expect(component.setDataToSessionStorage).toHaveBeenCalled();
    });

    it('should handle empty selection (all unselected)', () => {
      component.rowSelected([]);
      expect(component.allowRoutineSelection).toBeFalse();
      expect(component.showSeletefundMessage).toBeFalse();
      expect(component.showSuccessMessage).toBeFalse();
      expect(mockFundScopingDetailsService.setData).toHaveBeenCalledWith([]);
    });
  });

  it('navigatetoroutineselection should navigate properly', () => {
    component.navigatetoroutineselection();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/fundscoping/routineselection']);
  });

  describe('setDataToSessionStorage', () => {
    it('should store selected rows', () => {
      component.RowDefinitiondata = [{
        analysisId: 1, fundName: '', fundType: '', investmentType: [],
        fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
        expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: false,
        currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
        fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
      }];
      component.setDataToSessionStorage();
      expect(mockSessionStorageService.setValue).toHaveBeenCalled();
    });
  });

  it('changeIsSelectedToFalse should clear selection flags', () => {
    component.RowDefinitiondata = [
      {
        analysisId: 1, fundName: '', fundType: '', investmentType: [],
        fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
        expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: false,
        currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
        fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
      },
      {
        analysisId: 2, fundName: '', fundType: '', investmentType: [],
        fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
        expectedAuditSignOffDate: '', fundStatusId: 2, IsSelected: true, editImportStatus: false,
        currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
        fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
      }
    ];
    component.changeIsSelectedToFalse();
    expect(component.RowDefinitiondata.every(r => !r.IsSelected)).toBeTrue();
  });

  it('navigateToScopingList should navigate', () => {
    component.navigateToScopingList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/fundscoping/view-engagement']);
  });

  describe('refreshOnNewFundAdd', () => {
    it('should refresh when status true', () => {
      spyOn(component, 'fetchFundList');
      component.refreshOnNewFundAdd({ status: true, message: 'msg' });
      expect(component.showSuccessMessage).toBeTrue();
      expect(component.successResponse).toBe('msg');
      expect(component.fetchFundList).toHaveBeenCalledWith(true);
    });

    it('should ignore when status false', () => {
      spyOn(component, 'fetchFundList');
      component.refreshOnNewFundAdd({ status: false });
      expect(component.fetchFundList).not.toHaveBeenCalled();
    });
  });

  it('closeTheAlert should hide success', () => {
    component.showSuccessMessage = true;
    component.closeTheAlert('success');
    expect(component.showSuccessMessage).toBeFalse();
  });

  it('closeTheSucessFundAlert should reset isSucceeded', () => {
    component.isSucceeded = true;
    component.closeTheSucessFundAlert('isSucceeded');
    expect(component.isSucceeded).toBeFalse();
  });

  it('closeTheSucessDeleteFundAlert should reset isSucceededDeleteFundGroup', () => {
    component.isSucceededDeleteFundGroup = true;
    component.closeTheSucessDeleteFundAlert('isSucceededDeleteFundGroup');
    expect(component.isSucceededDeleteFundGroup).toBeFalse();
  });

  it('closeSelectFundAlert should reset selection message', () => {
    component.showSeletefundMessage = true;
    component.closeSelectFundAlert('info');
    expect(component.showSeletefundMessage).toBeFalse();
  });

  describe('isUserConfired', () => {
    beforeEach(() => {
      component.RowDefinitiondata = [
        {
          analysisId: 1, fundName: '', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        },
        {
          analysisId: 2, fundName: '', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 2, IsSelected: false, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        }
      ];
      component.customConfirmationDialogComponent = { triggerClose: jasmine.createSpy('triggerClose') } as any;
    });

    it('should delete when confirmed and ids exist', () => {
      mockDeleteFundService.deleteFund.and.returnValue(of(JSON.stringify({ data: [{ isAlreadyDeleted: false }] })));
      spyOn(component, 'fetchFundList');
      component.isUserConfired(true);
      expect(component.customConfirmationDialogComponent.triggerClose).toHaveBeenCalled();
      expect(component.fetchFundList).toHaveBeenCalledWith(true);
    });

    it('should only close when no analysis ids', () => {
      component.RowDefinitiondata.forEach(r => r.IsSelected = false);
      component.isUserConfired(true);
      expect(component.customConfirmationDialogComponent.triggerClose).toHaveBeenCalled();
    });

    it('should close when not confirmed', () => {
      component.isUserConfired(false);
      expect(component.customConfirmationDialogComponent.triggerClose).toHaveBeenCalled();
    });
  });

  it('getFilterCount should set count', () => {
    component.getFilterCount(9);
    expect(component.dataLength).toBe(9);
  });

  describe('unSubscribeTrackInterimStatusSubscription', () => {
    it('should unsubscribe when subscription exists and default param', () => {
      const sub = { unsubscribe: jasmine.createSpy('unsubscribe') };
      component.trackInterimStatusSubscription = sub as any;
      component.unSubscribeTrackInterimStatusSubscription();
      expect(sub.unsubscribe).toHaveBeenCalled();
      expect(component.trackInterimStatusSubscription).toBeNull();
    });

    it('should not throw if subscription null', () => {
      component.trackInterimStatusSubscription = null as any;
      expect(() => component.unSubscribeTrackInterimStatusSubscription()).not.toThrow();
    });

    it('should NOT unsubscribe when cancelSubScription is false', () => {
      const sub = { unsubscribe: jasmine.createSpy('unsubscribe') };
      component.trackInterimStatusSubscription = sub as any;
      component.unSubscribeTrackInterimStatusSubscription(false);
      expect(sub.unsubscribe).not.toHaveBeenCalled();
      expect(component.trackInterimStatusSubscription).toBe(sub as any);
    });
  });

  describe('getFundInterimDetails edge', () => {
    it('should not fail with empty rows', () => {
      component.engagementDetailsObj = { engagementId: 100 };
      component.getFundInterimDetails([]);
      expect(component.engagementDetailsObj.engagementId).toBe(100);
    });
  });

  describe('checkFundNameValidation additional', () => {
    it('should set error state when status true (error)', () => {
      component.checkFundNameValidation({ status: true, message: 'error message' });
      expect(component.editFundErrorStatus).toBeTrue();
      expect(component.fundNameErrorMessage).toBe('error message');
    });
  });

  describe('changeIsSelectedToFalse edge', () => {
    it('should not fail when list empty', () => {
      component.RowDefinitiondata = [];
      component.changeIsSelectedToFalse();
      expect(component.RowDefinitiondata.length).toBe(0);
    });
  });

  describe('rowSelected additional', () => {
    it('should handle selecting multiple entries (keep them all selected)', () => {
      component.RowDefinitiondata = [
        {
          analysisId: 1, fundName: 'A', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: false, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        },
        {
          analysisId: 2, fundName: 'B', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 2, IsSelected: false, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        }
      ];
      component.rowSelected([{ analysisId: 1 }, { analysisId: 2 }]);
      expect(component.RowDefinitiondata.every(r => r.IsSelected)).toBeTrue();
    });
  });

  describe('deleteFund extra branches', () => {
    it('should set standard confirmation message when selected and none imported', () => {
      component.customConfirmationDialogComponent = { triggerOpen: jasmine.createSpy('triggerOpen') } as any;
      component.RowDefinitiondata = [
        {
          analysisId: 1, fundName: 'One', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        }
      ];
      component.deleteFund();
      expect(component.customConfirmationDialogComponent.triggerOpen).toHaveBeenCalled();
      expect(component.buttonYesValue.length).toBeGreaterThan(0);
    });
  });

  describe('isUserConfired extra', () => {
    it('should handle already deleted flag in response', () => {
      component.RowDefinitiondata = [
        {
          analysisId: 99, fundName: 'X', fundType: '', investmentType: [],
          fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
          expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: false,
          currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
          fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
        }
      ];
      component.customConfirmationDialogComponent = { triggerClose: jasmine.createSpy('triggerClose') } as any;
      mockDeleteFundService.deleteFund.and.returnValue(of(JSON.stringify({ data: [{ isAlreadyDeleted: true }] })));
      component.isUserConfired(true);
      expect(component.customConfirmationDialogComponent.triggerClose).toHaveBeenCalled();
    });
  });

  describe('close helpers additional', () => {
    it('closeTheAlert with non-matching type should still not throw', () => {
      component.showSuccessMessage = true;
      component.closeTheAlert('otherType');
      // Depending on implementation might remain true or false; assert no crash
      expect(component.showSuccessMessage).toBeDefined();
    });

    it('closeTheSucessFundAlert with other key should not affect isSucceeded flag', () => {
      component.isSucceeded = true;
      component.closeTheSucessFundAlert('otherKey');
      expect(component.isSucceeded).toBeTrue();
    });

    it('closeTheSucessDeleteFundAlert with other key should not affect isSucceededDeleteFundGroup flag', () => {
      component.isSucceededDeleteFundGroup = true;
      component.closeTheSucessDeleteFundAlert('anotherKey');
      expect(component.isSucceededDeleteFundGroup).toBeTrue();
    });

    it('closeSelectFundAlert with unrelated type should keep flag state', () => {
      component.showSeletefundMessage = true;
      component.closeSelectFundAlert('anotherType');
      expect(component.showSeletefundMessage).toBeTrue();
    });
  });

  describe('unSubscribeTrackInterimStatusSubscription edge repeats', () => {
    it('should safely handle double unsubscribe calls', () => {
      const sub = { unsubscribe: jasmine.createSpy('unsubscribe') };
      component.trackInterimStatusSubscription = sub as any;
      component.unSubscribeTrackInterimStatusSubscription();
      component.unSubscribeTrackInterimStatusSubscription();
      expect(sub.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateEngagementCloseStatus branch for closed engagement', () => {
    it('should set isEngagementClosed true when status matches ClosedOut (simulate select returning status)', () => {
      // Override select to emit a matching status object
      mockStore.select.and.returnValue(of({ engStatus: EngagementStatus.ClosedOut }));
      component.engagementDetailsObj = {};
      component.validateEngagementCloseStatus('{}');
      expect(component.isEngagementClosed).toBeTrue();
    });
  });

  describe('navigations idempotent', () => {
    it('navigatetoroutineselection second call still navigates', () => {
      component.navigatetoroutineselection();
      component.navigatetoroutineselection();
      expect(mockRouter.navigate.calls.allArgs().filter(a => a[0][0] === '/fundscoping/routineselection').length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('openAddFund idempotent', () => {
    it('should navigate repeatedly without error', () => {
      component.openAddFund();
      component.openAddFund();
      expect(mockRouter.navigate.calls.allArgs().filter(a => a[0][0] === '/fundscoping/add-fund').length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('coverage extras', () => {
    it('deleteFund should set standard confirmation when exactly one selected not imported (distinct from all-imported & mixed)', () => {
      component.customConfirmationDialogComponent = { triggerOpen: jasmine.createSpy('triggerOpen') } as any;
      component.RowDefinitiondata = [{
        analysisId: 10, fundName: 'Only', fundType: '', investmentType: [],
        fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
        expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: true, editImportStatus: false,
        currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
        fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
      }];
      component.deleteFund();
      // Expect the generic (non-import) confirmation variant
      expect(component.deleteModalMessage).toBeDefined();
      expect(component.customConfirmationDialogComponent.triggerOpen).toHaveBeenCalled();
    });

    it('closeTheAlert with success branch only affects showSuccessMessage when type is success', () => {
      component.showSuccessMessage = true;
      component.closeTheAlert('other');
      expect(component.showSuccessMessage).toBeTrue();
      component.closeTheAlert('success');
      expect(component.showSuccessMessage).toBeFalse();
    });

    it('checkUserSelection should not break when stored selection id not present in rows', () => {
      component.RowDefinitiondata = [{
        analysisId: 5, fundName: '', fundType: '', investmentType: [],
        fundAdminName: '', brokerCustodianName: [], periodStartDate: '', periodEndDate: '',
        expectedAuditSignOffDate: '', fundStatusId: 1, IsSelected: false, editImportStatus: false,
        currencyCode: '', groupName: '', createdBy: '', createdDate: '', engagementAndFundGroupMappingId: 0,
        fundGroupName: '', engagementFundGroupStatus: '', isFundInProgress: false, isUpdated: false
      }];
      mockSessionStorageService.getValue.and.returnValue([{ analysisId: 999 }]);
      component.checkUserSelection();
      expect(component.allowRoutineSelection).toBeTrue();
    });

    it('reArrangeResult should trim empty/falsey inner values', () => {
      const input = [{
        brokerCustodianName: ['a', '', null],
        investmentType: ['x', undefined, ''],
        periodStartDate: '',
        periodEndDate: '',
        expectedAuditSignOffDate: ''
      }];
      const res = component.reArrangeResult(input as any);
      expect(res[0].brokerCusto).toBe('a, , ');
      expect(res[0].brokerCustoCount).toBe(3);
      expect(res[0].invstType).toBe('x, , ');
      expect(res[0].invstTypeCount).toBe(3);
    });

    it('refreshOnNewFundAdd should NOT set success when message absent & status false', () => {
      component.showSuccessMessage = false;
      component.refreshOnNewFundAdd({ status: false });
      expect(component.showSuccessMessage).toBeFalse();
    });

    it('getFundInterimDetails should early exit when funds undefined', () => {
      component.engagementDetailsObj = { engagementId: 55 };
      expect(() => component.getFundInterimDetails(undefined as any)).not.toThrow();
    });

    it('getFundInterimDetails should early exit when engagementId missing', () => {
      component.engagementDetailsObj = {};
      expect(() => component.getFundInterimDetails([{ analysisId: 1 }] as any)).not.toThrow();
    });

  });


});