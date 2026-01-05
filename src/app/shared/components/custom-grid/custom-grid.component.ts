import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Column,
  CommandModel,
  DataStateChangeEventArgs,
  DetailRowService,
  EditSettingsModel,
  FilterSettingsModel,
  GridComponent,
  GroupSettingsModel,
  RowDataBoundEventArgs,
  RowSelectEventArgs
} from '@syncfusion/ej2-angular-grids';
import { Tooltip, TooltipComponent } from '@syncfusion/ej2-angular-popups';
import { L10n, enableRipple, setCulture } from '@syncfusion/ej2-base';
import { Subscription } from 'rxjs';
import { CustomGridColumns } from 'src/app/types/custom-gird/interfaces/custom-grid-columns';
import { rowdatamodel } from 'src/app/types/custom-gird/interfaces/custom-grid-row.component';
import { FilterEventModel } from 'src/app/types/custom-gird/models/filter-event.model';
import { QueryString } from 'src/app/types/custom-gird/models/query-string.model';
enableRipple(false);

import { DatePipe, formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import { CheckBoxSelectionService, MultiSelect } from '@syncfusion/ej2-angular-dropdowns';
import { SessionStorageService } from 'src/app/core/services/sessionstorage-handling/sessionstorage-handling.service';
import { FundscopingDataImportService } from 'src/app/features/scoping/fundscoping/services/fundscoping-data-import.service';
import { FundScopingDetailsService } from 'src/app/features/scoping/fundscoping/services/fundscoping-details.service';
import { AddFundGetDataService } from 'src/app/features/scoping/services/add-fund/add-fund-get-data.service';
import { EditFundService } from 'src/app/features/scoping/services/edit-fund.service';
import { EditTeamMemberDetailsService } from 'src/app/features/scoping/services/edit-team-member-details.service';
import {
  EngDetailsListRequestAction,
  EngDetailsUpdateAction,
} from 'src/app/shared/components/engagement-details/engagement-state/actions/eng-actions';
import { RootReducerState, getEngDetailEntities } from '../engagement-details/engagement-state/reducers';
import { StepperService } from '../stepper/stepper.service';
import { emptyRecordMessage } from 'src/app/core/constants/common.messages';
import { CustomConfirmationDialogComponent } from '../custom-confirmation-dialog/custom-confirmation-dialog.component';
import { EnvService } from 'src/app/shared/services/env-service/env.service';
import { changeLabelValue, checkEngagementTypeAndChangeHeader } from '../../../shared/utils/alternative-workflow.util';
import { SharedStorageOperationsService } from 'src/app/core/services/CommonService/shared-storage-operations.service';
import { AnimationModel } from '@syncfusion/ej2-angular-progressbar';
import { FundInprogressService } from 'src/app/features/scoping/services/fund-inprogress.service';
import { Constants,ScreenNames } from 'src/app/shared/components/constants/constants';
import { AlternativeWorkflowPipe } from 'src/app/shared/pipe/alternative-workflow.pipe';

L10n.load({
  'en-US': {
    grid: {
      EmptyRecord: emptyRecordMessage.dashboardFundList,
    }
  }
});

const localeFilterMsg = {
  'afterfilter-LANG': {
    grid: {
      EmptyRecord: emptyRecordMessage.noMatchFound
    }
  }
}
@Component({
  selector: 'Custom-Grid',
  templateUrl: './custom-grid.component.html',
  styleUrls: ['./custom-grid.component.scss'],
  providers: [DetailRowService, CheckBoxSelectionService, AlternativeWorkflowPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default

})
export class CustomGridComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('tooltip')


  public tooltipControl!: TooltipComponent;
  public tooltipAnimation: Object = {
    open: { effect: 'None' },
    close: { effect: 'None' }
  };
  public selctedFundId!: number;
  selectedFundIds: Array<{ analysisId: number }> = [];

  engagementDetailsObj: any = {};
  public newData: any;
  public isTableExpanded = false;
  /* Custom Grid which take input from parent component, with  / Grid / Hierarchical Binding(child binding)
   *
   */
  public display: string = 'Multiple';
  public count: number = 0;
  public screenTieOut: string = 'screenTieOut';
  public investmentS: string = 'investmentS';
  public investmentFVR: string = 'investmentFVR';
  public existencVS: string = 'existencVS';
  public DerivativesFVR: string = 'DerivativesFVR';
  public SOIPreparation: string = 'SOIPreparation';
  public SOIPresentation: string = 'SOIPresentation';
  public dummy: any = 'Hello';
  public unsavedChangeExists: boolean = false;
  public isFundNameValid: boolean = true;
  public isScrollOn:number = 0;
  public animation?: AnimationModel = { enable: true, duration: 500, delay: 0 };
  public editFundErrorStatus = {
    value: '',
    error: false,
    errorMessage: ''
  };
  @Input() dataLength: any;
  @Input()
  public enablecheckbox!: boolean;
  @Input()
  public height!: number;

  public state: boolean = false;
  @Input()
  public UseFundConsoleTemple: Boolean = false;
  @Input()
  public UseFundScopingTemple: Boolean = false;
  @Input()
  public columnsList: CustomGridColumns[] = [];
  @Input()
  public childColumnsList!: object[];
  @Input()
  public data: rowdatamodel[] = [];
  @Input()
  public childData: object[] = [];
  @Input()
  public showUpdate: boolean = false;
  @Input()
  public showDelete: boolean = false;
  @Input()
  public showView: boolean = false;
  @Input()
  public showAdd = true;
  @Input()
  public intialSortSettingValues!:any;
  @Input()
  public showPrint: boolean = false;
  @Input()
  public showPdfExport: boolean = false;
  @Input()
  public showExcelExport: boolean = false;
  @Input()
  public showColumnChooser: boolean = false;
  @Input()
  public enableSorting: boolean = false;
  @Input()
  public showFilter: boolean = false;
  @Input()
  public showPagin: boolean = false;
  @Input()
  public show: boolean = true;
  @Input()
  public idKey: any;
  @Input()
  public pageSize = 50;

  @Input()
  public pageNumber = 1;

  @Input()
  public totalPages = 1;

  @Input()
  public deleteRoute = '';
  @Input()
  public editRoute!: string;
  @Input()
  public addRoute = '';
  @Input()
  public allowGrouping: boolean = false;
  @Input()
  public isGridRefreshRequired: boolean = false;

  @Input()
  public updatePrivilage!: string;
  @Input()
  public addPrivilage!: string;
  @Input()
  public deletePrivilage!: string;
  @Input()
  public isViewEngagement: boolean = false;
  @Input()
  public isSearch: boolean = false;

  @Input() initialSortSettings !: boolean ;
  
  @Input()
  public customAttributes!: { class: string };
  @Output()
  public dataQueried: EventEmitter<string> = new EventEmitter();
  @Output()
  public rowSelected: EventEmitter<any> = new EventEmitter();
  @Output()
  public deleteRecord: EventEmitter<any> = new EventEmitter();
  @Output()
  public editRecord: EventEmitter<any> = new EventEmitter();
  @Output()
  public dataCount: EventEmitter<any> = new EventEmitter();
  @Output()
  public fundNameValidation: EventEmitter<any> = new EventEmitter();
  @Output()
  public individualChange: EventEmitter<any> = new EventEmitter();
  @Input()
  public groupByOptions: GroupSettingsModel = {};
  @Output()
  public reloadGrid: EventEmitter<any> = new EventEmitter();

  // @Output() selectedFundId = new EventEmitter<any>();

  @Output()
  public dataStateChaged: EventEmitter<DataStateChangeEventArgs> = new EventEmitter();
  @Output()
  public accessIssue: EventEmitter<any> = new EventEmitter();
  @Output()
  public closeOutIssue: EventEmitter<any> = new EventEmitter();

  @ViewChild('grid', { static: false }) public grid!: GridComponent;
  @ViewChild('periodStartDate', { static: false }) periodStartDate!: ElementRef;
  @ViewChild('periodEndDate', { static: false }) periodEndDate!: ElementRef;
  @ViewChild('expectedAuditSignOffDate', { static: false }) expectedAuditSignOffDate!: ElementRef;

  public currencyFilter!: string;
  public periodBeginDateFilter!: string;
  public periodEndDateFilter!: string;
  public pageSizes!: string[];
  public initialPage!: { pageSize: number; pageSizes: string[] };
  //public filterSettings!: FilterSettingsModel;
  public toolbar: object[] = [];
  //  public selectOptions!: object;
  public commands: CommandModel[] = [];
  public setPeriodMinDates: any = {};
  public editSettings: EditSettingsModel = { allowEditing: true, allowAdding: false, allowDeleting: true };
  public query: QueryString;
  @Input() public reportingCurrency!: string;
  resizeSettings = { mode: 'Auto' };
  @ViewChild('tooltip')
  //public tooltipControl!: TooltipComponent;
  public sortOptions!: object;
  previousRow?: rowdatamodel = undefined;
  isMenuOpen: boolean = false;
  selectedrowId: any;
  public globalIcon: any =
    {
      icon: 'Ellipsis',
      iconClass: 'kpmgicon-ellipsis',
    };
  @Input()
  public teamManagementTemplate: Boolean = false;
  activeInactiveIndividFlag: boolean = false;
  public filterOptions!: FilterSettingsModel;
  public filterFlag: boolean = false;
  public editFundErrorResponseStatus: boolean = false;
  // MultSelect things
  @ViewChild('brokerCustoSelect') public brokerCustoSelect!: MultiSelect;
  // public brokCustData: Object[] = [{text: 'Australia', value: 'aus'}, {text: 'Australia', value: 'aus'}, {text: 'Australia', value: 'aus'},];
  public brokCustData: Object[] = [{}];
  public mode = '';
  public placeholder = '';
  public multiSelectField: Object = { text: 'value', value: 'id' };
  public showMultiSelect: any = [];
  public brokCustoSelected: any = [];
  private addFundGetSub!: Subscription;

  public showInvestMultiSelect: any = [];
  public investData: Object[] = [{}];
  public investmentSelected: any = [];

  public showFundTypeSelect: any = [];
  public fundTypeData: Object[] = [];
  public selectedFundType: any = [];

  private edittingFieldDetails: { field: string, index: number } = { field: '', index: -1 };

  public showFundName: any = [];
  public updatedFundName: any;
  public edittingFundName: boolean[] = [];

  public showFundAdminSelect: any = [];
  public fundAdminData: Object[] = [{}];
  public selectedFundAdmin: any = [];

  public showCurrencyCodeSelct: any = [];
  public currencyData: Object[] = [{}];
  public selectedCurrency: any = [];

  public showPeriodStartDate: any = [];
  public changedPeriodStartDate: any = [];
  public periodSartEditting: boolean[] = [];

  public showPeriodEndDate: any = [];
  public changedPeriodEndDate: any = [];
  public periodEndEditting: boolean[] = [];

  public changedAuditSignOff: any = [];
  public showAuditSignOff: any = [];
  public auditSignOffEditting: boolean[] = [];

  public changedMateriality: any = [];
  public showMateriality: any = [];

  public readonly amPmMax: number = 10000000000;
  public readonly amPmMaxErrorMessage: string = 'Maximum value is 10,000,000,000'
  public showPm: any = [];
  public changedPm: any = [];

  public showAmpt: any = [];
  public changedAmpt: any = [];
  public selectedIndexValue: any;
  public selectedFieldName: any;
  private today = new Date();
  private month = (this.today.getMonth() + 1);
  public periodMaxDate = `${this.today.getFullYear()}-${this.month > 9 ? this.month : '0' + this.month}-${this.today.getDate() > 9 ? this.today.getDate() : '0' + this.today.getDate()}`;
  public endDateMin: any = `${this.today.getFullYear()}-${this.month > 9 ? this.month : '0' + this.month}-${this.today.getDate() > 9 ? this.today.getDate() + 1 : '0' + this.today.getDate() + 1}`;
  public auditMaxDate: any = {};
  public auditMinDate: any = {};
  public maximumFundNameChar: number = 200;
  isGridReadyToLoad: boolean = false;

  @Output() editedFundDetails = new EventEmitter();

  @Output() updatedMemberListResult = new EventEmitter();
  private differ: any;
  periodEndDateErrorMessage: string = "";
  statusIcons: any = {
    "Not Started": "kpmgicon-fund_scoping",
    "Routine Selection": "kpmgicon-routine-selection",
    "Data Import": "kpmgicon-data-import",
    "Data Mapping": "kpmgicon-data-mapping",
    "Process": "kpmgicon-process",
    "Closed out": "kpmgicon-Lock",
  };
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  public dashboardAccordion: boolean[] = [];
  periodBeginMax: any = {};
  fundAdminTooltip!: Tooltip;
  investmentTypeTooltip!: Tooltip;
  fundTypeTooltip!: Tooltip;
  brokerCustodianTooltip!: Tooltip;
  content: any;
  public contentLoaded: boolean = false;
  private fundScopintSubscribe$!: Subscription;
  public sortOptionsforgrid:any;

  
  public dropdownPlaceholder = 'Select or add';
  public maxLength = 50;
  public allowSpecialChars = false;
  public dropdownOpen = false;
  public newOption = '';
  public error = '';
  public selectedValue = '';
  public isInvalid = false;
  public noGroupNames: string = 'Double click to assign a group'

  public showFundGroupSelect: any = [];
  public engagementFundGroups: Object[] = [];
  public selectedFundGroup: any = [];

  public popupModalTitle: string = "Update Expected Audit Sign-Off Date for Fund Group?";
  public popupModalMessage: string = "";
  public selectedFunNameList: string[] = [];
  public showPopup: boolean = false;
  @ViewChild(CustomConfirmationDialogComponent) CustomConfirmationDialogComponent!: CustomConfirmationDialogComponent;
  public eventAuditSignOff: any;
  public engagementFundData: any;
  public dynamicClassForList: string = 'text-align-delete-fund-modal';
  public engagementFundGroupCount: number = 0;
  enagementType : string;

  @Input()
  public requestCameFrom !: string;
  constructor(
    public cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _host: ElementRef,
    private editTeamMemberService: EditTeamMemberDetailsService,
    private editFundService: EditFundService,
    public stepperService: StepperService,
    private _addFundGet: AddFundGetDataService,
    private differs: KeyValueDiffers,
    private _datePipe: DatePipe,
    public fundScopingDetailsService: FundScopingDetailsService,
    private renderer: Renderer2,
    public store: Store<RootReducerState>,
    public dataImportService: FundscopingDataImportService,
    public sessionStorageService: SessionStorageService,
    private sharedStorageOperationsService:SharedStorageOperationsService,
    private inProgressService : FundInprogressService,
    private alternativeWorkflowPipe: AlternativeWorkflowPipe
  ) {
    if (this.showPagin === true) {
      this.pageSizes = ['50', '100', '150', '200'];
      this.initialPage = {
        pageSize: 50,
        pageSizes: this.pageSizes,
      };
    }
    this.query = new QueryString();
    this.differ = this.differs.find({}).create();
    this.renderer.listen('window', 'click',(e:Event)=>{
     if(e.target !== this.toggleButton?.nativeElement && e.target!==this.menu?.nativeElement){
         this.isMenuOpen=false;
     }
    });

    effect(() => {
      const fundsList = this.inProgressService.fundsList$();
      if (!fundsList) return;

      this.data = fundsList?.data || [];
      this.data.forEach((row, index) => {
        if (row.isUpdated) {
          this.grid.updateRow(index, row);
        }
      });
    });
  }

  //public childGrid!: GridModel;
  ngAfterOnChange() {
    if (this.isGridRefreshRequired) {
      this.grid.refresh();
    }
  }

  ngOnChanges(changes: SimpleChanges): any {
    if (this.isGridRefreshRequired) {
      this.getEngagementFundFroupList(this.engagementDetailsObj.engagementId)
    }
     if(this.initialSortSettings){
      this.sortOptionsforgrid =   this.intialSortSettingValues;
    }
    this.isScrollOn = this.data.length;
    this.data = this.data ? this.data : [];
    
    // Apply highlighting to newly added fund
    if (changes.data) {
      const checkIsFromAddFund = sessionStorage.getItem('fromAddFund');
      const addedFundId = sessionStorage.getItem('addedFundId');
      if (checkIsFromAddFund && addedFundId && this.data) {
        this.data.forEach((item: any) => {
          if (item.fundId && item.fundId.toString() === addedFundId) {
            item.cssClass = 'newly-added-fund';
          }
        });
      }
    }
    
    if (this.isViewEngagement) {
      if (this.data?.length == 0 && (sessionStorage.getItem('isSearch') === '1'||
      sessionStorage.getItem('isFilter') === '1')) {
        L10n.load({
          'en-US': {
            grid: {
              EmptyRecord: emptyRecordMessage.noMatchFound
            }
          }
        });
      }
  }else if(this.UseFundConsoleTemple){
    if (this.data?.length == 0 && sessionStorage.getItem('isSearch') === '1') {
      
       L10n.load({
         'en-US': {
           grid: {
             EmptyRecord: emptyRecordMessage.noMatchFound
           }
         }
       });
     }
    }
    if(changes.data) {
      this.cdr.detectChanges;
    }
  
    if (changes['columnsList'] && changes['columnsList'].isFirstChange()) {
      this.gridHeaderChanges();
    }
  }
  subscribeToFundScopingDetailServices() {
    this.fundScopintSubscribe$ = this.fundScopingDetailsService.errorResponseStatusValue$.subscribe((status: boolean) => {
      this.editFundErrorResponseStatus = status;
      if (status) {
        this.openEachFieldItem(this.selectedIndexValue, this.selectedFieldName)
        this.editFundErrorStatus.error = true;
      } else {
        this.editFundErrorStatus.error = false;
        this.closeEachFieldItem(this.selectedIndexValue, this.selectedFieldName)
      }
    })
  }

  dataBoundHeadItem($ev: any) {
    var headercells: any = this.grid.element.querySelectorAll('.e-headercell');
    for (var i = 0; i < headercells.length; i++) {
      const headerTableIcon: any = headercells[i].querySelector('.moreInfoKpm');
      if (headerTableIcon) {

        (headercells[i].querySelector('.e-headercelldiv') as HTMLElement).style.width = '40%';

        (headercells[i].querySelector('.e-filtermenudiv') as HTMLElement).style.position = 'absolute';
        (headercells[i].querySelector('.e-filtermenudiv') as HTMLElement).style.right = '30px';

        (headercells[i].querySelector('.moreInfoKpm') as HTMLElement).style.position = 'absolute';
        (headercells[i].querySelector('.moreInfoKpm') as HTMLElement).style.right = '8px';
        (headercells[i].querySelector('.moreInfoKpm') as HTMLElement).style.top = '15px';

        (headercells[i].querySelector('.e-sortfilterdiv') as HTMLElement).style.position = 'absolute';
        (headercells[i].querySelector('.e-sortfilterdiv') as HTMLElement).style.right = '2px';
        (headercells[i].querySelector('.e-sortfilterdiv') as HTMLElement).style.top = '25px';

        const sortNumIcon: any = headercells[i].querySelector('.e-sortnumber');
        if (sortNumIcon) {
          (headercells[i].querySelector('.e-sortnumber') as HTMLElement).style.top = '17px';
          (headercells[i].querySelector('.e-sortnumber') as HTMLElement).style.right = '73px';
        }
      }
    }
    if (this.grid.dataSource) {
      const source: any = this.grid.dataSource;
      this.dataCount.emit(source.length);
    }
    this.grid.hideScroll();

  }

  ngOnInit() {
    this.subscribeToFundScopingDetailServices();
    this.store.select(getEngDetailEntities).subscribe((result: any) => {
      this.enagementType = result.engagementType;     
      });
    const storageValue: any = sessionStorage.getItem("engDetails");      
    this.store.dispatch(storageValue ? new EngDetailsUpdateAction({ data: JSON.parse(storageValue) }) : new EngDetailsListRequestAction());
    this.store.select(getEngDetailEntities)
    .subscribe({
      next: (result: any) => {
        if(this.requestCameFrom === ScreenNames.FundScopingScreenName)
          {
            this.collectFundData(result.engagementTypeId);
            this.requestCameFrom = '';
          }
        this.engagementDetailsObj = result;
      },
      error: (err: any) => { console.log('Error occurred:', err?.message ? err.message : 'unknown error') }
    });

    this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: true };

    if (this.isViewEngagement && !this.isSearch) {
      L10n.load({
        'en-US': {
          grid: {
            EmptyRecord: emptyRecordMessage.engagementDetails
          }
        }
      });
    }
    else if (this.teamManagementTemplate) {
      L10n.load({
        'en-US': {
          grid: {
            EmptyRecord: emptyRecordMessage.noTeamMembers
          }
        }
      });

    }
    else if (this.UseFundScopingTemple) {  
       L10n.load({
            'en-US': {
              grid: {
                EmptyRecord: this.enagementType == Constants.Entity ? changeLabelValue(emptyRecordMessage.fundDetails) :emptyRecordMessage.fundDetails
              }
             }      
      });
      //Get all Selected fund
      this.data.forEach((s: rowdatamodel) => {

        if (s.IsSelected) {
          this.selectedFundIds.push({
            analysisId: s.analysisId ? s.analysisId : 0,
          });
        }
      });
      //For the DropDown
      this.mode = "CheckBox";

      // get fund group data
      this.getEngagementFundFroupList(this.engagementDetailsObj.engagementId)
    }

    else if (this.UseFundConsoleTemple) {
      L10n.load({
        'en-US': {
          grid: {
            EmptyRecord: emptyRecordMessage.dashboardFundList,
          }
        }
      });
    }

    this.filterFlag = true;

    this.filterOptions = {
      type: 'Menu',
      mode: 'Immediate'
    };

    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      let isEditting: boolean = false;
      if (this.edittingFieldDetails.field.length > 0) {
        isEditting = true;
      }
      if (!target.closest('.e-grid') && !target.closest('.e-ddl') && isEditting && !this.editFundErrorStatus.error) {
        this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
        this.edittingFieldDetails = { field: '', index: -1 };
      }
    })
  }

  gridHeaderChanges = () => {
    this.store.select(getEngDetailEntities).subscribe((result: any) => {
      this.columnsList = checkEngagementTypeAndChangeHeader(this.columnsList, result.engagementType, this.requestCameFrom);
    });
    this.isGridReadyToLoad = true;
  }
  
  ngOnDestroy() {
    this.clearFundHighlighting(); // Clear highlighting on component destruction/navigation
    this.rowSelected.emit([]);
    if (this.addFundGetSub) {
      this.addFundGetSub.unsubscribe();
    }
    // need to reset the language locale for app data
    this.grid.locale = 'en-US';
    setCulture('en-US');
    if(this.fundScopintSubscribe$) {
      this.fundScopintSubscribe$.unsubscribe();
    }
  }

  collectFundData(engagementTypeId? : any) {
    this.addFundGetSub = this._addFundGet.getData(engagementTypeId).subscribe(
      (response) => {
        const data = response.data;
        if (data.length) {
          const getBrokerCusto = data.filter((item: any) => item.type === 'BrokerCustodian');
          this.brokCustData = getBrokerCusto[0].items;
          const getInvestData = data.filter((item: any) => item.type === 'InvestmentType');
          this.investData = getInvestData[0].items;
          const getFundTypeData = data.filter((item: any) => item.type === 'FundType');
          this.fundTypeData = getFundTypeData[0].items;
          const getFundAdmin = data.filter((item: any) => item.type === "FundAdministrators");
          this.fundAdminData = getFundAdmin[0].items;
          const getCurrency = data.filter((item: any) => item.type === "Currency");
          this.currencyData = getCurrency[0].items;
        }
      }
    )
  }

  getEngagementFundFroupList(engId) {
    this.fundScopingDetailsService.getEngagementFundGroupMappingList(engId).subscribe(
      (response) => {
        this.engagementFundGroups = response.data;
      }
    );
  }

  openModal(event: any, data: any) {
    event.stopPropagation();
    this.selectedrowId = data;
    this.isMenuOpen = !this.isMenuOpen;
    // alert(this.isMenuOpen); 
  }


  onDataStateChanged(state: DataStateChangeEventArgs) {
    this.clearFundHighlighting(); // Clear highlighting on sort/filter/page changes
    this.dataStateChaged.emit(state);
    this.dataCount.emit(this.grid.currentViewData.length);
  }


  actionEndHandler(args: any) {
    // Clear highlighting on any grid action (sort, filter, etc.)
    this.clearFundHighlighting();
    
    const source: any = this.grid.dataSource;
    let dataFinalCount: number = source.length;
    switch (args.requestType) {
      case 'filterafteropen':
        L10n.load({
          'en-US': {
            grid: {
              EmptyRecord: emptyRecordMessage.noMatchFound,
            }
          }
        });
        this.grid.locale = 'en-US';
        setCulture('en-US');
        args.filterModel.dlgObj.btnObj[0].element.setAttribute('disabled', 'true')
        document.getElementsByClassName('e-flmenu-input')[0]
          .addEventListener('keydown', (event: any) => {

            if (event.key == 'Enter' && event.target['value'] == "") {

              event.stopPropagation();
            }
          });

        if (document.querySelectorAll('.e-input-group-icon.e-date-icon.e-icons').length !== 0) {
          document.querySelectorAll('.e-input-group-icon.e-date-icon.e-icons')[0].addEventListener('click', () => {
            document.getElementsByClassName('e-calendar')[0].addEventListener('click', () => {
              document.getElementsByClassName('e-flmenu-input')[0].dispatchEvent(new Event('input'));
            });
          });
          document.querySelectorAll('.e-input-group.e-control-wrapper.e-popup-flmenu.e-date-wrapper')[0].addEventListener('click', () => {
            document.getElementsByClassName('e-flmenu-input')[0].dispatchEvent(new Event('input'));
          });
        }

        document.getElementsByClassName('e-flmenu-input')[0].addEventListener('input', (args: any) => {
          if (args.target['value'] == "") {
            this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].setAttribute('disabled', 'true');
          } else {
            this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].removeAttribute('disabled');
          }
        })
        document.getElementsByClassName('e-popup-flmenu')[0].addEventListener('change', (args: any) => {
          if (args.target['value'] == "") {
            this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].setAttribute('disabled', 'true');
          } else {
            this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].removeAttribute('disabled');
          }
        })
        document.getElementsByClassName('e-flmenu-input')[0].addEventListener('click', (args: any) => {
          if (args.target['value'] == "") {
            this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].setAttribute('disabled', 'true');
          } else {
            this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].removeAttribute('disabled');
          }
        })
        document.getElementsByClassName('e-popup-flmenu')[0].addEventListener('click', (args: any) => {
          if (args.target['value'] == "" ||args.target['value'] == undefined) {
            this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].setAttribute('disabled', 'true');
          } else {
            this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].removeAttribute('disabled');
          }
        })
        if (document.querySelectorAll('.e-flmenu-valuediv').length !== 0) {
          document.querySelectorAll('.e-flmenu-valuediv')[0].addEventListener('click', (args: any) => {
            if(this.teamManagementTemplate){
              this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].removeAttribute('disabled');
            }

            document.querySelectorAll('.e-flmenu-valuediv .e-ddl-hidden')[0].addEventListener('click', (args: any) => {
              document.querySelectorAll('.e-flmenu-valuediv .e-list-item')[0].addEventListener('click', (args: any) => {
                let inputElement: HTMLInputElement = document.getElementsByClassName('e-flmenu-input')[0] as HTMLInputElement;
                if (inputElement.value == "") {
                  this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].setAttribute('disabled', 'true');
                } else {
                  this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].removeAttribute('disabled');
                }
              });
            });

            document.querySelectorAll('.e-flmenu-valuediv')[0].addEventListener('hover', (args: any) => {
              let inputElement: HTMLInputElement = document.getElementsByClassName('e-flmenu-input')[0] as HTMLInputElement;
              if (inputElement.value == "") {
                this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].setAttribute('disabled', 'true');
              } else {
                this.grid.element.getElementsByClassName('e-flmenu-okbtn')[0].removeAttribute('disabled');
              }
            });
          });
        }


        break;

      case 'filtering':
        this.fundScopingDetailsService.setSuccessMessage({ isSucceeded: false, successMessage: '' });
        const filteringModel = new FilterEventModel();
        if (args === undefined) {
          filteringModel.columnName = args['currentFilterObject']['field'];
          filteringModel.operator = args['currentFilterObject']['operator'];
          filteringModel.value = args['currentFilterObject']['value'];
        }
        if(args.action === 'filter') {
          const gridObj: any = this.grid;
          const filteredData = gridObj.currentViewData;
          dataFinalCount = gridObj.pageSettings.totalRecordsCount > 0 ? gridObj.pageSettings.totalRecordsCount : filteredData.length;
        } else if(args.action === 'clearFilter') {
          const gridObj: any = this.grid;
          dataFinalCount = gridObj.currentViewData.length > 0 ? gridObj.currentViewData.length : 0;
          this.dataCount.emit(dataFinalCount);
        }

        break;

      case 'searching':
        this.query.searchString = args['searchString'];

        break;
      case 'paging':
        this.query.searchString = args['searchString'];

        break;
    }

    if (args.requestType !== 'refresh') {
      this.dataQueried.emit(this.prepareQuery());
    }
    if (this.showPagin === true) {
      if (
        this.query.pageSize !== this.grid.pageSettings.pageSize ||
        this.query.pageNumber !== this.grid.pageSettings.currentPage
      ) {
        this.query.pageSize = this.grid.pageSettings.pageSize;
        this.query.pageNumber = this.grid.pageSettings.currentPage;
        this.dataQueried.emit(this.prepareQuery());
      }
    }
    if(args.requestType !== 'filterafteropen')
    {
      const gridObj: any = this.grid;
      dataFinalCount = gridObj.currentViewData.length > 0 ? gridObj.currentViewData.length : 0;
      this.dataCount.emit(dataFinalCount);
    }
  }

  public prepareQuery(): string {
    let searchString = `selectedColumns=${this.query.selectedColumns?.toString()}&`;

    if (this.query.searchString) {
      searchString += `searchString=${this.query.searchString}&`;
    }

    if (this.query.sortBy) {
      searchString += `sortBy=${this.query.sortBy}&sortDirection=${this.query.sortDirection}&`;
    }

    searchString += `pageSize=${this.query.pageSize}&pageNumber=${this.query.pageNumber}`;

    return searchString;
  }

  rowIsSelected(event: RowSelectEventArgs): void {
    this.clearFundHighlighting(); // Clear highlighting on row selection
    this.rowSelected.emit(event);
  }

  // Helper method to clear fund highlighting and session storage
  private clearFundHighlighting(): void {
    // Remove CSS class from any highlighted rows
    const highlightedRows = document.querySelectorAll('.newly-added-fund');
    highlightedRows.forEach(row => {
      row.classList.remove('newly-added-fund');
    });
    
    // Clear session storage
    sessionStorage.removeItem('fromAddFund');
    sessionStorage.removeItem('addedFundId');
  }

  rowDataBound(event: RowDataBoundEventArgs) {
    for (const cols of this.grid.columns) {
      if ((cols as Column).field === 'brokerCustodian') {
        (cols as Column).isPrimaryKey = true;
      }
    }
    
    // Check if this fund was recently added and apply highlighting
    const checkIsFromAddFund = sessionStorage.getItem('fromAddFund');
    const addedFundId = sessionStorage.getItem('addedFundId');
    
    if (checkIsFromAddFund && JSON.parse(checkIsFromAddFund) === true && event.data && event.row) {
      if (addedFundId && (event.data as any).fundId && 
          (event.data as any).fundId.toString() === addedFundId) {
        
        const rowElement = event.row as HTMLElement;
        rowElement.classList.add('newly-added-fund');
        // Highlighting will be cleared by user actions or navigation
      }
    }
  }

  
  goToAnalysis(data: any) {
    this.clearFundHighlighting(); // Clear highlighting on navigation
    const engDetails = this.engagementData(data);
    let obj = {slectedFund: data.fundId, analysisId: data.analysisId};
    this.sessionStorageService.setValue('slectedFund', obj);
    this.store.dispatch(new EngDetailsUpdateAction({ data: engDetails }));
    this.router.navigateByUrl('analysis/tie-outs');
  }

  // Syncfusion queryCellInfo event for conditional cell formatting
  queryCellInfo(args: any): void {
    const checkIsFromAddFund = sessionStorage.getItem('fromAddFund');
    const addedFundId = sessionStorage.getItem('addedFundId');
    
    if (checkIsFromAddFund && JSON.parse(checkIsFromAddFund) === true && 
        args.data && addedFundId && args.data.fundId && 
        args.data.fundId.toString() === addedFundId) {
      
      // Apply highlighting to the entire row through the cell
      if (args.cell && args.cell.parentElement) {
        const row = args.cell.parentElement as HTMLElement;
        row.classList.add('newly-added-fund');
        // Highlighting will be cleared by user actions or navigation
      }
    }
  }

  changeState = (row: rowdatamodel) => {
    this.dashboardAccordion = [];
    const index: any = row.index;
    this.dashboardAccordion[index] = !this.dashboardAccordion[index];
    if (this.previousRow && this.previousRow.index === index) {
      this.dashboardAccordion[index] = false;
    }
    this.previousRow = this.previousRow && this.previousRow.index === row.index ? undefined : row;
  };

  onCheckboxChange(e: any) {

    this.data.forEach((a: any) => {
      if (a.IsSelected == true) {
        this.selectedFundIds.push({ analysisId: +a.analysisId });
      }
    });

    if (e.target?.checked) {
      this.selctedFundId = e.target?.value;
      this.selectedFundIds.push({ analysisId: +this.selctedFundId });
      //this.selectedFundId.emit(this.selectedFundIds);
      this.rowSelected.emit(this.selectedFundIds);
    } else {
      this.selctedFundId = e.target?.value;
      this.data
        .filter((item) => item.analysisId === +this.selctedFundId)
        .forEach((item) => (item.IsSelected = false));

      this.remove(this.selctedFundId);
      //this.selectedFundId.emit(this.selectedFundIds);
      this.rowSelected.emit(this.selectedFundIds);
    }
  }
  public remove(selctedFundId: number) {
    this.selectedFundIds = this.selectedFundIds.filter(
      (item) => item.analysisId !== +selctedFundId
    );
  }
  viewEngagement(data: any) {
    if(data.userHasAccessToEngagement) {
      const engagementData = this.engagementData(data);
      if(this.dataImportService.currentEngagementId !== data.engagementId) {
        this.dataImportService.uploadStart = false;
        this.dataImportService.finalUploadDetails = [0,0,[],[]];
        this.dataImportService.fileLength = 0;
      }
  
      this.store.dispatch(new EngDetailsUpdateAction({ data: engagementData }));
      this.router.navigateByUrl('/fundscoping/fundetails');
      this.accessIssue.next(false);
    } else {
      this.accessIssue.next(true);
    }
  }
  onIndividualSwitchChange(data: any, event: any) {

    const payload = {
      memberId: data.memberId,
      engagementId: this.engagementDetailsObj.engagementId,
      userId: data.userId,
      emailAddress: data.emailAddress,
      isActive: !event.checked,
      modifiedBy: "testUser"
    }

    this.editTeamMemberService.updateTeamMemberStatus(payload).subscribe(
      (resp: any) => {
        let result = JSON.parse(resp);
        if (result.succeeded) {
          let arr = [];
          arr.push(payload)
          this.updatedMemberListResult.emit(arr);
          this.individualChange.emit();
        }
      });
  }

  engagementData = (data: any) => {
    const engagemmentTypeMasterData = JSON.parse(this.sharedStorageOperationsService.getLocalStorage('engagemmentTypeMasterData'));
    const index = engagemmentTypeMasterData.findIndex(eng => eng.engagementTypeId === data.engagementTypeId);
    const engagementData = {
      engagementId: data.engagementId,
      engagementName: data.engagementName,
      periodEndDate: data.periodEndDate,
      engStatus: data.engagementStatus,
      regionDisplayName: data.regionDisplayName,
      engagementTypeId: data.engagementTypeId,
      engagementType: engagemmentTypeMasterData[index].engagementType
    }
    return engagementData;
  }

  onDoubleClick(data: any, i: number) {
    this.clearFundHighlighting(); // Clear highlighting on edit action
    this.clearErrorStatusAndMsg();
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.showMultiSelect = []
    if(data.fundStatusName !== 'Closed out') {
      const rowBrokerCusto = data.brokerCustodianName;
      let selectedIndex: any = [];
      rowBrokerCusto?.forEach((ele: any) => {
        this.brokCustData?.forEach((element: any) => {
          if (element.value === ele) {
            selectedIndex.push(element.id);
          }
        })
      });
      this.brokCustoSelected = selectedIndex;
      this.showMultiSelect[i] = !this.showMultiSelect[i]
      this.edittingFieldDetails = { field: 'brokercustodiantype', index: i };
    }
  }
  investmentTypeClick(event: MouseEvent, data: any, i: number) {
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.clearErrorStatusAndMsg();
    this.showInvestMultiSelect = []
    const rowInvtype = data.investmentType;
    let selectedIndex: any = [];
    rowInvtype?.forEach((ele: any) => {
      this.investData?.forEach((element: any) => {
        if (element.value === ele) {
          selectedIndex.push(element.id);
        }
      })
    });
    this.investmentSelected = selectedIndex;
    this.showInvestMultiSelect[i] = !this.showInvestMultiSelect[i];
    this.edittingFieldDetails = { field: 'investmentTypeId', index: i };
    event.stopPropagation();
  }
  onFundTypeClick(event: MouseEvent, data: any, i: number) {
    this.clearErrorStatusAndMsg();
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.showFundTypeSelect = []
    const rowFundype = data.fundType;
    let selectedIndex;
    this.fundTypeData.forEach((element: any) => {
      if (element.value === rowFundype) {
        selectedIndex = element.id;
      }
    })
    this.selectedFundType = selectedIndex;
    this.showFundTypeSelect[i] = !this.showFundTypeSelect[i];
    this.edittingFieldDetails = { field: 'fundTypeId', index: i };
    event.stopPropagation();
  }
  onFundAdminClick(data: any, i: number) {
    this.clearErrorStatusAndMsg();
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.showFundAdminSelect = [];
    const rowFundAdmin = data.fundAdminName;
    let selectedIndex;
    this.fundAdminData.forEach((element: any) => {
      if (element.value === rowFundAdmin) {
        selectedIndex = element.id;
      }
    })
    this.selectedFundAdmin = selectedIndex;
    this.showFundAdminSelect[i] = !this.showFundAdminSelect[i];
    this.edittingFieldDetails = { field: 'fundAdminId', index: i };
  }
  onCurrencyCodeClick(data: any, i: number) {
    this.clearErrorStatusAndMsg();
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.showCurrencyCodeSelct = []
    if(data.fundStatusName !== 'Closed out') {
      const rowCurency = data.currencyCode;
      let selectedIndex;
      this.currencyData.forEach((element: any) => {
        if (element.value === rowCurency) {
          selectedIndex = element.id;
        }
      })
      this.selectedCurrency = selectedIndex;
      this.showCurrencyCodeSelct[i] = !this.showCurrencyCodeSelct[i];
      this.edittingFieldDetails = { field: 'currencycode', index: i };
    }
  }
  clearErrorStatusAndMsg() {
    this.editFundErrorStatus.error = false;
    let error = {
      status: false,
      message: '',
    }
    this.fundNameValidation.emit(error);
    this.closeEachFieldItem(this.selectedIndexValue, this.selectedFieldName);
  }

  clearSuccessStatusAndMsg() {
    let removedata = {
      isSucceeded: false,
      successMessage: ''
    }
    this.fundScopingDetailsService.setSuccessMessage(removedata);
    // this.fundScopingDetailsService.setFundGroupSuccessMessage(removedata);
    this.fundScopingDetailsService.setDeleteFundGroupMessage(removedata);
    this.closeEachFieldItem(this.selectedIndexValue, this.selectedFieldName);
  }

  onFundNameClick(event: MouseEvent, data: any, i: number) {
    this.clearFundHighlighting(); // Clear highlighting on edit action
    this.clearErrorStatusAndMsg();
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.showFundName = [];
    this.showFundName[i] = !this.showFundName[i];
    this.edittingFieldDetails = { field: 'fundName', index: i };
    event.stopPropagation();
  }
  closeEachFieldItem(i: number, field: string) {
    switch (field) {
      case 'fundName':
        this.showFundName[i] = false;
        break;
      case 'fundGroup':
          this.showFundGroupSelect[i] = false;
          break;
      case 'fundAdminId':
        this.showFundAdminSelect[i] = false;
        break;
      case 'currencycode':
        this.showCurrencyCodeSelct[i] = false;
        break;
      case 'fundTypeId':
        this.showFundTypeSelect[i] = false;
        break;
      case 'investmentTypeId':
        this.showInvestMultiSelect[i] = false;
        break;
      case 'brokercustodiantype':
        this.showMultiSelect[i] = false;
        break;
      case 'periodstartdate':
        this.showPeriodStartDate[i] = false;
        break;
      case 'periodenddate':
        this.showPeriodEndDate[i] = false;
        break;
      case 'expectedauditsignoffdate':
        this.showAuditSignOff[i] = false;
        break;
      case 'mat':
        this.showMateriality[i] = false;
        break;
      case 'pm':
        this.showPm[i] = false;
        break;
      case 'ampt':
        this.showAmpt[i] = false;
        break;
    }
  }
  openEachFieldItem(i: number, field: string) {
    switch (field) {
      case 'fundName':
        this.showFundName[i] = true;
        break;
      case 'fundGroup':
          this.showFundGroupSelect[i] = false;
          break;
      case 'fundAdminId':
        this.showFundAdminSelect[i] = true;
        break;
      case 'currencycode':
        this.showCurrencyCodeSelct[i] = true;
        break;
      case 'fundTypeId':
        this.showFundTypeSelect[i] = true;
        break;
      case 'investmentTypeId':
        this.showInvestMultiSelect[i] = true;
        break;
      case 'brokercustodiantype':
        this.showMultiSelect[i] = true;
        break;
      case 'periodstartdate':
        this.showPeriodStartDate[i] = true;
        break;
      case 'periodenddate':
        this.showPeriodEndDate[i] = true;
        break;
      case 'expectedauditsignoffdate':
        this.showAuditSignOff[i] = true;
        break;
      case 'mat':
        this.showMateriality[i] = true;
        break;
      case 'pm':
        this.showPm[i] = true;
        break;
      case 'ampt':
        this.showAmpt[i] = true;
        break;
    }
  }
  getNextDay(data: any) {
    let tomorrow: any;
    const today = new Date(data);
    let currentDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    tomorrow = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
    return tomorrow;
  }
  payloadInfoForSaveMateriality(data: any, event: any, fieldName: any) {
    if (fieldName === 'mat' && event.srcElement?.className.includes('saveMateriality')) {
      if (event.target.value != '') {
        return event.target.value;
      } else {
        return null;
      }
    } else {
      return data.materiality;
    }
  }
  payloadInfoForSavePM(data: any, event: any, fieldName: any) {
    if (fieldName === 'pm' && event.srcElement?.className.includes('savePM')) {
      if (event.target.value != '') {
        return event.target.value;
      } else {
        return null;
      }
    } else {
      return data.performanceMateriality;
    }
  }
  payloadInfoForSaveAMPT(data: any, event: any, fieldName: any) {
    if (fieldName === 'ampt' && event.srcElement?.className.includes('saveAMPT')) {
      if (event.target.value != '') {
        return event.target.value;
      } else {
        return null;
      }
    } else {
      return data.auditMisstatementPostingThreshold;
    }
  }
  saveFundData(data: any, event: any, fieldName: string, clicked: string): void {
    this.clearFundHighlighting(); // Clear highlighting on save action
    let saveMaterilityInfo = this.payloadInfoForSaveMateriality(data, event, fieldName)
    let savePMInfo = this.payloadInfoForSavePM(data, event, fieldName)
    let saveAMPTInfo = this.payloadInfoForSaveAMPT(data, event, fieldName)
    const payload = {
      fundId: data.fundId,
      analysisId: data.analysisId,
      name: fieldName === 'fundName' ? event.target?.value : data.fundName,
      engagementId: this.engagementDetailsObj.engagementId,
      fundAdminId: fieldName === 'fundAdminId' ? event.itemData?.id : data.fundAdminId,
      runTypeId: 1,
      currencyId: fieldName === 'currencycode' ? event.itemData?.id : data.currencyId,
      fundTypeId: fieldName === 'fundTypeId' ? event.itemData?.id : data.fundTypeId,
      investmentTypeId: fieldName === 'investmentTypeId' ? event.value : data.investmentTypeId,
      brokerCustodianId: fieldName === 'brokercustodiantype' ? event.value : data.brokerCustodianId,
      periodStartDate: fieldName === 'periodstartdate' ? new Date(event.target.value) : data.psDateCopy,
      periodEndDate: fieldName === 'periodenddate' ? new Date(event.target.value) : data.peDateCopy,
      fundStatusId: 1,
      modifiedBy: data.modifiedBy,
      groupId: data.groupId,
      expectedAuditSignOffDate: fieldName === 'expectedauditsignoffdate' ? new Date(event.target.value) : data.expectedAuditSignOffDateCopy,
      materiality: saveMaterilityInfo,
      performanceMateriality: savePMInfo,
      auditMisstatementPostingThreshold: saveAMPTInfo,
    }
    const emitData = {
      payload: payload,
      rowIndex: data.index
    }
    this.editedFundDetails.emit(emitData);
    this.selectedFieldName = fieldName;
    this.selectedIndexValue = data.index;
  }

  fundNameErrorCheck(data: string, i: number) {
    let error = {
      status: false,
      message: ''
    }
    let fundNameError;
    if (data?.length > 0) {
      this.isFundNameValid = false;
      if (data?.length < 3) {
        fundNameError = false;
        error.status = true;
        error.message = Constants.minimumThreeCharacters;
        this.fundNameValidation.emit(error);
      } else {
        const atleastOneAlphabet = data.match(".*[a-zA-Z]+.*");
        if (atleastOneAlphabet === null) {
          error.status = true;
          if (!fundNameError) {
            fundNameError = true;
            error.message = 'Fund name should contain at least 1 letter. Please enter a different fund name to proceed';
            this.fundNameValidation.emit(error);
          }
        } else {
          fundNameError = false;
          if (data.length > this.maximumFundNameChar) {
            error.message = "Fund name cannot exceed 200 characters";
            this.fundNameValidation.emit(error);
          } else {
            error.status = false;
            this.fundNameValidation.emit(error);
          }
        }
      }
    } else {
      this.isFundNameValid = true;
      error.status = true;
      error.message = "Mandatory fields. Please enter valid details and proceed.";
      this.fundNameValidation.emit(error);
    }
    this.selectedFieldName = 'fundName';
    this.selectedIndexValue = i;
    this.fundNameValidation.emit(error);
    return error;

  }
  checkAndSetIfExistingFundName(data: any) {
    if (data) {
      this.editFundErrorStatus.error = true;
    } else {
      this.editFundErrorStatus.error = false;
      this.closeEachFieldItem(this.selectedIndexValue, this.selectedFieldName)
    }
  }
  saveFundName(e: any, data: any, i: number): void {
    let inputValue = e.target?.value.replace(/^\s+/, '').replace(/\s+$/, '');
    if (data.fundName !== inputValue) {
      let fundNameValid = this.fundNameErrorCheck(inputValue, i);
      this.editFundErrorStatus.error = fundNameValid.status;
      if (!fundNameValid.status) {
        this.saveFundData(data, e, 'fundName', 'fundnametrue');
      }
      const a = "A          basda";

    }
    else {
      this.closeEachFieldItem(i, 'fundName');
    }
  }

  onFundTypeChange(data: any, event: any) {
    if (event) {
      this.saveFundData(data, event, 'fundTypeId', 'fundtypetrue');
      if(data.fundGroupName) {
        this.removeFundGroup(event, data, data.index, false);
      }
    }
  }
  closeInvestmentType(i: number) {
    if (!this.editFundErrorStatus.error) {
      this.closeEachFieldItem(i, 'investmentTypeId');
    }
  }
  onInvestmentTypeChange(event: any, data: any) {
    if (event.value.length > 0) {
      this.saveFundData(data, event, 'investmentTypeId', 'investmenttypetrue');
    } else {
      this.tirggerMandatoryError(data, "investmentTypeId")
    }
  }

  onFundAdminChange(data: any, event: any) {
    if (event) {
      this.showFundAdminSelect = [];
      this.saveFundData(data, event, 'fundAdminId', 'fundadmintrue');
    }
  }
  closeBrokerCustodianField(i: number) {
    if (!this.editFundErrorStatus.error) {
      this.closeEachFieldItem(i, 'brokercustodiantype')
    }
  }

  onbrokerCustodianNameChange(data: any, event: any) {
    if (event.value.length > 0) {
      this.saveFundData(data, event, 'brokercustodiantype', 'brokercustodiantypetrue');
    } else {
      this.tirggerMandatoryError(data, "brokercustodiantype");
    }
  }

  onCurrencyCodeChange(data: any, event: any) {
    if (event) {
      this.saveFundData(data, event, 'currencycode', 'currencytrue');
    }
  }
  onFocusIn(e: any, data: any, field: string) {
    if (e.target.value.length === 0) {
      switch (field) {
        case 'psDate':
          this.periodSartEditting[data.index] = true;
          this.tirggerMandatoryError(data, 'periodstartdate');
          break;
        case 'peDate':
          this.periodEndEditting[data.index] = true;
          this.tirggerMandatoryError(data, 'periodenddate');
          break;
        case 'audiSoffDate':
          this.auditSignOffEditting[data.index] = true;
          this.tirggerMandatoryError(data, 'expectedauditsignoffdate');
          break;
      }
    }
  }
  tirggerMandatoryError(data: any, fieldName: string) {
    this.editFundErrorStatus.error = true;
    let error = {
      status: false,
      message: ""
    }
    error.status = true;
    error.message = "Mandatory fields. Please enter valid details and proceed."
    this.fundNameValidation.emit(error);
    this.selectedFieldName = fieldName;
    this.selectedIndexValue = data.index;
  }
  savePeriodStartDate(e: any, data: any): void {
    this.periodSartEditting[data.index] = true;
    let formatAuditSignDate: any = this._datePipe.transform(data.expectedAuditSignOffDate, 'yyyy-MM-dd');
    let formatPedate: any = this._datePipe.transform(data.periodEndDate, 'yyyy-MM-dd');
    let formatCurrentDate: any = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.setPeriodMinDates[data.index] = this.getNextDay(e.target?.value);
    const currentDate = new Date(e.target.value).toDateString();
    const prevDate = data.periodStartDate.toDateString();
    if (e.target?.value?.length === 10 && (currentDate !== prevDate || this.editFundErrorStatus.error)) {
      if ((e.target?.value < formatPedate) && (e.target?.value < formatAuditSignDate) && e.target?.value <= formatCurrentDate) {
        this.editFundErrorStatus.error = false;
        if (e.target?.value !== this._datePipe.transform(data.fsPstartDate, 'yyyy-MM-dd')) {
          this.saveFundData(data, e, 'periodstartdate', 'startdatetrue');
        }
      } else {
        let error = {
          status: false,
          message: ""
        }
        error.status = true;
        if (e.target?.value === formatPedate) {
          error.message = "Period End Date cannot be same as Period Begin Date. Please enter correct date."
        }
        if (e.target?.value > formatPedate) {
          error.message = "The Period End Date cannot be before the Period Begin Date. Please enter valid date."
        }
        if (e.target?.value > formatCurrentDate) {
          error.message = "Period Begin date should not be greater than the current date."
        }
        this.editFundErrorStatus.error = true;
        this.fundNameValidation.emit(error);
        this.selectedFieldName = 'periodstartdate';
        this.selectedIndexValue = data.index;
        this.openEachFieldItem(data.index, 'periodstartdate');
        let element: HTMLInputElement = document.getElementById('fsPstartDate') as HTMLInputElement;
        let previousValue: any = this._datePipe.transform(data.periodStartDate, 'yyyy-MM-dd');
        element.value = previousValue;
      }
    } else if (e.target?.value?.length === 0) {
      let element: HTMLInputElement = document.getElementById('fsPstartDate') as HTMLInputElement;
      let previousValue: any = this._datePipe.transform(data.periodStartDate, 'yyyy-MM-dd');
      element.value = previousValue;
      this.tirggerMandatoryError(data, 'periodstartdate');
    }
  }
  savePeriodEndDate(e: any, data: any): void {
    this.periodEndEditting[data.index] = true;
    let error = {
      status: false,
      message: ""
    }
    let formatAuditSignDate: any = this._datePipe.transform(data.expectedAuditSignOffDate, 'yyyy-MM-dd');
    let formatPeriiodStartDate: any = this._datePipe.transform(data.periodStartDate, 'yyyy-MM-dd');
    this.auditMaxDate[data.index] = this.getNextDay(e.target?.value);
    const currentDate = new Date(e.target.value).toDateString();
    const prevDate = data.periodEndDate.toDateString();
    if (e.target?.value?.length === 10 && (currentDate !== prevDate || this.editFundErrorStatus.error)) {
      if ((e.target?.value > formatPeriiodStartDate) && (e.target?.value < formatAuditSignDate)) {
        error.status = true;
        error.message = "";
        if (e.target?.value !== this._datePipe.transform(data.fsPEndDate, 'yyyy-MM-dd')) {
          this.saveFundData(data, e, 'periodenddate', 'enddatetrue');
        }
      } else {
        if (e.target?.value < formatPeriiodStartDate) {
          error.status = true;
          error.message = "The Period End date cannot be before the Period begin date. Please enter valid date."
          this.editFundErrorStatus.error = true;
        } else if (e.target?.value >= formatAuditSignDate) {
          error.status = true;
          error.message = "The Expected Audit Sign-Off Date cannot be before the Period Begin Date, Period End Date or today's date. Please enter a valid date."
          this.editFundErrorStatus.error = true;
        } else if (e.target?.value === formatPeriiodStartDate) {
          error.status = true;
          error.message = "Period End Date cannot be same as Period Begin Date. Please enter correct date."
          this.editFundErrorStatus.error = true;
        }
        let element: HTMLInputElement = document.getElementById('fsPEndDate') as HTMLInputElement;
        let previousValue: any = this._datePipe.transform(data.periodEndDate, 'yyyy-MM-dd');
        element.value = previousValue;
        this.fundNameValidation.emit(error);
        this.selectedFieldName = 'periodenddate';
        this.selectedIndexValue = data.index;
        this.openEachFieldItem(data.index, 'periodenddate');
      }
    } else if (e.target?.value?.length === 0) {
      let element: HTMLInputElement = document.getElementById('fsPEndDate') as HTMLInputElement;
      let previousValue: any = this._datePipe.transform(data.periodEndDate, 'yyyy-MM-dd');
      element.value = previousValue;
      // e.target.value= data.index;
      this.tirggerMandatoryError(data, 'periodenddate');
    }
  }

  closeDateFieldAfterUpdating(data: any) {
    this.closeEachFieldItem(data.index, 'expectedauditsignoffdate');
    this.closeEachFieldItem(data.index, 'periodenddate');
    this.closeEachFieldItem(data.index, 'periodstartdate');
  }

  saveMateriality(event: any, data: any): void {
    let error = {
      status: false,
      message: ""
    }
    if ((parseFloat(event.target.value) <= this.amPmMax) || event.target.value === "") {
      error.status = false;
      error.message = '';
      this.editFundErrorStatus.error = false;
      this.fundNameValidation.emit(error);
      this.saveFundData(data, event, 'mat', 'materialitytrue');
    } else {
      error.status = true;
      error.message = this.amPmMaxErrorMessage;
      this.editFundErrorStatus.error = true;
      this.fundNameValidation.emit(error);
    }
  }

  savePM(event: any, data: any): void {
    let error = {
      status: false,
      message: ""
    }
    if ((parseFloat(event.target.value) <= this.amPmMax) || event.target.value === "") {
      error.status = false;
      error.message = '';
      this.editFundErrorStatus.error = false;
      this.fundNameValidation.emit(error);
      this.saveFundData(data, event, 'pm', 'pmtrue');
    } else {
      error.status = true;
      error.message = this.amPmMaxErrorMessage;
      this.editFundErrorStatus.error = true;
      this.fundNameValidation.emit(error);
    }
  }

  saveAMPT(event: any, data: any): void {
    let error = {
      status: false,
      message: ""
    }
    if ((parseFloat(event.target.value) <= this.amPmMax) || event.target.value === "") {
      error.status = false;
      error.message = '';
      this.editFundErrorStatus.error = false;
      this.fundNameValidation.emit(error);
      this.saveFundData(data, event, 'ampt', 'ampttrue');
    } else {
      error.status = true;
      error.message = this.amPmMaxErrorMessage;
      this.editFundErrorStatus.error = true;
      this.fundNameValidation.emit(error);
    }
  }
  onPeriodStartDateClick(data: any, i: number) {
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    let formatPedate: any = formatDate(data.periodEndDate, 'yyyy-MM-dd', 'en_US');
    let formatCurrentDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
    if (formatPedate > formatCurrentDate) {
      this.periodBeginMax[data.index] = this.periodMaxDate;
    } else {
      this.periodBeginMax[data.index] = this.getPreviousDay(data.periodEndDate);
    }
    this.setPeriodMinDates[data.index] = this.getNextDay(data.periodStartDate);
    this.clearErrorStatusAndMsg();
    this.showPeriodStartDate = [];
    if(data.fundStatusName !== 'Closed out') {
      this.showPeriodStartDate[i] = !this.showPeriodStartDate[i];
      this.edittingFieldDetails = { field: 'periodstartdate', index: i };
    }
  }
  onPeriodEndDateClick(data: any, i: number) {
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.clearErrorStatusAndMsg();
    this.auditMaxDate[i] = this.getPreviousDay(data.expectedAuditSignOffDate);
    this.setPeriodMinDates[data.index] = this.getNextDay(data.periodStartDate);
    this.showPeriodEndDate = [];
    if(data.fundStatusName !== 'Closed out') {
      this.showPeriodEndDate[i] = !this.showPeriodEndDate[i];
      this.edittingFieldDetails = { field: 'periodenddate', index: i };
    }
  }
  onAuditSignOffDateClick(data: any, i: number) {
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    let formatPedate: any = formatDate(data.periodEndDate, 'yyyy-MM-dd', 'en_US');
    let formatCurrentDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
    let requiredDate = formatCurrentDate > formatPedate ? formatCurrentDate : formatPedate;
    this.auditMinDate[data.index] = (formatPedate === formatCurrentDate) ? this.getNextDay(new Date()) : requiredDate;
    this.auditMaxDate[i] = this.getNextDay(data.expectedAuditSignOffDate);
    this.clearErrorStatusAndMsg();
    if (!this.editFundErrorStatus.error) {
      this.clearErrorStatusAndMsg();
      this.closeEachFieldItem(data.index, "periodstartdate");
    }
    this.showAuditSignOff = [];
    if(data.fundStatusName !== 'Closed out') {
      this.showAuditSignOff[i] = !this.showAuditSignOff[i];
      this.edittingFieldDetails = { field: 'expectedauditsignoffdate', index: i };
    }
  }
  onMaterialityClick(data: any, i: number) {
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.clearErrorStatusAndMsg();
    this.showMateriality = [];
    if(data.fundStatusName !== 'Closed out') {
      this.showMateriality[i] = true;
      this.edittingFieldDetails = { field: 'mat', index: i };
    }
  }
  onPMClick(data: any, i: number) {
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.clearErrorStatusAndMsg();
    this.showPm = [];
    if(data.fundStatusName !== 'Closed out') {

      this.showPm[i] = true;
      this.edittingFieldDetails = { field: 'pm', index: i };
    }
  }
  onAmptClick(data: any, i: number) {
    this.clearErrorStatusAndMsg();
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.showAmpt = [];
    if(data.fundStatusName !== 'Closed out') {
      this.showAmpt[i] = true;
      this.edittingFieldDetails = { field: 'ampt', index: i };
    }
  }
  onBrokoDopdownClose(i: number) {
    this.showMultiSelect[i] = false;
  }
  onInvstDropdownClose(i: number) {
    this.showInvestMultiSelect[i] = false;
    this.investmentTypeTooltip.close();
  }
  onfundADminSelectClose(i: number) {
    this.showFundAdminSelect[i] = false;
    this.fundAdminTooltip.close();
    const toolElement = document.getElementsByClassName('e-tooltip-wrap e-popup-open');
    toolElement[0]?.classList.remove('e-popup-open');
  }
  allowOnlyNumberandDecimalvalue(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      return true;
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onMaterialityKeyDown(event: any, i: number) {
    const allow: boolean = this.allowOnlyNumberandDecimalvalue(event);
    return allow;
  }
  onPmKeyDown(event: any, i: number) {
    const allow: boolean = this.allowOnlyNumberandDecimalvalue(event);
    return allow;
  }
  onAmptKeyDown(event: any, i: number) {
    const allow: boolean = this.allowOnlyNumberandDecimalvalue(event);
    return allow;
  }
  onFundTypeOpen(i: number, selectedId: string) {
    this.fundTypeTooltip = new Tooltip({
      content: '',
      target: '#fundType_popup .e-list-item',
      beforeRender: this.beforeRender,
      cssClass: selectedId
    })
    this.fundTypeTooltip.appendTo('body');
  }
  onInvSelectOpen(i: number, selectedId: string) {
    // this.tooltipControl.close();
    this.investmentTypeTooltip = new Tooltip({
      content: '',
      target: '#investmentTypeList_popup .e-list-item',
      beforeRender: this.beforeRender,
      cssClass: selectedId
    })
    this.investmentTypeTooltip.appendTo('body');

  }

  onFundAdminOpen(i: number, selectedId: string) {
    this.fundAdminTooltip = new Tooltip({
      content: '',
      target: '#fundAdminList_popup .e-list-item',
      beforeRender: this.beforeRender,
      cssClass: selectedId
    })
    this.fundAdminTooltip.appendTo('body');
  }
  onBrokerCustodianOpen(i: number, selectedId: string) {
    this.brokerCustodianTooltip = new Tooltip({
      content: '',
      target: '#brokerCustoSelect_popup .e-list-item',
      beforeRender: this.beforeRender,
      cssClass: selectedId
    })
    this.brokerCustodianTooltip.appendTo('body');
  }
  getFormattedDate(receiveDate: Date | string): string {
    let date = receiveDate;
    if (typeof date === 'string') {
      date = new Date(receiveDate);
    }
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // function to hide the scrollbar in syncfusion if there is no overflow.
  dataBound(): void {
    this.grid.hideScroll();
    
    // Apply highlighting to newly added fund after grid is fully rendered
    const checkIsFromAddFund = sessionStorage.getItem('fromAddFund');
    const addedFundId = sessionStorage.getItem('addedFundId');
    
    if (checkIsFromAddFund && JSON.parse(checkIsFromAddFund) === true && addedFundId) {
      setTimeout(() => {
        const allRows = this.grid.element.querySelectorAll('.e-row, .e-altrow');
        const gridData = this.grid.getCurrentViewRecords();
        
        gridData.forEach((record: any, index: number) => {
          if (record.fundId && record.fundId.toString() === addedFundId) {
            if (allRows[index]) {
              const row = allRows[index] as HTMLElement;
              row.classList.add('newly-added-fund');
              // Highlighting will be cleared by user actions or navigation
            }
          }
        });
      }, 100);
    }
  }
  getPreviousDay(data: any) {
    let tomorrow: any;
    const today = new Date(data);
    let currentDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    tomorrow = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
    return tomorrow;
  }
  beforeRender(args: any): void {
    let target: any = this;
    let listElement: any = document.getElementById(target.properties.cssClass);
    let result: any = listElement.ej2_instances[0].dataSource;
    let i: number;
    for (i = 0; i < result.length; i++) {
      if (result[i].value === args.target.textContent) {
        this.content = result[i].value;
        if (args.target.offsetWidth >= args.target.scrollWidth) {
          args.cancel = true;
        }
        break;
      }
    }
  }
  blockPaste(e: any) {
    const restrictSpecialCharacters = /^[1-9]\d*(\.\d+)?$/g;
    const pasteData = e.clipboardData?.getData('text/plain') as string;
    if (!restrictSpecialCharacters.test(pasteData)) {
      e.preventDefault()
    }
  }
  public openEditEngagement(data: any) {
    if(data.userHasAccessToEngagement) {
      this.router.navigateByUrl('fundscoping/edit-engagement/'+data.engagementId);
      this.accessIssue.next(false);
    } else {
      this.isMenuOpen = false;
      this.accessIssue.next(true);
    }
  }

  public openCloseOut(data: any) {
    if(data.userHasAccessToEngagement) {
      const engagementData = this.engagementData(data);
      this.store.dispatch(new EngDetailsUpdateAction({ data: engagementData }));
      this.store.select(getEngDetailEntities).subscribe((result: any) => {
        L10n.load({
          'en-US': {
            grid: {
              EmptyRecord: result.engagementType == Constants.Entity ? changeLabelValue(emptyRecordMessage.closeOutFund) :emptyRecordMessage.closeOutFund
            }
          }
        });
      });
      this.router.navigateByUrl('fundscoping/close-out-fund');
      this.accessIssue.next(false);
    } else {
      this.isMenuOpen = false;
      this.accessIssue.next(true);
    }
  }

  public openRollForwardEngagement(data: any) {
    if(data.userHasAccessToEngagement) {
      if(data.engagementStatus === 'Closed Out' || data.engagementStatus === 'Roll-Forward Complete') {
        this.router.navigateByUrl('fundscoping/roll-forward-engagement/'+data.engagementId);
        this.accessIssue.next(false);
      } else {
        this.isMenuOpen = false;
        this.closeOutIssue.next(true);
      }
    } else {
      this.isMenuOpen = false;
      this.accessIssue.next(true);
    }
  }

  saveAuditSignOff(event: any, data: any): void {
    if (data.fundGroupName) { 
      this.selectedFunNameList = this.data
          .filter(engagementFundData => engagementFundData.fundGroupName === data.fundGroupName)
          .map(engagementFundData => engagementFundData.fundName);
           let dataVal;
          this.store.select(getEngDetailEntities).subscribe((result: any) => {
      dataVal=result; 
    });
      const engagementData = this.engagementData(dataVal);
      this.store.dispatch(new EngDetailsUpdateAction({ data: engagementData }));
      this.store.select(getEngDetailEntities).subscribe((result: any) => {
      const messageValue = `You are changing the Expected Audit Sign-Off Date for a fund that is part of a group. Are you sure you want to proceed? This change will update the sign-off date for all the following funds in the group:`;
      this.popupModalMessage = result.engagementType == Constants.Entity ? changeLabelValue(messageValue) :messageValue;
      this.popupModalTitle = result.engagementType == Constants.Entity ? changeLabelValue(this.popupModalTitle) :this.popupModalTitle;
      });
      this.showPopup = true;
      this.cdr.detectChanges();
      this.CustomConfirmationDialogComponent?.triggerOpen();
      this.eventAuditSignOff = event.target?.value;
      this.engagementFundData = data;
    } else {
      this.auditSignOffEditting[data.index] = true;
      let error = {
        status: false,
        message: ""
      };
      this.auditMaxDate[data.index] = this.getNextDay(event.target?.value);
      let formatPedate: any = this._datePipe.transform(data.periodEndDate, 'yyyy-MM-dd');
      let formatPeriiodStartDate: any = this._datePipe.transform(data.periodStartDate, 'yyyy-MM-dd');
      let currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      const selectedDate = new Date(event.target.value).toDateString();
      const prevDate = data.expectedAuditSignOffDate.toDateString();
      if (event.target?.value?.length === 10 && (selectedDate !== prevDate || this.editFundErrorStatus.error)) {
        if ((event.target?.value <= formatPeriiodStartDate) || (event.target?.value <= formatPedate) || (event.target?.value < currentDate)) {
          error.status = true;
          error.message = "The Expected Audit Sign-Off Date cannot be before the Period Begin Date, Period End Date or today's date. Please enter a valid date.";
          this.editFundErrorStatus.error = true;
          let element: HTMLInputElement = document.getElementById('fsAudiSignInput') as HTMLInputElement;
          let previousValue: any = this._datePipe.transform(data.expectedAuditSignOffDate, 'yyyy-MM-dd');
          element.value = previousValue;
          this.fundNameValidation.emit(error);
          this.selectedFieldName = 'expectedauditsignoffdate';
          this.selectedIndexValue = data.index;
          this.openEachFieldItem(data.index, 'expectedauditsignoffdate');
        } else {
          this.editFundErrorStatus.error = false;
          error.status = true;
          error.message = "";
          if (event.target?.value !== this._datePipe.transform(data.expectedAuditSignOffDate, 'yyyy-MM-dd')) {
            this.saveFundData(data, event, 'expectedauditsignoffdate', 'expecteddatetrue');
          }
        }
      } else if (event.target?.value?.length === 0) {
        let element: HTMLInputElement = document.getElementById('fsAudiSignInput') as HTMLInputElement;
        let previousValue: any = this._datePipe.transform(data.expectedAuditSignOffDate, 'yyyy-MM-dd');
        element.value = previousValue;
        this.tirggerMandatoryError(data, 'expectedauditsignoffdate');
      }
    }
  }

  isUserConfired(event: any) {
    this.triggerCloseBtn();
    this.calledSaveAuditSignOffDate(this.eventAuditSignOff, this.engagementFundData);
  }

  triggerCloseBtn() {
    this.showPopup = false;
    this.CustomConfirmationDialogComponent?.triggerClose();
  }

   calledSaveAuditSignOffDate(auditSignOffDateValue: any, data: any) {
    const fundGroupDetailData = this.data.filter((engagementFundData) => engagementFundData.fundGroupName === data.fundGroupName); 
    const fundGroupFundId = fundGroupDetailData.map((engagementFundGroup) => engagementFundGroup.fundId); 
    const fundGroupAnalysisId = fundGroupDetailData.map((engagementFundGroup) => engagementFundGroup.analysisId);
    this.auditSignOffEditting[data.index] = true;
    let error = {
      status: false,
      message: ""
    }
    this.auditMaxDate[data.index] = this.getNextDay(auditSignOffDateValue);
    const isAuditSignOffDateValid = fundGroupDetailData.find((fundGroupFundData) => {
      let formatPedate: any = this._datePipe.transform(fundGroupFundData.periodEndDate, 'yyyy-MM-dd');
      let formatPeriiodStartDate: any = this._datePipe.transform(fundGroupFundData.periodStartDate, 'yyyy-MM-dd');
      let currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      const selectedDate = new Date(auditSignOffDateValue).toDateString();
      const prevDate = fundGroupFundData.expectedAuditSignOffDate
      if (auditSignOffDateValue?.length === 10 && (selectedDate !== prevDate || this.editFundErrorStatus.error)) {
        if ((auditSignOffDateValue <= formatPeriiodStartDate) || (auditSignOffDateValue <= formatPedate) || (auditSignOffDateValue < currentDate)) {
          return true;
        }
      }
      return false
    })
    if (isAuditSignOffDateValid) {
      error.status = true;
      error.message = "Sign-Off Date not updated. The new Sign-Off Date is less than today’s date or less than Period End Dates for one or more funds."
      this.editFundErrorStatus.error = true;
      this.fundNameValidation.emit(error);
      this.selectedFieldName = 'expectedauditsignoffdate';
      this.selectedIndexValue = data.index;
      this.openEachFieldItem(data.index, 'expectedauditsignoffdate');
    } else if (auditSignOffDateValue?.length === 0) {
        this.tirggerMandatoryError(data, 'expectedauditsignoffdate');
    } else {
      this.editFundErrorStatus.error = false;
      error.status = true;
      error.message = "";
      if (auditSignOffDateValue !== this._datePipe.transform(data.expectedAuditSignOffDate, 'yyyy-MM-dd')) {
        const payload = {
          fundIds: fundGroupFundId,
          analysisIds: fundGroupAnalysisId,
          expectedAuditSignOffDate: new Date(auditSignOffDateValue),
          engagementFundGroupId: data.engagementAndFundGroupMappingId,
          engagementId: data.engagementId
       }
        this.fundScopingDetailsService.updateAuditSignOffDateForEngagementFundGroup(payload).subscribe(
          (resp: any) => { 
            if(resp.succeeded) {
                let msg=""; 
                let dataValue;
                this.store.select(getEngDetailEntities).subscribe((result: any) => {
                   dataValue=result; 
                });
                const engagementData = this.engagementData(dataValue);
                this.store.dispatch(new EngDetailsUpdateAction({ data: engagementData }));
                this.store.select(getEngDetailEntities).subscribe((result: any) => {
                const messageValue = `Fund has been updated successfully: `;
                    msg = result.engagementType == Constants.Entity ? changeLabelValue(messageValue) :messageValue;
                });

              let dataVal = {
                isSucceeded: true,
                successMessage: `${msg} ${this.selectedFunNameList.join(', ')}.`
             }
              this.fundScopingDetailsService.setSuccessMessage(dataVal);
              
              this.getEngagementFundFroupList(this.engagementDetailsObj.engagementId)
              this.grid.refresh();
              this.reloadGrid.emit();
            }
          }
        );
      }
    } 
   }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.error = '';
  }

  selectOption(option: any, engagementFundData: any, i: number, isShowMessage: boolean = true): void { 
    const payload = { 	  
      fundId: engagementFundData.fundId,
      engagementAndFundGroupMappingId: option.engagementAndFundGroupMappingId,
      fundGroupName: option.fundGroupName,
      fundGroupActionType: !engagementFundData.fundGroupName ? "Assign" : "Update",
      engagementId: engagementFundData.engagementId,
      analysisId: engagementFundData.analysisId,
      oldEngagementAndFundGroupMappingId: !engagementFundData.fundGroupName ? 0 : engagementFundData.engagementAndFundGroupMappingId,
    }
    let error = {
      status: false,
      message: ""
    }
    this.engagementFundGroupCount = this.data.filter(fundData => fundData.engagementAndFundGroupMappingId === option.engagementAndFundGroupMappingId).length;
    if (this.engagementFundGroupCount <= EnvService.maxFundsAllocationInFundGroupLimit) {
      if (!engagementFundData.fundGroupName) {
        this.fundScopingDetailsService.saveEngFundGroupAndFundMapping(payload).subscribe(
          (resp: any) => {
            if (resp.succeeded) {
              this.dropdownOpen = false;
              this.showFundGroupSelect[i] = !this.showFundGroupSelect[i];
              let data = {
                isSucceeded: true,
                successMessage: resp.successMessage == `The group '${option.fundGroupName}' has been assigned successfully` ? `${engagementFundData.fundName} has been added to the group ${option.fundGroupName}.` : resp.successMessage
              }
              if (isShowMessage) {
                this.fundScopingDetailsService.setSuccessMessage(data);
              }
              this.selectedFundGroup = option;
              engagementFundData.fundGroupName = option.fundGroupName;
              this.getEngagementFundFroupList(this.engagementDetailsObj.engagementId)
              this.grid.refresh();
              this.reloadGrid.emit();
            } else {
              this.dropdownOpen = false;
              this.showFundGroupSelect[i] = !this.showFundGroupSelect[i];
              error.status = true; 
              error.message = this.enagementType === Constants.Entity ? changeLabelValue(resp.errorMessage) :  resp.errorMessage
              this.editFundErrorStatus.error = true;
              this.fundNameValidation.emit(error);
            }
        });
      } else {
        this.fundScopingDetailsService.updateEngagementFundGroupAndFundMapping(payload).subscribe(
          (resp: any) => {
            if (resp.succeeded) {
              this.dropdownOpen = false;
              this.showFundGroupSelect[i] = !this.showFundGroupSelect[i];
              let data = {
                isSucceeded: true,
                successMessage: resp.successMessage == `The group '${option.fundGroupName}' has been updated successfully.` ? `${engagementFundData.fundName} has been added to the group ${option.fundGroupName}.` : resp.successMessage
              }
              if (isShowMessage) {
                this.fundScopingDetailsService.setSuccessMessage(data);
              }
              if (resp?.data?.isDeleted) {
                let data = {
                  isSucceeded: true,
                  successMessage: `The group ${engagementFundData.fundGroupName} was not mapped to any fund and has been deleted.`
                }
                this.fundScopingDetailsService.setDeleteFundGroupMessage(data);
              }
              this.selectedFundGroup = option;
              engagementFundData.fundGroupName = option.fundGroupName;
              this.getEngagementFundFroupList(this.engagementDetailsObj.engagementId)
              this.grid.refresh();
              this.reloadGrid.emit();
            } else {
              this.dropdownOpen = false;
              this.showFundGroupSelect[i] = !this.showFundGroupSelect[i];
              error.status = true;
              error.message = resp.errorMessage
              this.editFundErrorStatus.error = true;
              this.fundNameValidation.emit(error);
            }
        });
      }
    } else {
      this.dropdownOpen = false;
      this.showFundGroupSelect[i] = !this.showFundGroupSelect[i];
      error.status = true;
      error.message = this.enagementType === Constants.Entity ? changeLabelValue(`Only ${EnvService.maxFundsAllocationInFundGroupLimit} funds can be grouped together.`) : `Only ${EnvService.maxFundsAllocationInFundGroupLimit} funds can be grouped together.`
      this.editFundErrorStatus.error = true;
      this.fundNameValidation.emit(error);
    }
  }

  addOption(engagementFundData: any, i: number): void {
    if (!this.newOption.trim()) {
      this.error = 'Required';
    } else if (!this.allowSpecialChars && /[^a-zA-Z0-9 ]/.test(this.newOption)) {
      this.error = 'Special characters not allowed';
      this.newOption = '';
    }  else if (this.engagementFundGroups.filter((fundGroup) => fundGroup['fundGroupName'].toLowerCase() === this.newOption.trim().toLowerCase()).length) {
      this.error = 'Duplicate Group name already created';
      this.newOption = '';
    } else if (this.newOption.trim().toLowerCase() === 'ungrouped'.toLowerCase()) {
      this.error = `Please pick a different name – 'Ungrouped' is reserved`;
      this.newOption = '';
    } else {
      const payload = { 	  
        fundId: engagementFundData.fundId,
        engagementAndFundGroupMappingId: 0,
        fundGroupName: this.newOption.trim(),
        fundGroupActionType:"New",
        engagementId: engagementFundData.engagementId,
        analysisId: engagementFundData.analysisId,
        oldEngagementAndFundGroupMappingId: 0,
      }
      this.fundScopingDetailsService.saveEngFundGroup(payload).subscribe(
        (resp: any) => {
          if (resp?.succeeded) {
            const newItem = {engagementAndFundGroupMappingId: resp.data.engagementAndFundGroupMappingId, fundGroupName: resp.data.fundGroupName};
            this.selectOption(newItem, engagementFundData, i, false);
            let data = {
              isSucceeded: true,
              successMessage: `The group ${newItem.fundGroupName} has been created and ${engagementFundData.fundName} has been added to it.`
            }
            this.fundScopingDetailsService.setSuccessMessage(data);
            this.newOption = '';
            this.error = '';
            this.dropdownOpen = false;
            
            this.getEngagementFundFroupList(this.engagementDetailsObj.engagementId)
            this.grid.refresh();
            this.reloadGrid.emit();
          } else {
            let error = {
              status: false,
              message: ""
            }
            error.status = true;
            error.message = resp.errorMessage
            this.editFundErrorStatus.error = true;
            this.fundNameValidation.emit(error);
          }
        });
    }
  }

  onInputChange() {
  }

  onKeyPress(event: KeyboardEvent): void {
    if (!this.allowSpecialChars) {
      const regex = /^[a-zA-Z0-9 ]$/;
      if (!regex.test(event.key)) {
        event.preventDefault();
      }
    }
  }

  removeFundGroup(event: Event, engagementFundData: any, i: number, isFundTypeUpdated: boolean = true) {
  const payload = { 	  
    fundId: engagementFundData.fundId,
    engagementAndFundGroupMappingId: engagementFundData.engagementAndFundGroupMappingId,
    fundGroupName: engagementFundData.fundGroupName,
    fundGroupActionType: "Remove",
    engagementId: engagementFundData.engagementId,
    analysisId: engagementFundData.analysisId,
    oldEngagementAndFundGroupMappingId: engagementFundData.engagementAndFundGroupMappingId,
  }
  this.fundScopingDetailsService.deleteEngagementFundGroupAndFundMapping(payload).subscribe(
    (resp: any) => {
      if (resp?.succeeded) {
        if(isFundTypeUpdated) {
          this.showFundGroupSelect[i] = !this.showFundGroupSelect[i];
        }
        let data = {
          isSucceeded: true,
          successMessage: `${engagementFundData.fundName} has been removed from the group ${engagementFundData.fundGroupName}.`
        }
        this.fundScopingDetailsService.setSuccessMessage(data);
        // if(engagementFundData.fundStatusName != 'Not Started')
        // {
        //   let data = {
        //     isSucceeded: true,
        //     successMessage: resp.successMessage
        //   }
        //   this.fundScopingDetailsService.setFundGroupSuccessMessage(data);
        // }
        this.dropdownOpen = false;
        if (resp?.data?.isDeleted) {
          let data = {
            isSucceeded: true,
            successMessage: `The group ${engagementFundData.fundGroupName} was not mapped to any fund and has been deleted.`
          }
          this.fundScopingDetailsService.setDeleteFundGroupMessage(data);
        }        
        this.getEngagementFundFroupList(this.engagementDetailsObj.engagementId)
        this.grid.refresh();
        this.reloadGrid.emit();
        this.selectedFundGroup = ''
        engagementFundData.fundGroupName = '';
      } else {
        let error = {
          status: false,
          message: ""
        }
        error.status = true;
        error.message = resp.errorMessage
        this.editFundErrorStatus.error = true;
        this.fundNameValidation.emit(error);
      }
    });
    event.stopPropagation();
  }

  onFundGroupClick(event: MouseEvent, data: any, i: number) {
    this.clearErrorStatusAndMsg();
    this.clearSuccessStatusAndMsg();
    this.closeEachFieldItem(this.edittingFieldDetails.index, this.edittingFieldDetails.field);
    this.showFundGroupSelect = []
    const rowFundGroup = data.fundGroupName;
    let selectedIndex;
    this.engagementFundGroups.forEach((element: any) => {
      if (element.value === rowFundGroup) {
        selectedIndex = element.id;
      }
    })
    this.selectedFundGroup = selectedIndex;
    this.showFundGroupSelect[i] = !this.showFundGroupSelect[i];
    this.edittingFieldDetails = { field: 'fundGroup', index: i };
    event.stopPropagation();
  }
  sanitizeHeader(header: string): string {
    return header.trim();
}
}