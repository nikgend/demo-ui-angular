import { TestBed } from '@angular/core/testing';
import { EngagementADService } from './engagement-AD.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('EngagementADService', () => {
  let service: EngagementADService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EngagementADService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call getActiveDirectoryAllUsersData', () => {
    const data="testUser@";
    service.getActiveDirectoryAllUsersData(data);  
    expect(service.getResourceUrl).toHaveBeenCalled;  
  });
});
