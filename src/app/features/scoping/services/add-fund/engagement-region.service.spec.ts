import { TestBed } from '@angular/core/testing';

import { EngagementRegionService } from './engagement-region.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EngagementRegionService', () => {
  let service: EngagementRegionService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EngagementRegionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call getRegionData', () => {
    service.getAllRegion();  
    expect(service.getResourceUrl).toHaveBeenCalled;  
  });
});
