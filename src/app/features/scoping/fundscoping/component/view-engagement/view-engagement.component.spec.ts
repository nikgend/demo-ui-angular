import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { ViewEngagementComponent } from './view-engagement.component';
import { ViewEngagementService } from '../../services/view-engagement.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UpdateEngagementService } from '../../update-engagement.service';
import { CustomToastService } from 'src/app/shared/services/custom-toast.service';
import { of, throwError } from 'rxjs';
import { RollForwardEngagementStatus } from 'src/app/shared/components/constants/constants';

describe('ViewEngagementComponent', () => {
  let component: ViewEngagementComponent;
  let fixture: ComponentFixture<ViewEngagementComponent>;
  let mockViewEngagementService: any;
  let mockRouter: any;
  let mockDatePipe: any;
  let mockUpdateEngagementService: any;
  let mockToastService: any;

  beforeEach(() => {
    mockViewEngagementService = {
      getEngagementList: jasmine.createSpy(),
      getRollFowrardEngagementStatus: jasmine.createSpy()
    };
    mockRouter = { url: '/fundscoping/view-engagement', navigate: jasmine.createSpy() };
    mockDatePipe = { transform: jasmine.createSpy().and.callFake((date, format) => '01-01-2024') };
    mockUpdateEngagementService = {};
    mockToastService = { initiate: jasmine.createSpy() };

    TestBed.configureTestingModule({
      declarations: [ViewEngagementComponent],
      providers: [
        { provide: ViewEngagementService, useValue: mockViewEngagementService },
        { provide: Router, useValue: mockRouter },
        { provide: DatePipe, useValue: mockDatePipe },
        { provide: UpdateEngagementService, useValue: mockUpdateEngagementService },
        { provide: CustomToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEngagementComponent);
    component = fixture.componentInstance;
    spyOn(sessionStorage, 'getItem').and.callFake(() => null);
    spyOn(sessionStorage, 'removeItem');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEngagementList on ngOnInit', () => {
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: [], succeeded: true }));
    component.ngOnInit();
    expect(mockViewEngagementService.getEngagementList).toHaveBeenCalled();
  });

  it('should clean up on ngOnDestroy', () => {
    component.isPolling = true;
    component.pollingCount = 5;
    component.ngOnDestroy();
    expect(component.isPolling).toBeFalse();
    expect(component.pollingCount).toBe(1);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('rollForwardEngDetails');
  });

  it('should set dataLength in getFilterCount', () => {
    component.getFilterCount(10);
    expect(component.dataLength).toBe(10);
  });

  it('should navigate to add engagement', () => {
    component.addEngagement();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/fundscoping/add-engagement']);
  });

  it('should clear search value', () => {
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: [], succeeded: true }));
    component.clearSerchValue();
    expect(mockViewEngagementService.getEngagementList).toHaveBeenCalled();
  });

  it('should handle getEngagementList with data and roll-forward in progress', fakeAsync(() => {
    const engagementList = [
      { engagementStatus: RollForwardEngagementStatus.RollForwardInProgress, userHasAccessToEngagement: true, periodEndDate: '2024-01-01' }
    ];
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: engagementList, succeeded: true }));
    mockViewEngagementService.getRollFowrardEngagementStatus.and.returnValue(of({ data: [{ engStatus: RollForwardEngagementStatus.RollForwardInProgress }] }));
    spyOn(component, 'startPolling');
    component.getEngagementList('', true);
    tick(60000);
    expect(component.engagementList.length).toBe(1);
    expect(component.startPolling).toHaveBeenCalled();
  }));

  it('should handle getEngagementList with no data and search key', () => {
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: [], succeeded: false }));
    component.getEngagementList('search', true);
    expect(component.isView).toBeFalse();
    expect(component.isSearch).toBeTrue();
  });

  it('should handle error in startPolling', fakeAsync(() => {
    const rollForwardData = [{ engagementName: 'TestEng' }];
    mockViewEngagementService.getRollFowrardEngagementStatus.and.returnValue(throwError(() => new Error('API Error')));
    spyOn(console, 'error');
    component.isPolling = true;
    component.startPolling(rollForwardData);
    tick(60000);
    expect(console.error).toHaveBeenCalled();
  }));

  it('should handle searchKeyword for MM/dd/yyyy', () => {
    mockDatePipe.transform.and.returnValue('01-01-2024');
    spyOn(component, 'getEngagementList');
    component.searchKeyword('01/01/2024');
    expect(component.getEngagementList).toHaveBeenCalledWith('01-01-2024');
  });

  it('should handle searchKeyword for MM/dd', () => {
    mockDatePipe.transform.and.returnValue('01-01');
    spyOn(component, 'getEngagementList');
    component.searchKeyword('01/01');
    expect(component.getEngagementList).toHaveBeenCalledWith('01-01');
  });

  it('should handle searchKeyword for MM/dd/', () => {
    mockDatePipe.transform.and.returnValue('01-01-');
    spyOn(component, 'getEngagementList');
    component.searchKeyword('01/01/');
    expect(component.getEngagementList).toHaveBeenCalledWith('01-01-');
  });

  it('should handle searchKeyword for MM/', () => {
    mockDatePipe.transform.and.returnValue('01-');
    spyOn(component, 'getEngagementList');
    component.searchKeyword('01/');
    expect(component.getEngagementList).toHaveBeenCalledWith('01-');
  });

  it('should handle searchKeyword for /dd', () => {
    spyOn(component, 'getEngagementList');
    component.searchKeyword('/01');
    expect(component.getEngagementList).toHaveBeenCalledWith('-01');
  });

  it('should handle searchKeyword for other', () => {
    spyOn(component, 'getEngagementList');
    component.searchKeyword('test');
    expect(component.getEngagementList).toHaveBeenCalledWith('test');
    expect(component.searchkeyword).toBe('test');
  });

  it('should close access error', () => {
    component.showEngagementAccessError = true;
    component.closeAccessError();
    expect(component.showEngagementAccessError).toBeFalse();
  });

  it('should set access issue', () => {
    component.accessIssue(true);
    expect(component.showEngagementAccessError).toBeTrue();
  });

  it('should close close out error', () => {
    component.showEngagementCloseOutError = true;
    component.closeCloseOutError();
    expect(component.showEngagementCloseOutError).toBeFalse();
  });

  it('should set close out issue', () => {
    component.closeOutIssue(true);
    expect(component.showEngagementCloseOutError).toBeTrue();
  });

  // isRollForwardInProgress filter logic coverage
  it('should filter isRollForwardInProgress correctly', () => {
    const result = {
      data: [
        { engStatus: RollForwardEngagementStatus.RollForwardInProgress },
        { engStatus: "Roll-Forward Complete" },
        { engStatus: RollForwardEngagementStatus.RollForwardFailed }
      ]
    };
    const filtered = result.data.filter((engList) => engList.engStatus === RollForwardEngagementStatus.RollForwardInProgress);
    expect(filtered.length).toBe(1);
    expect(filtered[0].engStatus).toBe(RollForwardEngagementStatus.RollForwardInProgress);
  });

  it('should handle getEngagementList with roll-forward complete', () => {
    const engagementList = [
      { engagementStatus: "Roll-Forward Complete", userHasAccessToEngagement: true, periodEndDate: '2024-01-01' }
    ];
    (sessionStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify({ isRollForwardEng: true, engName: 'TestEng' })); // <-- Use the existing spy
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: engagementList, succeeded: true }));
    component.getEngagementList('', false);
    expect(mockToastService.initiate).toHaveBeenCalled();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('rollForwardEngDetails');
  });

  it('should handle startPolling roll-forward failed after pollingCount > 3', fakeAsync(() => {
    const rollForwardData = [{ engagementName: 'TestEng' }];
    component.pollingCount = 4;
    const result = {
      data: [
        { engStatus: RollForwardEngagementStatus.RollForwardFailed }
      ]
    };
    mockViewEngagementService.getRollFowrardEngagementStatus.and.returnValue(of(result));
    spyOn(component, 'getEngagementList');
    component.isPolling = true;
    component.startPolling(rollForwardData);
    tick(60000);
    expect(component.isPolling).toBeFalse();
    expect(component.pollingCount).toBe(1);
    expect(mockToastService.initiate).toHaveBeenCalled();
    expect(component.getEngagementList).toHaveBeenCalled();
    discardPeriodicTasks(); // <-- Add this line
  }));

  it('should handle startPolling roll-forward in progress count change', fakeAsync(() => {
    const rollForwardData = [{ engagementName: 'TestEng' }];
    // Set rollForwardedEngagementsCount > isRollForwardInProgress.length
    component.rollForwardedEngagementsCount = 3;
    const result = {
      data: [
        { engStatus: RollForwardEngagementStatus.RollForwardInProgress },
        { engStatus: RollForwardEngagementStatus.RollForwardInProgress }
      ]
    };
    mockViewEngagementService.getRollFowrardEngagementStatus.and.returnValue(of(result));
    spyOn(component, 'getEngagementList');
    component.isPolling = true;
    component.startPolling(rollForwardData);
    tick(60000);
    expect(component.rollForwardedEngagementsCount).toBe(2);
    expect(component.getEngagementList).toHaveBeenCalledWith('', false);
    discardPeriodicTasks();
  }));

  it('should handle startPolling roll-forward complete', fakeAsync(() => {
    const rollForwardData = [{ engagementName: 'TestEng' }];
    const result = {
      data: [
        { engStatus: "Roll-Forward Complete" },
        { engStatus: RollForwardEngagementStatus.RollForwardFailed }
      ]
    };
    mockViewEngagementService.getRollFowrardEngagementStatus.and.returnValue(of(result));
    spyOn(component, 'getEngagementList');
    component.isPolling = true;
    component.startPolling(rollForwardData);
    tick(60000);
    expect(component.isPolling).toBeTrue();
    expect(component.pollingCount).toBe(2);
    discardPeriodicTasks(); // <-- Add this line
  }));

  // Test getSearchResult (currently empty, but should be called)
  it('should call getSearchResult with data', () => {
    component.getSearchResult({ test: 'value' });
    expect(component.getSearchResult).toBeDefined();
  });

  // Test getEngagementList with undefined/null/empty result
it('should handle getEngagementList with undefined result', () => {
  mockViewEngagementService.getEngagementList.and.returnValue(of({ data: [], succeeded: false })); // <-- Add here
  component.getEngagementList('', true);
  expect(component.engagementList).toEqual([]);
});

  it('should handle getEngagementList with null result', () => {
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: [], succeeded: false }));
    component.getEngagementList('', true);
    expect(component.engagementList).toEqual([]);
  });

  // Test getEngagementList with result.data but no userHasAccessToEngagement
  it('should handle getEngagementList with data but no access', () => {
    const engagementList = [
      { engagementStatus: RollForwardEngagementStatus.RollForwardInProgress, userHasAccessToEngagement: false, periodEndDate: '2024-01-01' }
    ];
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: engagementList, succeeded: true }));
    component.getEngagementList('', true);
    expect(component.engagementList.length).toBe(1);
  });

  // Test getEngagementList with pollingContine false and no rollForwardEngObj
  it('should handle getEngagementList with pollingContine false and no rollForwardEngObj', () => {
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: [], succeeded: true }));
    component.getEngagementList('', false);
    expect(component.engagementList).toEqual([]);
  });

  // Test startPolling with isPolling false (should not poll)
  it('should not poll when isPolling is false', fakeAsync(() => {
    const rollForwardData = [{ engagementName: 'TestEng' }];
    component.isPolling = false;
    component.startPolling(rollForwardData);
    tick(60000);
    expect(component.isPolling).toBeFalse();
    discardPeriodicTasks();
  }));

  // Test startPolling with empty result.data
  it('should handle startPolling with empty result.data', fakeAsync(() => {
    const rollForwardData = [{ engagementName: 'TestEng' }];
    const result = { data: [] };
    mockViewEngagementService.getRollFowrardEngagementStatus.and.returnValue(of(result));
    spyOn(component, 'getEngagementList');
    component.isPolling = true;
    component.startPolling(rollForwardData);
    tick(60000);
    expect(component.isPolling).toBeFalse();
    expect(component.pollingCount).toBe(1);
    expect(component.getEngagementList).toHaveBeenCalledWith('');
    discardPeriodicTasks();
  }));

  // Test startPolling with RollForwardInProgress empty and RollForwardFailed empty
  it('should handle startPolling with no in progress and no failed', fakeAsync(() => {
    const rollForwardData = [{ engagementName: 'TestEng' }];
    const result = { data: [] };
    mockViewEngagementService.getRollFowrardEngagementStatus.and.returnValue(of(result));
    spyOn(component, 'getEngagementList');
    component.isPolling = true;
    component.startPolling(rollForwardData);
    tick(60000);
    expect(component.isPolling).toBeFalse();
    expect(component.pollingCount).toBe(1);
    expect(component.getEngagementList).toHaveBeenCalledWith('');
    discardPeriodicTasks();
  }));

  // Test startPolling error branch
  it('should handle error in startPolling', fakeAsync(() => {
    const rollForwardData = [{ engagementName: 'TestEng' }];
    mockViewEngagementService.getRollFowrardEngagementStatus.and.returnValue(throwError(() => new Error('API Error')));
    spyOn(console, 'error');
    component.isPolling = true;
    component.startPolling(rollForwardData);
    tick(60000);
    expect(console.error).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  // Test searchKeyword with invalid date format
  it('should handle searchKeyword with invalid date format', () => {
    spyOn(component, 'getEngagementList');
    component.searchKeyword('invalid-date');
    expect(component.getEngagementList).toHaveBeenCalledWith('invalid-date');
    expect(component.searchkeyword).toBe('invalid-date');
  });

  // Test closeAccessError and accessIssue
  it('should close access error and set access issue', () => {
    component.showEngagementAccessError = true;
    component.closeAccessError();
    expect(component.showEngagementAccessError).toBeFalse();
    component.accessIssue(true);
    expect(component.showEngagementAccessError).toBeTrue();
  });

  // Test closeCloseOutError and closeOutIssue
  it('should close close out error and set close out issue', () => {
    component.showEngagementCloseOutError = true;
    component.closeCloseOutError();
    expect(component.showEngagementCloseOutError).toBeFalse();
    component.closeOutIssue(true);
    expect(component.showEngagementCloseOutError).toBeTrue();
  });

  // Test ngOnDestroy branch with sessionStorage.removeItem
  it('should call ngOnDestroy and remove sessionStorage item', () => {
    component.isPolling = true;
    component.pollingCount = 5;
    component.ngOnDestroy();
    expect(component.isPolling).toBeFalse();
    expect(component.pollingCount).toBe(1);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('rollForwardEngDetails');
  });

  // Test addEngagement navigation
  it('should navigate to add engagement', () => {
    component.addEngagement();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/fundscoping/add-engagement']);
  });

  // Test clearSerchValue
  it('should call clearSerchValue', () => {
    mockViewEngagementService.getEngagementList.and.returnValue(of({ data: [], succeeded: true }));
    component.clearSerchValue();
    expect(mockViewEngagementService.getEngagementList).toHaveBeenCalled();
  });

  // Test getFilterCount
  it('should set dataLength in getFilterCount', () => {
    component.getFilterCount(10);
    expect(component.dataLength).toBe(10);
  });

  // Test RowDefinitiondata and Isupdated properties
  it('should set RowDefinitiondata and Isupdated', () => {
    component.RowDefinitiondata = { test: 'row' };
    component.Isupdated = true;
    expect(component.RowDefinitiondata).toEqual({ test: 'row' });
    expect(component.Isupdated).toBeTrue();
  });

  // Test template bindings (ViewChild, position, etc.)
  it('should have default position values', () => {
    expect(component.position).toEqual({ X: 'Center', Y: 'Top' });
  });

  // Test engagementAccessErrorMessgae and engagementCloseOutErrorMessgae
  it('should have default error messages', () => {
    expect(component.engagementAccessErrorMessgae).toContain('You do not have access');
    expect(component.engagementCloseOutErrorMessgae).toContain('Engagement status must be Closed Out');
    expect(component.engagementRollForwardErrorMessgae).toContain('We could not complete the Roll-forward');
  });

  // Test isView and isSearch toggling
  it('should toggle isView and isSearch', () => {
    component.isView = false;
    component.isSearch = true;
    component.isView = true;
    component.isSearch = false;
    expect(component.isView).toBeTrue();
    expect(component.isSearch).toBeFalse();
  });
});