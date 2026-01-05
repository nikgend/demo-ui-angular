import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewEngagementService } from '../../services/view-engagement.service';
import { DatePipe } from '@angular/common';
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { viewEngagementcolumnDefinition } from '../column-definations'
import { interval, switchMap, takeWhile } from 'rxjs';
import { CustomToastService, ToastData } from 'src/app/shared/services/custom-toast.service';
import { RollForwardEngagementStatus } from 'src/app/shared/components/constants/constants';

@Component({
  selector: 'app-view-engagement',
  templateUrl: './view-engagement.component.html',
  styleUrls: ['./view-engagement.component.scss']
})
export class ViewEngagementComponent implements OnInit, OnDestroy{
  isDataAvail: boolean= true;
  engagementList:any=[];
  isFilterShow:boolean= false;
  public searchkeyword!: string;
  columnDefinition = viewEngagementcolumnDefinition;
  engagementId:any;
  clientId:any=1;
  isView:boolean =true;
  isSearch:boolean=false;
  dataLength:any;
  @ViewChild('element')  public toastObj!:ToastComponent;
  public position = { X: 'Center', Y: 'Top' };
  public showEngagementAccessError: boolean = false;
  public engagementAccessErrorMessgae = "You do not have access to this engagement. Please request access from another team member.";
  public showEngagementCloseOutError: boolean = false;
  public engagementCloseOutErrorMessgae = "Engagement status must be Closed Out/Roll-Forward Complete before a roll-forward can be completed.";
  public engagementRollForwardErrorMessgae = "We could not complete the Roll-forward. Please try again.";
  public isPolling = true;
  public rollForwardedEngagementsCount: number;
  pollingCount: number = 1;
  
  RowDefinitiondata: any;
  Isupdated: any;
  constructor(public router:Router,
    private viewEngagementService:ViewEngagementService,
    private datePipe: DatePipe,
    private toastService: CustomToastService,
    ) { }

  ngOnInit(): void {
    this.getEngagementList('');
  }

  ngOnDestroy(): void {
    this.isPolling = false; // Stop polling
    this.pollingCount = 1;
    sessionStorage.removeItem('rollForwardEngDetails');
  }
  getFilterCount(count:any){
   this.dataLength = count;
  }
  addEngagement(){
    this.router.navigate(['/fundscoping/add-engagement']);
  }
  clearSerchValue() {
   this.getEngagementList('');
  }
  getSearchResult(data: any){
    // TODO document why this method 'getSearchResult' is empty
  
    
  }
  getEngagementList(searchkeyValue:any, pollingContine: boolean = true){
    this.isView = true;
          this.isSearch = false;
    this.engagementList=[];
    this.viewEngagementService.getEngagementList(0,searchkeyValue,this.clientId).subscribe((result :any) => {
      if(result.data && result.data.length > 0 ){
        this.engagementList=result.data;
         this.engagementList.map((res:any)=>{
          res.periodEndDate= new Date(res.periodEndDate);
        })
          const isRollForwardInProgress = result.data.filter((engList) => engList.engagementStatus === RollForwardEngagementStatus.RollForwardInProgress && engList.userHasAccessToEngagement)
          let rollForwardEngObj: any = sessionStorage.getItem('rollForwardEngDetails');
          rollForwardEngObj = JSON.parse(rollForwardEngObj);
          if (isRollForwardInProgress.length && pollingContine) {
            console.log("called...")
            setTimeout(() => {
              this.viewEngagementService.getRollFowrardEngagementStatus(this.pollingCount++).subscribe((result :any) => {
                  this.rollForwardedEngagementsCount = result.data.filter((engList) => engList.engStatus === RollForwardEngagementStatus.RollForwardInProgress).length
                  // Start polling after 1 minute (60000 milliseconds)
                  this.startPolling(isRollForwardInProgress);
                  sessionStorage.removeItem('rollForwardEngDetails');
                });
            }, 60000);

          } else if (rollForwardEngObj && rollForwardEngObj?.isRollForwardEng) {
            const engagementName = rollForwardEngObj?.engName;
            const toastData: ToastData = {
              title: 'Roll-forward Complete',
              content: engagementName + " has been Roll-forwarded successfully.",
              type: 'success',
              width: '800',
            };
            const currentRoute = this.router.url;
            if (currentRoute === '/fundscoping/view-engagement') {
              this.toastService.initiate(toastData);
            }
            sessionStorage.removeItem('rollForwardEngDetails');
          }   
      }else{
        if(!result.succeeded && searchkeyValue != ''){
          this.isView = false;
          this.isSearch = true;
        }
      }
    }); 
  }
  startPolling(rollForwardData) {
    interval(60000) // Poll every 60 seconds
      .pipe(
        takeWhile(() => this.isPolling), // Stop when isPolling is false
        switchMap(() => this.viewEngagementService.getRollFowrardEngagementStatus(this.pollingCount++)) // Call API
      )
      .subscribe({
        next: (result) => {
          let successResponse = "";
          let failedResponse = "";
          const isRollForwardInProgress = result.data.filter((engList) => engList.engStatus === RollForwardEngagementStatus.RollForwardInProgress)
          const isRollForwardFailed = result.data.filter((engList) => engList.engStatus === RollForwardEngagementStatus.RollForwardFailed)
          if (Array.isArray(isRollForwardInProgress) && isRollForwardInProgress.length === 0 && !isRollForwardFailed.length) {
            console.log('Stop polling as response length is zero.');
            this.isPolling = false; // Stop polling
            this.pollingCount = 1;
            successResponse += (!successResponse.length) ?
              rollForwardData[0].engagementName
            : "," + rollForwardData[0].engagementName;
            const toastData: ToastData = {
              title: 'Roll-forward Complete',
              content: successResponse + " has been Roll-forwarded successfully.",
              type: 'success',
              width: '800',
            };
            const currentRoute = this.router.url;
            if (currentRoute === '/fundscoping/view-engagement') {
              this.toastService.initiate(toastData);
            }
            
            this.getEngagementList('');
          } else if (this.rollForwardedEngagementsCount > isRollForwardInProgress.length && this.rollForwardedEngagementsCount !== isRollForwardInProgress.length && isRollForwardInProgress.length !== 0) {
            this.rollForwardedEngagementsCount = isRollForwardInProgress.length;
            this.getEngagementList('', false);
          } else if (!isRollForwardInProgress.length && isRollForwardFailed.length && this.pollingCount > 3) {
            this.isPolling = false; // Stop polling
            this.pollingCount = 1;
            failedResponse += (!failedResponse.length) ?
              rollForwardData[0].engagementName
            : "," + rollForwardData[0].engagementName;
            const toastData: ToastData = {
              title: 'Roll-forward Failed',
              content: `We could not complete the Roll-forward for ${failedResponse}. Please try again.`,
              type: 'error',
              width: '800',
            };
            const currentRoute = this.router.url;
            if (currentRoute === '/fundscoping/view-engagement') {
              this.toastService.initiate(toastData);
            }
            this.getEngagementList('');
          }
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });
  }
  searchKeyword(event: any) {
    let regexMMddyyyy = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    let regexMMdd = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/;
    let regexMMddslace = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/$/;
    let regexMMslace = /^(0[1-9]|1[0-2])\/$/;
    let regexslacedate = /^\/(0[1-9]|1\d|2\d|3[01])$/;
    let valid = regexMMddyyyy.test(event);
    if (valid) {
      let searchkeywordDate = (this.datePipe.transform(event, 'MM-dd-yyyy'))?.toString();
      this.getEngagementList(searchkeywordDate);
    }
    else if (regexMMdd.test(event)) {
      let searchkeywordDate = (this.datePipe.transform(event, 'MM-dd'))?.toString();
      this.getEngagementList(searchkeywordDate);
    }
    else if (regexMMddslace.test(event)) {
      let searchkeywordDate = (this.datePipe.transform(event, 'MM-dd-'))?.toString();
      this.getEngagementList(searchkeywordDate);
    }
    else if (regexMMslace.test(event)) {
      let searchkeywordDate = (this.datePipe.transform(event, 'MM-'))?.toString();
      this.getEngagementList(searchkeywordDate);
    }
    else if (regexslacedate.test(event)) {
      let searchkeywordDate = event.replace("/", "-");
      this.getEngagementList(searchkeywordDate);
    }
    else {
      this.searchkeyword = event;
      this.getEngagementList(this.searchkeyword);
    }
  }

  public closeAccessError() {
    this.showEngagementAccessError = false;
  }

  public accessIssue($e: boolean) {
    this.showEngagementAccessError = $e;
  }

  public closeCloseOutError() {
    this.showEngagementCloseOutError = false;
  }

  public closeOutIssue($e: boolean) {
    this.showEngagementCloseOutError = $e;
  }
}