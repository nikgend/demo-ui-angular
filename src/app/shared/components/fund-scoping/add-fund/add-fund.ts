import { Component, OnInit, Output, EventEmitter, Input, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FundService } from '../fund';
import { FundFormData, ControlTableValues, Fund } from '../models/fund.model';

function dateAfterValidator(startField: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;
    const start = control.parent.get(startField)?.value;
    if (!start || !control.value) return null;
    return new Date(control.value) > new Date(start) ? null : { dateAfter: true };
  };
}

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  return new Date(control.value) >= today ? null : { futureDate: true };
}

@Component({
  selector: 'app-add-fund',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-fund.html',
  styleUrls: ['./add-fund.scss'],
})
export class AddFundComponent implements OnInit {
  @Input() editFund: Fund | null = null;
  @Input() engagementId = 'eng-001';
  @Output() saved = new EventEmitter<Fund>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private fundService = inject(FundService);

  form!: FormGroup;
  controlValues!: ControlTableValues;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  get isEdit() { return !!this.editFund; }

  get lockedFields(): string[] {
    if (!this.editFund) return [];
    return ['Routine Selection','Data Import Complete','Analysis Complete'].includes(this.editFund.status)
      ? ['type','investmentTypes','administrator'] : [];
  }

  isLocked(field: string) { return this.lockedFields.includes(field); }

  ngOnInit() {
    this.controlValues = this.fundService.controlTableValues;
    this.buildForm();
    if (this.editFund) this.patchForm();
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/.*[a-zA-Z].*/)]], 
      type: ['', Validators.required],
      investmentTypes: [[], Validators.required],
      administrator: ['', Validators.required],
      brokerCustodian: ['', Validators.required],
      reportingCurrency: ['', Validators.required],
      periodBegin: ['', Validators.required],
      periodEnd: ['', [Validators.required, dateAfterValidator('periodBegin')]],
      auditSignoff: ['', [Validators.required, futureDateValidator]],
      materiality: [null, [Validators.min(0)]],
      performanceMateriality: [null, [Validators.min(0)]],
      misstatementThreshold: [null, [Validators.min(0)]],
    });
    this.form.get('periodBegin')?.valueChanges.subscribe(() => {
      this.form.get('periodEnd')?.updateValueAndValidity();
    });
  }

  patchForm() {
    if (!this.editFund) return;
    this.form.patchValue({ ...this.editFund });
    this.lockedFields.forEach(f => this.form.get(f)?.disable());
  }

  toggleInvestmentType(type: string) {
    if (this.isLocked('investmentTypes')) return;
    const current: string[] = this.form.get('investmentTypes')?.value || [];
    const updated = current.includes(type) ? current.filter((t: string) => t !== type) : [...current, type];
    this.form.get('investmentTypes')?.setValue(updated);
    this.form.get('investmentTypes')?.markAsTouched();
  }

  isInvestmentSelected(type: string): boolean {
    return (this.form.get('investmentTypes')?.value || []).includes(type);
  }

  getFieldError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl || !ctrl.invalid || !ctrl.touched) return '';
    const e = ctrl.errors!;
    if (e['required']) return 'This field is required.';
    if (e['minlength']) return `Minimum ${e['minlength'].requiredLength} characters required.`;
    if (e['maxlength']) return `Maximum ${e['maxlength'].requiredLength} characters allowed.`;
    if (e['pattern']) return 'Input must include at least one alphabetic character.';
    if (e['dateAfter']) return 'Period End Date must be after Period Begin Date.';
    if (e['futureDate']) return "The Expected Audit Sign-Off Date cannot be before today's date.";
    if (e['min']) return 'Value cannot be negative.';
    return 'Invalid value.';
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage.set('Mandatory fields. Please enter valid details and proceed.');
      return;
    }
    this.errorMessage.set('');
    this.isLoading.set(true);
    const val: FundFormData = { ...this.form.getRawValue() };
    const obs = this.isEdit
      ? this.fundService.updateFund(this.editFund!.id, val)
      : this.fundService.addFund(this.engagementId, val);

    obs.subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.successMessage.set(res.message);
        setTimeout(() => this.saved.emit(res.data), 1200);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'An error occurred. Please try again.');
      },
    });
  }
}
