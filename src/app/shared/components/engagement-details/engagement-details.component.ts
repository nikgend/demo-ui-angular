import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RootReducerState } from './engagement-state/reducers/index';
import { EngdetailsModel } from './engagement-state/models/engDetails';
import * as EngActions from './engagement-state/actions/eng-actions';

@Component({
  selector: 'app-engagement-details',
  templateUrl: './engagement-details.component.html',
  styleUrls: ['./engagement-details.component.scss'],
  standalone: false
})
export class EngagementDetailsComponent implements OnInit {
  engagementDetailsObj: EngdetailsModel | null = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    private store: Store<RootReducerState>
  ) {}

  ngOnInit(): void {
    // Subscribe to engagement details from store
    this.store.select(state => state.engDetails.entities)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.engagementDetailsObj = result;
      });
  }
}
