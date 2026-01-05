import { Store } from '@ngrx/store';
import { UpdateEngagementService } from 'src/app/features/scoping/fundscoping/update-engagement.service';
import { RootReducerState } from './engagement-state/reducers';
import { EngagementDetailsComponent } from './engagement-details.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './engagement-state/reducers';
import { of } from 'rxjs';
import { EngDetailsListRequestAction, EngDetailsUpdateAction } from './engagement-state/actions/eng-actions';

describe('EngagementDetailsComponent', () => {
  let component: EngagementDetailsComponent;
  let fixture: ComponentFixture<EngagementDetailsComponent>;
  let store: Store<RootReducerState>;
  let updateEngagementService: UpdateEngagementService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngagementDetailsComponent ],
      providers: [ DatePipe, UpdateEngagementService ],
      imports: [HttpClientTestingModule, StoreModule.forRoot(rootReducer)]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    updateEngagementService = TestBed.inject(UpdateEngagementService);
    const engDetails = {engagementId:907,engagementName:"Workflow Engagement",periodEndDate:"2025-07-15T18:30:00.000Z",engStatus:"Not Started", regionDisplayName:"Bay Area (United States)"};
    sessionStorage.setItem("engDetails", JSON.stringify(engDetails));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should close closeSuccessAlert', () => {
    component.Isupdated = true;
    component.closeSuccessAlert();
    expect(component.Isupdated).toBeFalse();
  });
});

describe('EngagementDetailsComponent constructor', () => {
  let storeSpy: jasmine.SpyObj<Store<RootReducerState>>;
  let updateEngagementServiceSpy: jasmine.SpyObj<UpdateEngagementService>;
  let datePipeSpy: jasmine.SpyObj<DatePipe>;
  let selectSubject: any;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    updateEngagementServiceSpy = jasmine.createSpyObj('UpdateEngagementService', [], { addEngMsgValue$: { subscribe: () => {} } });
    datePipeSpy = jasmine.createSpyObj('DatePipe', ['transform']);
    selectSubject = {
      subscribe: jasmine.createSpy('subscribe')
    };
    storeSpy.select.and.returnValue(selectSubject);
  });

  afterEach(() => {
    sessionStorage.removeItem('engDetails');
  });

  it('should dispatch EngDetailsListRequestAction and subscribe to getEngDetailEntities if sessionStorage is null', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    new EngagementDetailsComponent(datePipeSpy, updateEngagementServiceSpy, storeSpy);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.any(EngDetailsListRequestAction));
    expect(selectSubject.subscribe).toHaveBeenCalled();
  });

  it('should dispatch EngDetailsUpdateAction and subscribe to getEngDetailEntities if sessionStorage has value', () => {
    const mockValue = { foo: 'bar' };
    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(mockValue));

    new EngagementDetailsComponent(datePipeSpy, updateEngagementServiceSpy, storeSpy);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.any(EngDetailsUpdateAction));
    expect(selectSubject.subscribe).toHaveBeenCalled();
  });

  it('should set engagementDetailsObj from store.select subscription', () => {
    const mockResult = { test: 123 };
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    // Simulate subscribe callback
    storeSpy.select.and.callFake(() => of(mockResult));

    const component = new EngagementDetailsComponent(datePipeSpy, updateEngagementServiceSpy, storeSpy);

    expect(component.engagementDetailsObj).toEqual(mockResult);
  });
});
describe('EngagementDetailsComponent constructor', () => {
  let storeSpy: jasmine.SpyObj<Store<RootReducerState>>;
  let updateEngagementServiceSpy: jasmine.SpyObj<UpdateEngagementService>;
  let datePipeSpy: jasmine.SpyObj<DatePipe>;
  let selectSubject: any;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    updateEngagementServiceSpy = jasmine.createSpyObj('UpdateEngagementService', [], { addEngMsgValue$: { subscribe: () => {} } });
    datePipeSpy = jasmine.createSpyObj('DatePipe', ['transform']);
    selectSubject = {
      subscribe: jasmine.createSpy('subscribe')
    };
    storeSpy.select.and.returnValue(selectSubject);
  });

  afterEach(() => {
    sessionStorage.removeItem('engDetails');
  });

  it('should dispatch EngDetailsListRequestAction and subscribe to getEngDetailEntities if sessionStorage is null', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    new EngagementDetailsComponent(datePipeSpy, updateEngagementServiceSpy, storeSpy);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.any(EngDetailsListRequestAction));
    expect(selectSubject.subscribe).toHaveBeenCalled();
  });

  it('should dispatch EngDetailsUpdateAction and subscribe to getEngDetailEntities if sessionStorage has value', () => {
    const mockValue = { foo: 'bar' };
    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(mockValue));

    new EngagementDetailsComponent(datePipeSpy, updateEngagementServiceSpy, storeSpy);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.any(EngDetailsUpdateAction));
    expect(selectSubject.subscribe).toHaveBeenCalled();
  });

  it('should set engagementDetailsObj from store.select subscription', () => {
    const mockResult = { test: 123 };
    spyOn(sessionStorage, 'getItem').and.returnValue(null);

    // Simulate subscribe callback
    storeSpy.select.and.callFake(() => of(mockResult));

    const component = new EngagementDetailsComponent(datePipeSpy, updateEngagementServiceSpy, storeSpy);

    expect(component.engagementDetailsObj).toEqual(mockResult);
  });
});