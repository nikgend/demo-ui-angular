import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddEngagementService } from './services/add-engagement.service';
import { AddEngagementModel } from './models/add-engagement.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import * as EngActions from '../engagement-details/engagement-state/actions/eng-actions';
import { RootReducerState } from '../engagement-details/engagement-state/reducers/index';

@Component({
  selector: 'app-add-engagement',
  templateUrl: './add-engagement.component.html',
  styleUrls: ['./add-engagement.component.scss'],
  standalone: false
})
export class AddEngagementComponent implements OnInit {
  engagementForm!: FormGroup;
  engagementTypes: any[] = [];
  regions: any[] = [];
  businessUnits: any[] = [];
  adGroups: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showSuccessAlert = false;
  showErrorAlert = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private formBuilder: FormBuilder,
    private addEngagementService: AddEngagementService,
    private store: Store<RootReducerState>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();
  }

  initializeForm(): void {
    this.engagementForm = this.formBuilder.group({
      engagementName: ['', [Validators.required, Validators.minLength(3)]],
      periodEndDate: ['', Validators.required],
      regionDisplayName: ['', Validators.required],
      engagementTypeId: ['', Validators.required],
      businessUnit: [''],
      adGroup: [''],
      description: ['']
    });
  }

  loadDropdownData(): void {
    this.isLoading = true;

    this.addEngagementService.getEngagementTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.engagementTypes = data,
        error: (err) => console.error('Error loading engagement types:', err)
      });

    this.addEngagementService.getRegions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.regions = data,
        error: (err) => console.error('Error loading regions:', err)
      });

    this.addEngagementService.getBusinessUnits()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.businessUnits = data,
        error: (err) => console.error('Error loading business units:', err)
      });

    this.addEngagementService.getAdGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.adGroups = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading ad groups:', err);
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.engagementForm.invalid) {
      this.showErrorAlert = true;
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.showSuccessAlert = false;
    this.showErrorAlert = false;

    const formData: AddEngagementModel = this.engagementForm.value;

    this.addEngagementService.submitEngagement(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = response.message || 'Engagement added successfully!';
            this.showSuccessAlert = true;

            // Dispatch action to update engagement details in store
            const engagementDetail = {
              engagementId: response.engagementId || 0,
              engagementName: formData.engagementName,
              periodEndDate: formData.periodEndDate,
              regionDisplayName: formData.regionDisplayName,
              engagementTypeId: formData.engagementTypeId
            };

            this.store.dispatch(EngActions.updateEngDetails({ data: engagementDetail }));

            // Reset form after 2 seconds
            setTimeout(() => {
              this.engagementForm.reset();
              this.showSuccessAlert = false;
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to add engagement.';
            this.showErrorAlert = true;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || 'An error occurred while adding the engagement.';
          this.showErrorAlert = true;
          console.error('Error submitting engagement:', error);
        }
      });
  }

  resetForm(): void {
    this.engagementForm.reset();
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
  }

  closeAlert(alertType: 'success' | 'error'): void {
    if (alertType === 'success') {
      this.showSuccessAlert = false;
    } else {
      this.showErrorAlert = false;
    }
  }
}
