import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonApiService } from 'src/app/core/services/CommonService/CommonApiSevice';
import { addFundSubmit } from 'src/app/types/add-fund/add-fund-submit.component';

@Injectable({
  providedIn: 'root'
})
export class AddFundSubmitService extends CommonApiService<any> {

  constructor(http: HttpClient) {
    super(http);
  }
  getResourceUrl() {
    return 'scoping/addFund'
  }
  submitTheFund(data : any)  {
    return this.addRespText(data);
  }

  sendDbCreationMessageToServiceBus(request: any)  {
    return this.sendMessageToServiceBus(request);
  }
}
