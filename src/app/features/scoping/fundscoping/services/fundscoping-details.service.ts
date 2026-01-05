import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { CommonApiService } from 'src/app/core/services/CommonService/CommonApiSevice';
import { rowdatamodel } from 'src/app/types/custom-gird/interfaces/custom-grid-row.component';

@Injectable({
  providedIn: 'root',
})
export class FundScopingDetailsService extends CommonApiService<rowdatamodel[]> {

  data: any = '';
  flagstepper: boolean = true;
  public routionerFlagStepper$: Subject<any> =
    new Subject<any>();
  routionerFlagStepperValue$ = this.routionerFlagStepper$.asObservable();
  private errorResponseStatus$: Subject<boolean> =
    new Subject<boolean>();
  errorResponseStatusValue$ = this.errorResponseStatus$.asObservable();

  private sucessFund$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  sucessFundValue$ = this.sucessFund$.asObservable();

  private sucessFundGroup$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  sucessFundGroupValue$ = this.sucessFundGroup$.asObservable();

  private deleteFundGroupMessage$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  deleteFundGroupMessageValue$ = this.deleteFundGroupMessage$.asObservable();

  getResourceUrl(): string {
    return 'scoping/allFunds';
  }
 
  //added new method for append engagement Id for fetch fund scoping list based on engagement id
  getAllFundList(editEngagementId:any, isOnAddFundRefresh: boolean) {
 console.log("getAllFundList",editEngagementId);
 
    let order = 'FundName';
    if (isOnAddFundRefresh) {
      order = 'CurrentDate';
    }
    const createParams = `/${editEngagementId}/${order}`;
    return this.get(createParams);
  }

  constructor(private http: HttpClient) {
    super(http);
  }

  getFundScopingList() {
    return this.getAll();
  }

  setData(data: any) {
    this.data = data;
  }
  getData() {
    return this.data;
  }
  enableFalg(param: boolean) {
    return this.routionerFlagStepper$.next(param);
  }
  getenableFalge() {
    return this.flagstepper;
  }
  setSuccessMessage(param: any) {
    return this.sucessFund$.next(param);
  }

   // setFundGroupSuccessMessage(param: any) {
  //   return this.sucessFundGroup$.next(param);
  // }

  setDeleteFundGroupMessage(param: any) {
    return this.deleteFundGroupMessage$.next(param);
  }

  setErrorResponseStatus(status: boolean) {
    this.errorResponseStatus$.next(status)
  }

  getEngagementFundGroupMappingList(engagementId: number) {
    return this.getEngagementFundGroupList(engagementId);
  }

  saveEngFundGroup(payload: any) {
    return this.saveEngagementFundGroup(payload)
  }

  saveEngFundGroupAndFundMapping(payload: any) {
    return this.saveEngagementFundGroupAndFundMapping(payload)
  }

  updateEngagementFundGroupAndFundMapping(payload: any) {
    return this.updateEngagementFundGroupAndFund(payload)
  }

  deleteEngagementFundGroupAndFundMapping(payload: any) {
    return this.deleteEngagementFundGroupAndFund(payload)
  }

  updateAuditSignOffDateForEngagementFundGroup(payload: any) {
    return this.updateAuditSignOffDateForEngFundGroup(payload)
  }
}
