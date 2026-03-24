import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fund } from '../models/fund.model';
import { FundService } from '../fund';

@Component({
  selector: 'app-delete-fund-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-fund-modal.html',
  styleUrls: ['./delete-fund-modal.scss'],
})
export class DeleteFundModalComponent {
  @Input() selectedFunds: Fund[] = [];
  @Input() engagementId = 'eng-001';
  @Output() deleted = new EventEmitter<string[]>();
  @Output() cancelled = new EventEmitter<void>();

  private fundService = inject(FundService);
  isLoading = signal(false);
  errorMessage = signal('');

  get blockedFunds(): Fund[] {
    return this.selectedFunds.filter(f => f.dataImportComplete);
  }

  get deletableFunds(): Fund[] {
    return this.selectedFunds.filter(f => !f.dataImportComplete);
  }

  onConfirm() {
    if (this.blockedFunds.length > 0) return;
    this.isLoading.set(true);
    this.errorMessage.set('');
    const ids = this.selectedFunds.map(f => f.id);
    this.fundService.deleteFunds({ fundIds: ids, engagementId: this.engagementId }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.deleted.emit(ids);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Failed to delete funds.');
      },
    });
  }
}
