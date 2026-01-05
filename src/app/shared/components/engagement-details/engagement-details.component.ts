import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UpdateEngagementService } from 'src/app/features/scoping/fundscoping/update-engagement.service';
import { EngDetailsListRequestAction, EngDetailsUpdateAction } from './engagement-state/actions/eng-actions';
import { getEngDetailEntities, RootReducerState } from './engagement-state/reducers';

@Component({
  selector: 'app-engagement-details',
  templateUrl: './engagement-details.component.html',
  styleUrls: ['./engagement-details.component.scss']
})
export class EngagementDetailsComponent implements OnInit {
  engagementDetailsObj: any = {};
  Isupdated:any;
  constructor(private datePipe: DatePipe,
    private updateEngagementService:UpdateEngagementService,
    private store: Store<RootReducerState>)
  {   
    const storageValue: any = sessionStorage.getItem("engDetails");
    if (storageValue === null) {
      this.store.dispatch(new EngDetailsListRequestAction());
      this.store.select(getEngDetailEntities).subscribe((result: any) => {
        this.engagementDetailsObj = result;        
      });
    } else {
      this.store.dispatch(new EngDetailsUpdateAction({ data:JSON.parse(storageValue) }));
      this.store.select(getEngDetailEntities).subscribe((result: any) => {
        this.engagementDetailsObj = result;
      });
    }
  }

  ngOnInit(): void {
    this.updateEngagementService.addEngMsgValue$.subscribe((data: any) => {
      this.Isupdated = data;
    });
  }

  closeSuccessAlert(){
    this.Isupdated = false;
  }

}
