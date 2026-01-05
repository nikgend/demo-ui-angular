import { TestBed } from '@angular/core/testing';

import { AddFundSubmitService } from './add-fund-submit.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddFundSubmitService', () => {
  let service: AddFundSubmitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AddFundSubmitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call getData', () => {
    const data={};
    service.submitTheFund(data);  
    expect(service.getResourceUrl).toHaveBeenCalled;  
  });
});
