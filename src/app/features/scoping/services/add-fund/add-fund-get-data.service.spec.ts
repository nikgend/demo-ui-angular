import { TestBed } from '@angular/core/testing';

import { AddFundGetDataService } from './add-fund-get-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddFundGetDataService', () => {
  let service: AddFundGetDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AddFundGetDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call getData', () => {
    service.getData();  
    expect(service.getResourceUrl).toHaveBeenCalled;  
  });
});
