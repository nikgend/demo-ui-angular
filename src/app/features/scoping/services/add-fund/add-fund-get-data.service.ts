import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonApiService } from 'src/app/core/services/CommonService/CommonApiSevice';

@Injectable({
  providedIn: 'root'
})
export class AddFundGetDataService extends CommonApiService<any> {

  constructor(http: HttpClient) {
    super(http);
  }

  getResourceUrl() {
    return 'scoping/allLookupData'
  }

  getData(engagementTypeId? : any) {
    if(engagementTypeId === undefined)
    {
      return this.getAll();
    }
    else{
      return this.getAll(engagementTypeId);
    }

  }
}
