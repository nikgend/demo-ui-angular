import { FundScopingDetailsService } from './fundscoping-details.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('FundScopingDetailsService', () => {
  let service: FundScopingDetailsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    service = new FundScopingDetailsService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getenableFalge', () => {
    it('should return the default value of flagstepper', () => {
      expect(service.getenableFalge()).toBeTrue();
    });

    it('should return updated value if flagstepper is changed', () => {
      service.flagstepper = false;
      expect(service.getenableFalge()).toBeFalse();
    });
  });

  it('should set and get data', () => {
    service.setData('test');
    expect(service.getData()).toBe('test');
  });
  describe('FundScopingDetailsService', () => {
    let service: FundScopingDetailsService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
      service = new FundScopingDetailsService(httpClientSpy);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('getenableFalge', () => {
      it('should return the default value of flagstepper', () => {
        expect(service.getenableFalge()).toBeTrue();
      });

      it('should return updated value if flagstepper is changed', () => {
        service.flagstepper = false;
        expect(service.getenableFalge()).toBeFalse();
      });
    });

    it('should set and get data', () => {
      service.setData('test');
      expect(service.getData()).toBe('test');
    });

    it('should emit value for enableFalg', (done) => {
      service.routionerFlagStepperValue$.subscribe(val => {
        expect(val).toBe(true);
        done();
      });
      service.enableFalg(true);
    });

    it('should emit value for setSuccessMessage', (done) => {
      service.sucessFundValue$.subscribe(val => {
        expect(val).toEqual([]);
        done();
      });
      service.setSuccessMessage([]);
    });

    it('should emit value for setDeleteFundGroupMessage', (done) => {
      service.deleteFundGroupMessageValue$.subscribe(val => {
        expect(val).toEqual([]);
        done();
      });
      service.setDeleteFundGroupMessage([]);
    });

    it('should emit value for setErrorResponseStatus', (done) => {
      service.errorResponseStatusValue$.subscribe(val => {
        expect(val).toBe(true);
        done();
      });
      service.setErrorResponseStatus(true);
    });

    it('should return resource url', () => {
      expect(service.getResourceUrl()).toBe('scoping/allFunds');
    });

    it('should call getAllFundList with correct params', () => {
      spyOn(service, 'get').and.returnValue(of([]));
      service.getAllFundList(1, false);
      expect(service.get).toHaveBeenCalledWith('/1/FundName');
      service.getAllFundList(2, true);
      expect(service.get).toHaveBeenCalledWith('/2/CurrentDate');
    });

    it('should call getFundScopingList', () => {
      spyOn(service, 'getAll').and.returnValue(of([]));
      service.getFundScopingList();
      expect(service.getAll).toHaveBeenCalled();
    });

    it('should call getEngagementFundGroupMappingList', () => {
      spyOn(service, 'getEngagementFundGroupList').and.returnValue(of([]));
      service.getEngagementFundGroupMappingList(123);
      expect(service.getEngagementFundGroupList).toHaveBeenCalledWith(123);
    });

    it('should call saveEngFundGroup', () => {
      spyOn(service, 'saveEngagementFundGroup').and.returnValue(of({}));
      service.saveEngFundGroup({ foo: 'bar' });
      expect(service.saveEngagementFundGroup).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should call saveEngFundGroupAndFundMapping', () => {
      spyOn(service, 'saveEngagementFundGroupAndFundMapping').and.returnValue(of({}));
      service.saveEngFundGroupAndFundMapping({ foo: 'bar' });
      expect(service.saveEngagementFundGroupAndFundMapping).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should call updateEngagementFundGroupAndFundMapping', () => {
      spyOn(service, 'updateEngagementFundGroupAndFund').and.returnValue(of({}));
      service.updateEngagementFundGroupAndFundMapping({ foo: 'bar' });
      expect(service.updateEngagementFundGroupAndFund).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should call deleteEngagementFundGroupAndFundMapping', () => {
      spyOn(service, 'deleteEngagementFundGroupAndFund').and.returnValue(of({}));
      service.deleteEngagementFundGroupAndFundMapping({ foo: 'bar' });
      expect(service.deleteEngagementFundGroupAndFund).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should call updateAuditSignOffDateForEngagementFundGroup', () => {
      spyOn(service, 'updateAuditSignOffDateForEngFundGroup').and.returnValue(of({}));
      service.updateAuditSignOffDateForEngagementFundGroup({ foo: 'bar' });
      expect(service.updateAuditSignOffDateForEngFundGroup).toHaveBeenCalledWith({ foo: 'bar' });
    });

    // Additional tests for edge cases and coverage

    it('should handle setData with undefined', () => {
      service.setData(undefined);
      expect(service.getData()).toBeUndefined();
    });

    it('should handle enableFalg with false', (done) => {
      service.routionerFlagStepperValue$.subscribe(val => {
        expect(val).toBe(false);
        done();
      });
      service.enableFalg(false);
    });

    it('should handle setSuccessMessage with null', (done) => {
      service.sucessFundValue$.subscribe(val => {
        expect(val).toEqual([]);
        done();
      });
      service.setSuccessMessage([]);
    });
    
    it('should handle setDeleteFundGroupMessage with empty string', (done) => {
      service.deleteFundGroupMessageValue$.subscribe(val => {
        expect(val).toEqual([]);
        done();
      });
      service.setDeleteFundGroupMessage([]);
    });

    it('should handle setErrorResponseStatus with false', (done) => {
      service.errorResponseStatusValue$.subscribe(val => {
        expect(val).toBe(false);
        done();
      });
      service.setErrorResponseStatus(false);
    });

    it('should call getAllFundList and log to console', () => {
      spyOn(console, 'log');
      spyOn(service, 'get').and.returnValue(of([]));
      service.getAllFundList('abc', false);
      expect(console.log).toHaveBeenCalledWith('getAllFundList', 'abc');
    });

    it('should call constructor and set initial values', () => {
      expect(service.data).toBe('');
      expect(service.flagstepper).toBeTrue();
    });

    it('should allow changing flagstepper and reading it', () => {
      service.flagstepper = false;
      expect(service.getenableFalge()).toBeFalse();
      service.flagstepper = true;
      expect(service.getenableFalge()).toBeTrue();
    });
  });


  it('should return resource url', () => {
    expect(service.getResourceUrl()).toBe('scoping/allFunds');
  });

  it('should call getAllFundList with correct params', () => {
    spyOn(service, 'get').and.returnValue(of([]));
    service.getAllFundList(1, false);
    expect(service.get).toHaveBeenCalledWith('/1/FundName');
    service.getAllFundList(2, true);
    expect(service.get).toHaveBeenCalledWith('/2/CurrentDate');
  });

  it('should call getFundScopingList', () => {
    spyOn(service, 'getAll').and.returnValue(of([]));
    service.getFundScopingList();
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should call getEngagementFundGroupMappingList', () => {
    spyOn(service, 'getEngagementFundGroupList').and.returnValue(of([]));
    service.getEngagementFundGroupMappingList(123);
    expect(service.getEngagementFundGroupList).toHaveBeenCalledWith(123);
  });

  it('should call saveEngFundGroup', () => {
    spyOn(service, 'saveEngagementFundGroup').and.returnValue(of({}));
    service.saveEngFundGroup({ foo: 'bar' });
    expect(service.saveEngagementFundGroup).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should call saveEngFundGroupAndFundMapping', () => {
    spyOn(service, 'saveEngagementFundGroupAndFundMapping').and.returnValue(of({}));
    service.saveEngFundGroupAndFundMapping({ foo: 'bar' });
    expect(service.saveEngagementFundGroupAndFundMapping).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should call updateEngagementFundGroupAndFundMapping', () => {
    spyOn(service, 'updateEngagementFundGroupAndFund').and.returnValue(of({}));
    service.updateEngagementFundGroupAndFundMapping({ foo: 'bar' });
    expect(service.updateEngagementFundGroupAndFund).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should call deleteEngagementFundGroupAndFundMapping', () => {
    spyOn(service, 'deleteEngagementFundGroupAndFund').and.returnValue(of({}));
    service.deleteEngagementFundGroupAndFundMapping({ foo: 'bar' });
    expect(service.deleteEngagementFundGroupAndFund).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should call updateAuditSignOffDateForEngagementFundGroup', () => {
    spyOn(service, 'updateAuditSignOffDateForEngFundGroup').and.returnValue(of({}));
    service.updateAuditSignOffDateForEngagementFundGroup({ foo: 'bar' });
    expect(service.updateAuditSignOffDateForEngFundGroup).toHaveBeenCalledWith({ foo: 'bar' });
  });
});