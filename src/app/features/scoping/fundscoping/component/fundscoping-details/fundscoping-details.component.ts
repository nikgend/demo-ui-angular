import {
  Component,
  OnInit,
  ViewChild,
  Input,
  AfterViewInit,
  OnDestroy,
  effect
} from '@angular/core';
import { AddFundComponent } from 'src/app/features/scoping/component/add-fund/add-fund.component';
import { CustomGridColumns } from 'src/app/types/custom-gird/interfaces/custom-grid-columns';
import { rowdatamodel } from 'src/app/types/custom-gird/interfaces/custom-grid-row.component';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/core/services/sessionstorage-handling/sessionstorage-handling.service';
import { FundScopingDetailsService } from '../../services/fundscoping-details.service';
import { ScopingListService } from '../../../services/scoping-list.service';
import { DeleteFundService } from '../../../services/delete-fund.service';
import { CustomConfirmationDialogComponent } from '../../../../../shared/components/custom-confirmation-dialog/custom-confirmation-dialog.component';
import { Constants, EngagementStatus } from 'src/app/shared/components/constants/constants';
import { QABService } from 'src/app/features/qab/services/qab.service';
import { ViewEngagementService } from '../../services/view-engagement.service';
import { DatePipe } from '@angular/common';
import { CustomToastService, ToastData } from 'src/app/shared/services/custom-toast.service';
import { EditFundService } from '../../../services/edit-fund.service';
import { interval, Subscription } from 'rxjs';
import { fundScopingColumnDef } from '../column-definations';
import { EngDetailsListRequestAction, EngDetailsUpdateAction } from 'src/app/shared/components/engagement-details/engagement-state/actions/eng-actions';
import { getEngDetailEntities, RootReducerState } from 'src/app/shared/components/engagement-details/engagement-state/reducers';
import { Store } from '@ngrx/store';
import { SharedStorageOperationsService } from 'src/app/core/services/CommonService/shared-storage-operations.service';
import { FundInprogressService } from '../../../services/fund-inprogress.service';
import { EnvService } from 'src/app/shared/services/env-service/env.service';

@Component({
  selector: 'app-fundscoping-details',
  templateUrl: './fundscoping-details.component.html',
  styleUrls: ['./fundscoping-details.component.scss'],
})
export class FundscopingDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(AddFundComponent) addFundComponent!: AddFundComponent;
  @ViewChild(CustomConfirmationDialogComponent)
  customConfirmationDialogComponent!: CustomConfirmationDialogComponent;

  public deletModalTitle: string = Constants.ConfirmDialogTitle;
  public deleteModalMessage: string = Constants.ConfirmDialogMessage;
  public selctdFundId!: number;
  public selectedFundDetails!: rowdatamodel[];
  public showErrorMsgDiv = false;
  selectedFundIds: Array<{ fundId: number }> = [];
  public allowRoutineSelection: boolean = true;
  public count: number = 3;
  public getPriviousSelection: object[] = [];
  public RowDefinitiondata: rowdatamodel[] = [];
  public selectedIds: rowdatamodel[] = [];
  public selectedFundAnalysisIds!: number[];
  public showSuccessMessage: Boolean = false;
  public showUpdateFundSuccessMessage: Boolean = false;
  public successUpdateFundResponse: string = '';
  public successResponse: string = '';
  public showDeleteSuccessMessage: Boolean = false;
  public deleteSuccessResponse: string = '';
  public cannotdeleteResponse: string = '';
  public deletemessage!: string;
  public cannotDelete!: string;
  public showSeletefundMessage: Boolean = false;
  public selectFundMessage: string = '';
  public response!: string;
  public dynamicClassForList: string = 'text-align-delete-fund-modal';
  public editFundErrorStatus: boolean = false;
  public fundNameErrorMessage: string = "";
  public selectedFunNameList: string[] = [];
  public setErrorResponseStatus: Boolean = false;
  public setTitleTostMessage : string ="";
  public setContentTostMessage : string ="";
  public trackInterimStatusSubscription!: Subscription;
  public trackInterimStatusInterval!: any;
  @Input() itemFlag = '';

  public columnDefinition: CustomGridColumns[] = fundScopingColumnDef;
  public widthFlag: number = 1;
  newdata: any;
  engagementDetailsObj: any = {};
  public editFundServiceSub!: Subscription;
  public refreshTheGrid: boolean = false;
  isSucceeded: boolean = false;
  isFundGroupSucceeded: boolean = false;
  isSucceededDeleteFundGroup: boolean = false;
  successFundMessage: any;
  sucessFundGroupMessage: any;
  successDeleteFundGroupMessage: any;
  sucessFundEvent: any;
  sucessFundGroupEvent: any;
  deleteFundGroupEvent: any;
  public buttonYesValue: string = 'Yes';
  public isbuttonNoValue: boolean = false;
  dataLength: any;
  public isEngagementClosed: boolean = false;
  private searchKey:string=null;
  private defaultClientId:number=1
  constructor(
    public router: Router,
    public scopingListService: ScopingListService,
    public sessionStorageService: SessionStorageService,
    public fundScopingDetailsService: FundScopingDetailsService,
    public deleteFundservice: DeleteFundService,
    public qabService: QABService,
    private datePipe: DatePipe,
    private toastService: CustomToastService,
    private editFundService: EditFundService,
    private store: Store<RootReducerState>,
    public viewEngagementService:ViewEngagementService,
    private sharedStorageOperationsService:SharedStorageOperationsService,
    private inProgressService : FundInprogressService) {

      effect(() => {
        const data = this.inProgressService.inProgressPollingCall$();
        if (!data) return;
        this.unSubscribeTrackInterimStatusSubscription(data.cancelSubScription);
      });
    }

  ngOnInit(): void {
    sessionStorage.removeItem('SelectedFundForRoutine');
    const storageValue: any = sessionStorage.getItem("engDetails");
    this.trackInterimStatusInterval = interval(EnvService.fundInterimPollingInterval);
    //Toggle the action based on engagement status
    this.validateEngagementCloseStatus(storageValue);
  
    this.sucessFundEvent = this.fundScopingDetailsService.sucessFundValue$.subscribe((data => {
      this.isSucceeded = data.isSucceeded
      this.successFundMessage = data.successMessage;
    }))
    this.sucessFundGroupEvent = this.fundScopingDetailsService.sucessFundGroupValue$.subscribe((data => {
      this.isFundGroupSucceeded = data.isSucceeded
      this.sucessFundGroupMessage = data.successMessage;
    }))
    this.deleteFundGroupEvent = this.fundScopingDetailsService.deleteFundGroupMessageValue$.subscribe((data => {
      this.isSucceededDeleteFundGroup = data.isSucceeded
      this.successDeleteFundGroupMessage = data.successMessage;
    }))
    setTimeout(() => {
      //if (this.scopingListService.getAddNewFundValue()) {
      if (this.scopingListService.addNewFund === true) {
        this.scopingListService.setAddNewFundValue(false);
        this.openAddFund();
      }
    }, 100);

    this.count;
    //this.RowDefinitiondata;
    this.columnDefinition;
    const checkIsFromAddFund: any = sessionStorage.getItem('fromAddFund');
    const parseTheVal = JSON.parse(checkIsFromAddFund);
    let fromAddFund = false;
    if (parseTheVal && parseTheVal === true) {
      fromAddFund = true;
    }
    if (Object.keys(this.engagementDetailsObj).length) {
      this.fetchFundList(fromAddFund);
    }
  }
  ngAfterViewInit() { 
    // Check if the fund is marked as initiateCloseOut from admin console
    window.addEventListener("storage",this.isInitiateCloseOutFromAdminConsole.bind(this))
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem('SelectedFundForRoutine');
    if (this.sucessFundEvent) {
      this.sucessFundEvent.unsubscribe();
    } this.fundScopingDetailsService.setSuccessMessage({ isSucceeded: false, successMessage: '' });
    if (this.sucessFundGroupEvent) {
      this.sucessFundGroupEvent.unsubscribe();
    }
    //this.fundScopingDetailsService.setFundGroupSuccessMessage({ isSucceeded: false, successMessage: '' });
    if (this.deleteFundGroupEvent) {
      this.deleteFundGroupEvent.unsubscribe();
    } 
    this.fundScopingDetailsService.setDeleteFundGroupMessage({ isSucceeded: false, successMessage: '' });
    if (this.editFundServiceSub) {
      this.editFundServiceSub.unsubscribe();
    }
    this.inProgressService.fundsListSignal$.set(null);
    this.inProgressService.inProgressPollingCallSubscriptionSignal$.set(null);
    this.unSubscribeTrackInterimStatusSubscription();
  }
  reloadFundDetails(): void {
    this.fetchFundList();
    // this.ngOnInit()
  }
  public reArrangeResult(result: any) {
    result.forEach((item: any) => {
      item.brokerCusto = item.brokerCustodianName
        .join(", ");
      item.brokerCustoCount = item.brokerCustodianName.length;
      item.invstType = item.investmentType.join(", ");
      item.invstTypeCount = item.investmentType.length;
      item.psDateCopy = item.periodStartDate;
      item.peDateCopy = item.periodEndDate;
      item.expectedAuditSignOffDateCopy = item.expectedAuditSignOffDate;
      // var event1 = new Date(item.periodStartDate);
      // let date1 = JSON.stringify(event1);
      // date1 = date1.slice(1, 11);
      item.periodStartDate = new Date(item.periodStartDate);

      // var event = new Date(item.periodEndDate);
      // let date = JSON.stringify(event);
      // date = date.slice(1, 11);
      item.periodEndDate = new Date(item.periodEndDate);
      item.expectedAuditSignOffDate = new Date(item.expectedAuditSignOffDate);

    });
    return result;
  }
  validateEngagementCloseStatus(storageData:any)
  {
    //Update the session storage
    if (storageData === null) {
      this.store.dispatch(new EngDetailsListRequestAction());
      this.store.select(getEngDetailEntities).subscribe((result: any) => {
        this.engagementDetailsObj = result;
      });
    } else {
      this.store.dispatch(new EngDetailsUpdateAction({ data: JSON.parse(storageData) }));
      this.store.select(getEngDetailEntities).subscribe((result: any) => {
        this.engagementDetailsObj = result;
      });
    }
    let engStatus: string =this.engagementDetailsObj.hasOwnProperty("engStatus") ?
    this.engagementDetailsObj.engStatus.toLowerCase().replace(/\s/g, ""):'';
    if(engStatus && (engStatus === EngagementStatus.ClosedOut || engStatus === EngagementStatus.RollForwardComplete || engStatus === EngagementStatus.RollForwardInProgress)) {
      this.isEngagementClosed = true;
    }
  }
  isInitiateCloseOutFromAdminConsole({key})
  {
    
    if(key===this.viewEngagementService.InitiateCloseOutActionKey ?
      this.sharedStorageOperationsService.getLocalStorage(this.viewEngagementService.InitiateCloseOutActionKey)=="true" :
      false
     )
     {
      //If Yes, then fetch the updated status of engagement and fund details
      this.viewEngagementService.getEngagementList(this.engagementDetailsObj.engagementId,this.searchKey,this.defaultClientId).subscribe((result :any) => {
        if(result.data && result.data.length > 0 ){
          
          let updatedStorageValue:string='';
          //Fetch updated engagement data
          updatedStorageValue=this.viewEngagementService.updateEngagementStatus(sessionStorage.getItem("engDetails"),result);
          //Update the session storage
          this.validateEngagementCloseStatus(updatedStorageValue);
          
          //Fetch updated status for all funds.
          this.fetchFundList(false);
          //Delete local storage key
          this.sharedStorageOperationsService.deleteLocalStorage(this.viewEngagementService.InitiateCloseOutActionKey);
        }
      })
     }
  }
  fetchFundList(isOnAddFundRefresh: boolean = false) {
    //previously we have below line i commented that for new changes tocall new changes method from service
    // this.fundScopingDetailsService.getFundScopingList().subscribe(
    console.log('📋 fetchFundList called with isOnAddFundRefresh:', isOnAddFundRefresh);
    
    // DON'T clear session storage here - let the grid read it first
    // if (isOnAddFundRefresh) {
    //   sessionStorage.removeItem('fromAddFund')
    // }
    
    this.fundScopingDetailsService.getAllFundList(this.engagementDetailsObj.engagementId, isOnAddFundRefresh).subscribe(
      (result: any) => {
        if (result?.data === null) {
          this.RowDefinitiondata = [];
        }
        //setRoutinSelection
        let resource = [];
        resource.push(result);
        let rest: string | any[] = [];
        let filterresult: string | any[] = [];
        if (resource.length > 0) {
          resource.forEach((ele: any) => {
            rest = ele.data !== null ? ele.data : [];
            filterresult = ele.data !== null ? ele.data.filter((item: any) => item.fundStatusId >= 2) : [];
          })
        }
        if (filterresult.length > 0) {
          this.qabService.setRoutineSelectionValue(true);
        } else {
          this.qabService.setRoutineSelectionValue(false);
        }
        let newgridData = this.reArrangeResult(rest);
        this.RowDefinitiondata = newgridData;
        this.getFundInterimDetails(this.RowDefinitiondata);
        //this.RowDefinitiondata = this.reArrangeResult(result);
        this.checkUserSelection();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getFundInterimDetails(RowDefinitiondataLocal: rowdatamodel[]){
    this.unSubscribeTrackInterimStatusSubscription();
    this.trackInterimStatusSubscription =
      this.trackInterimStatusInterval.subscribe(() => {
        console.log('fundInterimDetails fundScoping subscribed');
this.inProgressService.getInterimStatus(this.engagementDetailsObj.engagementId,RowDefinitiondataLocal,'FundScopingDetails')
      })}
  receiveEditedFundDetails(receiveData: any) {

    this.editFundServiceSub = this.editFundService.editFund(receiveData.payload).subscribe(
      (resp) => {
        const parseTheResp = JSON.parse(resp);

        if (parseTheResp.succeeded == true) {
          this.isSucceeded = false;
          this.showUpdateFundSuccessMessage = true;
          this.editFundErrorStatus = false;
          this.successUpdateFundResponse = parseTheResp.successMessage;
          this.fundScopingDetailsService.setErrorResponseStatus(false);
          const newGridData = this.reArrangeResult(parseTheResp.data);
          this.fetchFundList(false)
        } else {
          this.isSucceeded = false;
          this.showSuccessMessage = false;
          this.showUpdateFundSuccessMessage = false;
          this.fundScopingDetailsService.setErrorResponseStatus(true);
          this.editFundErrorStatus = true;
          this.fundNameErrorMessage = parseTheResp.errorMessage;
        }
      },
      (error) => {
        this.isSucceeded = false;
        this.fundScopingDetailsService.setErrorResponseStatus(true);
        this.editFundErrorStatus = true;
        this.showUpdateFundSuccessMessage = false;
        this.fundNameErrorMessage = error.error;
      })
  }
  public checkUserSelection() {
    //make all IsSelected =false;
    this.changeIsSelectedToFalse();

    this.getPriviousSelection = this.sessionStorageService.getValue(
      'SelectedFundForRoutine'
    );
    //check if already stored in session
    if (this.getPriviousSelection.length > 0) {
      this.allowRoutineSelection = true;
      this.fundScopingDetailsService.enableFalg(this.allowRoutineSelection);
      this.RowDefinitiondata.forEach((value) => {
        let isAvilabel = this.getPriviousSelection.filter(
          (a: any) => a.analysisId === value.analysisId
        );
        if (isAvilabel.length > 0) {
          value.IsSelected = true;
        } else {
          value.IsSelected = false;
        }
      });
      //This is for transfer the data between siblings transfer the data from here to routine selection
      let selectedFunds = this.RowDefinitiondata.filter(
        (item: any) => item.IsSelected
      );
      this.fundScopingDetailsService.setData(selectedFunds);
    }
    else {
      this.allowRoutineSelection = false;
      this.fundScopingDetailsService.enableFalg(this.allowRoutineSelection);
    }
  }
  checkFundNameValidation(data: any) {
    this.editFundErrorStatus = data.status;
    this.fundNameErrorMessage = data.message;
    if (data.status === false) {
      this.showUpdateFundSuccessMessage = false;
    }
  }
  closeTheBannerAlert() {
    this.editFundErrorStatus = false;
  }
  openAddFund() {
    this.showSeletefundMessage = false;
    this.showDeleteSuccessMessage = false;
    this.showSuccessMessage = false;
    // this.addFundComponent.triggerOpen();
    this.router.navigate(["/fundscoping/add-fund"]);
    // this.route.snapshot.queryParams['newFundClick'] = 'false';
    // this.router.navigate([], {
    //   queryParams: {
    //     newFundClick: null,
    //   },
    //   queryParamsHandling: 'merge'
    // });
  }
  closeSuccessAlert() {
    this.showSuccessMessage = false;
  }
  closeUpdateSuccessAlert() {
    this.showUpdateFundSuccessMessage = false;
  }
  deleteFund() {
    this.fundScopingDetailsService.setSuccessMessage({ isSucceeded: false, successMessage: '' });
    this.deleteModalMessage = Constants.ConfirmDialogMessage;
    this.buttonYesValue = "Yes";
    this.isbuttonNoValue = false;
    this.showSuccessMessage = false;
    this.showDeleteSuccessMessage = false;
    if (
      this.RowDefinitiondata.filter((item) => item.IsSelected == true).length >
      0
    ) {
      this.selectedFunNameList = [];
      var importedFunds: any = [];
      this.RowDefinitiondata.forEach((a: any) => {
        if (a.IsSelected == true) {
          importedFunds.push(a);
          if (a.editImportStatus) {
            this.selectedFunNameList.push(a.fundName);
          }

        }
      });

      if (importedFunds.length == this.selectedFunNameList.length) {
        this.deleteModalMessage = Constants.ConfirmDialogwithAllDataImportMessage;
        this.buttonYesValue = "Ok";
        this.isbuttonNoValue = true;
      }
      if (importedFunds.length && this.selectedFunNameList.length != 0 && (importedFunds.length != this.selectedFunNameList.length)) {
        this.deleteModalMessage = Constants.ConfirmDialogwithDataImportMessage;
        this.buttonYesValue = "Yes";
        this.isbuttonNoValue = false;
      }

      this.customConfirmationDialogComponent.triggerOpen();
    } else {
      // this.showSeletefundMessage = true;
      // this.selectFundMessage = 'Please select a fund to delete.';
      this.store.select(getEngDetailEntities).subscribe((result: any) => {
        if(result.engagementType === Constants.Entity)
        {
        this.setTitleTostMessage = "Select an Entity";
        this.setContentTostMessage = "Please select an entity before clicking " + `"Delete Entity"`
        }else{
          this.setTitleTostMessage = "Select a Fund";
          this.setContentTostMessage = "Please select a fund before clicking " + `"Delete Fund"`;
        }
    });
      const toastData: ToastData = {
      title:  this.setTitleTostMessage,
      content:  this.setContentTostMessage,
      type: 'primary'
  }
  this.toastService.initiate(toastData)
      //this.showErrorMsgDiv = true;
    }
  }

  clickClose() {
    this.showErrorMsgDiv = false;
  }

  rowSelected($event: any) {
    this.selectedFundIds = $event;

    this.changeIsSelectedToFalse();
    this.RowDefinitiondata.forEach(function (value) {
      value.IsSelected = false;
    });
    $event.forEach((a: any) => {
      this.RowDefinitiondata.filter(
        (item) => item.analysisId === +a.analysisId
      ).forEach((item) => (item.IsSelected = true));
    });

    if (
      this.RowDefinitiondata.filter((item) => item.IsSelected == false).length === this.RowDefinitiondata.length
    ) {
      this.allowRoutineSelection = false;
      this.showSeletefundMessage = false;
      this.fundScopingDetailsService.enableFalg(this.allowRoutineSelection);
      this.showSuccessMessage = false;
    }

    this.setDataToSessionStorage();

    //This is for transfer the data between siblings transfer the data from here to routine selection
    let selectedAnalysId: any = [];
    selectedAnalysId = $event.map((item: any) => item.analysisId);
    let selectedFund: any = [];
    this.RowDefinitiondata.map((item: any) => {
      if (selectedAnalysId.indexOf(item.analysisId) > -1) {
        selectedFund.push(item);
      }
    });
    this.fundScopingDetailsService.setData(selectedFund);
    // End here
  }

  navigatetoroutineselection(): void {
    this.router.navigate(['/fundscoping/routineselection']);
  }

  setDataToSessionStorage() {
    if (
      this.RowDefinitiondata.filter((item) => item.IsSelected == true).length >
      0
    ) {

      var selectData = this.RowDefinitiondata.filter(
        (s) => s.IsSelected == true
      );
      this.sessionStorageService.setValue('SelectedFundForRoutine', selectData);
    }
  }

  changeIsSelectedToFalse() {
    this.RowDefinitiondata.forEach(function (value) {
      value.IsSelected = false;
    });
  }

  navigateToScopingList() {
    this.router.navigate(['/fundscoping/view-engagement']);
  }
  refreshOnNewFundAdd(data: any) {
    if (data.status) {
      this.showSuccessMessage = data.status;
      this.successResponse = data.message;
      const onAddFundRefresh = true;
      this.fetchFundList(onAddFundRefresh);
    }
  }
  closeTheAlert(status: string) {
    if (status === 'success') {
      this.showSuccessMessage = false;
    }
  }
  closeThedeleteAlert(status: string) {
    if (status === 'success') {
      this.showDeleteSuccessMessage = false;
    }
  }
  closeTheSucessFundAlert(status: string) {
    if (status === 'isSucceeded') {
      this.isSucceeded = false;
    }
  }
  closeTheSucessDeleteFundAlert(status: string) {
    if (status === 'isSucceededDeleteFundGroup') {
      this.isSucceededDeleteFundGroup = false;
    }
  }
  closeSelectFundAlert(status: string) {
    if (status === 'info') {
      this.showSeletefundMessage = false;
    }
  }

  isUserConfired($event: any) {
    this.refreshTheGrid = false
    if ($event) {
      this.selectedIds = this.RowDefinitiondata.filter(
        (s) => (s.IsSelected == true && !(s.editImportStatus))
      );

      const isFundGroupExists = this.selectedIds.some((item) => item.engagementAndFundGroupMappingId)

      this.selectedFundAnalysisIds = this.selectedIds.map(
        (item) => item.analysisId
      );
      if (this.selectedFundAnalysisIds.length > 0) {
        this.deleteFundservice
          .deleteFund(this.selectedFundAnalysisIds)
          .subscribe((resp) => {
            let newdata = JSON.parse(resp);
            this.response = newdata;
            if (newdata.data != null) {
              newdata.data.forEach((element: any) => {
                if (element.isAlreadyDeleted) {
                  this.editFundErrorStatus = true;
                  this.fundNameErrorMessage = element.deleteFundMessage;
                }
                else {
                  var data = (element.deleteFundMessage ?? '').split('\n');
                  this.deletemessage = data[0] ?? '';
                  this.cannotDelete = data[1] ?? '';
                  var completemessage = data[2] ?? '';
                  this.cannotDelete += completemessage;
                  if (this.deletemessage.length > 0) {
                    this.showDeleteSuccessMessage = true;
                    this.deleteSuccessResponse = this.deletemessage;
                    sessionStorage.removeItem('SelectedFundForRoutine');
                  }
                  if (this.cannotDelete.length > 0) {
                    this.cannotdeleteResponse = this.cannotDelete;
                  }
                }
              });


            }
            else {
              var data = (newdata.errorMessage ?? '').split('\n');
              this.deletemessage = data[0] ?? '';
              this.cannotDelete = data[1] ?? '';
              var completemessage = data[2] ?? '';
              this.cannotDelete += completemessage;
              if (this.deletemessage.length > 0) {
                this.showDeleteSuccessMessage = true;
                this.deleteSuccessResponse = this.deletemessage;
              }
              if (this.cannotDelete.length > 0) {
                this.cannotdeleteResponse = this.cannotDelete;
              }
            }

            const onDeleteFundRefresh = true;
            this.fetchFundList(onDeleteFundRefresh);
            if(isFundGroupExists) {
              this.refreshTheGrid = true;
            }
          });
        this.customConfirmationDialogComponent.triggerClose();
      }
      else {
        this.customConfirmationDialogComponent.triggerClose();
      }
    }
    else {
      this.customConfirmationDialogComponent.triggerClose();
    }
  }
  getFilterCount(count: any) {
    this.dataLength = count;
  }

  unSubscribeTrackInterimStatusSubscription(cancelSubScription?: boolean) {
    if (this.trackInterimStatusSubscription && (cancelSubScription === undefined || cancelSubScription)) {
      this.trackInterimStatusSubscription.unsubscribe();
      this.trackInterimStatusSubscription = null;
    }
  }
}
