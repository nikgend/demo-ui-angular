import { TestBed } from '@angular/core/testing';

import { EngagementBusinessunitService } from './engagement-businessunit.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EngagementBusinessunitService', () => {
  let service: EngagementBusinessunitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EngagementBusinessunitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call getBusinessData', () => {
    service.getBusinessData();  
    expect(service.getResourceUrl).toHaveBeenCalled;  
  });
});
