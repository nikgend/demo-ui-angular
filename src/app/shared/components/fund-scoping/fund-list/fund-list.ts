import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FundService } from '../fund';
import { Fund } from '../models/fund.model';
import { AddFundComponent } from '../add-fund/add-fund';
import { DeleteFundModalComponent } from '../delete-fund-modal/delete-fund-modal';

type SortField = 'name' | 'type' | 'administrator' | 'status' | 'reportingCurrency';
type SortDir = 'asc' | 'desc';
type ViewMode = 'list' | 'add' | 'edit';

@Component({
  selector: 'app-fund-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddFundComponent, DeleteFundModalComponent],
  templateUrl: './fund-list.html',
  styleUrls: ['./fund-list.scss'],
})
export class FundListComponent implements OnInit {
  private fundService = inject(FundService);

  engagementId = 'eng-001';
  engagementName = 'KPMG Audit Engagement FY2024';

  viewMode = signal<ViewMode>('list');
  editingFund = signal<Fund | null>(null);
  showDeleteModal = signal(false);
  selectedIds = signal<Set<string>>(new Set());
  searchQuery = signal('');
  sortField = signal<SortField>('name');
  sortDir = signal<SortDir>('asc');
  filterStatus = signal('');
  filterType = signal('');
  successBanner = signal('');
  errorBanner = signal('');
  isLoading = signal(false);
  editingInlineId = signal<string | null>(null);
  inlineEditValues = signal<Partial<Fund>>({});

  private allFunds = this.fundService.getFundsSignal();

  filteredFunds = computed(() => {
    let list = this.allFunds().filter(f => f.engagementId === this.engagementId);
    const q = this.searchQuery().toLowerCase();
    if (q) list = list.filter(f => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || f.administrator.toLowerCase().includes(q));
    if (this.filterStatus()) list = list.filter(f => f.status === this.filterStatus());
    if (this.filterType()) list = list.filter(f => f.type === this.filterType());
    const field = this.sortField();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => (a[field] > b[field] ? dir : -dir));
  });

  uniqueStatuses = computed(() => [...new Set(this.allFunds().map(f => f.status))]);
  uniqueTypes = computed(() => [...new Set(this.allFunds().map(f => f.type))]);
  uniqueGroups = computed(() => [...new Set(this.allFunds().filter(f => f.group).map(f => f.group!))]);

  allSelected = computed(() =>
    this.filteredFunds().length > 0 && this.filteredFunds().every(f => this.selectedIds().has(f.id))
  );

  selectedFundObjects = computed(() =>
    this.filteredFunds().filter(f => this.selectedIds().has(f.id))
  );

  ngOnInit() {}

  toggleSort(field: SortField) {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
  }

  toggleSelectAll() {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.filteredFunds().map(f => f.id)));
    }
  }

  toggleSelect(id: string) {
    const s = new Set(this.selectedIds());
    s.has(id) ? s.delete(id) : s.add(id);
    this.selectedIds.set(s);
  }

  isSelected(id: string) { return this.selectedIds().has(id); }

  openAdd() {
    this.viewMode.set('add');
    this.editingFund.set(null);
  }

  openEdit(fund: Fund) {
    this.editingFund.set(fund);
    this.viewMode.set('edit');
  }

  onSaved(fund: Fund) {
    const msg = this.viewMode() === 'add'
      ? `Fund has been added successfully: ${fund.name}`
      : `Fund updated successfully: ${fund.name}`;
    this.showSuccess(msg);
    this.viewMode.set('list');
    this.editingFund.set(null);
  }

  onAddCancelled() {
    this.viewMode.set('list');
    this.editingFund.set(null);
  }

  openDeleteModal() {
    if (this.selectedIds().size === 0) return;
    this.showDeleteModal.set(true);
  }

  onDeleted(ids: string[]) {
    this.showDeleteModal.set(false);
    this.selectedIds.set(new Set());
    this.showSuccess(`${ids.length} fund(s) deleted successfully.`);
  }

  onDeleteCancelled() {
    this.showDeleteModal.set(false);
  }

  startInlineEdit(fund: Fund) {
    if (['Routine Selection','Data Import Complete','Analysis Complete'].includes(fund.status)) {
      this.editingInlineId.set(fund.id);
      this.inlineEditValues.set({ name: fund.name, brokerCustodian: fund.brokerCustodian, reportingCurrency: fund.reportingCurrency, auditSignoff: fund.auditSignoff });
    } else {
      this.openEdit(fund);
    }
  }

  saveInlineEdit(fund: Fund) {
    this.isLoading.set(true);
    this.fundService.updateFund(fund.id, this.inlineEditValues()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.editingInlineId.set(null);
        this.showSuccess(`Fund updated: ${fund.name}`);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showError(err.message);
        this.editingInlineId.set(null);
      },
    });
  }

  cancelInlineEdit() {
    this.editingInlineId.set(null);
    this.inlineEditValues.set({});
  }

  showSuccess(msg: string) {
    this.successBanner.set(msg);
    this.errorBanner.set('');
    setTimeout(() => this.successBanner.set(''), 5000);
  }

  showError(msg: string) {
    this.errorBanner.set(msg);
    this.successBanner.set('');
    setTimeout(() => this.errorBanner.set(''), 6000);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Active': 'status-active',
      'Routine Selection': 'status-routine',
      'Data Import Complete': 'status-import',
      'Analysis Complete': 'status-analysis',
    };
    return map[status] || '';
  }

  getSortIcon(field: SortField): string {
    if (this.sortField() !== field) return '↕';
    return this.sortDir() === 'asc' ? '↑' : '↓';
  }

  formatCurrency(val: number | null): string {
    if (val === null || val === undefined) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }
}
