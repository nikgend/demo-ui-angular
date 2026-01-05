import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonApiService } from 'src/app/core/services/CommonService/CommonApiSevice';


import { rowdatamodel } from 'src/app/types/custom-gird/interfaces/custom-grid-row.component';
import { newResponseLookupDataModel } from 'src/app/types/custom-gird/interfaces/new-response-lookupdata.model';

@Injectable({
  providedIn: 'root'
})
export class ScopingListService extends CommonApiService<newResponseLookupDataModel[]> {

  addNewFund: boolean = false;
  getResourceUrl(): string {
    return 'scoping/dashboard';
  }

  constructor(private http: HttpClient) {
    super(http);
  }

  // getFundScopingList() {
  //   const createParams = `/318/FundName`;
  //   return this.get(createParams);
  // }
  getDashboardItemList(user: string) {
    const createParams = user? `?userId=${user}` : '';
    return this.get(createParams);
  }

  getAddNewFundValue(){
    return this.addNewFund;
  }

  setAddNewFundValue(newValue:boolean){
     this.addNewFund = newValue;
  }

  getSearch(searchVal : string) {
    const params = '?searchKeyValue='+ encodeURIComponent(searchVal);
    return this.get(params); 
  }
}
