import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Fund,
  FundFormData,
  ControlTableValues,
  ApiResponse,
  DeleteFundRequest,
} from './models/fund.model';

@Injectable({ providedIn: 'root' })
export class FundService {
  private funds = signal<Fund[]>([
    {
      id: 'f001', engagementId: 'eng-001', name: 'Alpha Growth Fund',
      type: 'Hedge Fund', investmentTypes: ['Equity - Listed', 'Fixed Income'],
      administrator: 'Citco', brokerCustodian: 'Goldman Sachs',
      reportingCurrency: 'USD', periodBegin: '2024-01-01', periodEnd: '2024-12-31',
      auditSignoff: '2025-03-15', materiality: 1000000, performanceMateriality: 800000,
      misstatementThreshold: 50000, status: 'Active', dataImportComplete: false, group: 'Group A',
    },
    {
      id: 'f002', engagementId: 'eng-001', name: 'Beta Equity Fund',
      type: 'Mutual Fund', investmentTypes: ['Equity - Listed'],
      administrator: 'Apex', brokerCustodian: 'State Street',
      reportingCurrency: 'EUR', periodBegin: '2024-01-01', periodEnd: '2024-12-31',
      auditSignoff: '2025-04-01', materiality: 500000, performanceMateriality: 400000,
      misstatementThreshold: 25000, status: 'Routine Selection', dataImportComplete: false, group: 'Group A',
    },
    {
      id: 'f003', engagementId: 'eng-001', name: 'Gamma Real Estate Fund',
      type: 'Real Estate Fund', investmentTypes: ['Real Estate'],
      administrator: 'HedgeServ', brokerCustodian: 'JP Morgan',
      reportingCurrency: 'GBP', periodBegin: '2024-01-01', periodEnd: '2024-12-31',
      auditSignoff: '2025-05-01', materiality: 2000000, performanceMateriality: 1600000,
      misstatementThreshold: 100000, status: 'Data Import Complete', dataImportComplete: true, group: 'Group B',
    },
  ]);

  readonly controlTableValues: ControlTableValues = {
    fundTypes: ['CIT','Hedge Fund','Mutual Fund','Private Equity Fund','Real Estate Fund','Venture Capital Fund','Private Credit','Fund of Fund'],
    investmentTypes: ['CFDs','Equity - Listed','Equity - Unlisted','Fixed Income','Foreign Investments','Futures','FX Forwards','Options','Other','Other Debt','Other Forwards','Private Debt','Real Estate','Repos and Reverse Repos','Swaps','Swaptions','Warrants'],
    administrators: ['Apex','Bank of New York Mellon - Eagle platform','Bank of New York Mellon - InvestOne platform','BBH - Eagle platform','Citco','Citi - InvestOne platform','Goldman Sachs','HC Global','HedgeServ','JPMorgan','Northern Trust','State Street'],
    brokerCustodians: ['Bank of America','Barclays','BNP Paribas','Citibank','Deutsche Bank','Goldman Sachs','HSBC','JP Morgan','Morgan Stanley','State Street','UBS','Wells Fargo'],
    reportingCurrencies: ['AUD','CAD','CHF','EUR','GBP','HKD','JPY','SGD','USD'],
  };

  getFundsSignal() { return this.funds; }

  getFunds(engagementId: string): Observable<ApiResponse<Fund[]>> {
    return of({
      success: true,
      data: this.funds().filter(f => f.engagementId === engagementId),
      message: 'Funds retrieved successfully',
      errors: null, timestamp: new Date().toISOString(),
    }).pipe(delay(300));
  }

  addFund(engagementId: string, formData: FundFormData): Observable<ApiResponse<Fund>> {
    const existing = this.funds().filter(f => f.engagementId === engagementId);
    if (existing.find(f => f.name.toLowerCase() === formData.name.toLowerCase())) {
      return throwError(() => ({ message: 'This fund name already exists. Please enter a different fund name to proceed.' }));
    }
    const newFund: Fund = { id: 'f' + Date.now(), engagementId, ...formData, status: 'Active', dataImportComplete: false };
    this.funds.update(funds => [...funds, newFund]);
    return of({ success: true, data: newFund, message: `Fund has been added successfully: ${newFund.name}`, errors: null, timestamp: new Date().toISOString() }).pipe(delay(400));
  }

  updateFund(fundId: string, formData: Partial<FundFormData>): Observable<ApiResponse<Fund>> {
    const fund = this.funds().find(f => f.id === fundId);
    if (!fund) return throwError(() => ({ message: 'Fund not found' }));
    if (['Routine Selection','Data Import Complete','Analysis Complete'].includes(fund.status)) {
      const locked = ['type','investmentTypes','administrator'];
      if (locked.some(k => k in formData && (formData as any)[k] !== (fund as any)[k])) {
        return throwError(() => ({ message: 'This field is locked at current workflow stage.' }));
      }
    }
    const engFunds = this.funds().filter(f => f.engagementId === fund.engagementId && f.id !== fundId);
    if (formData.name && engFunds.find(f => f.name.toLowerCase() === formData.name!.toLowerCase())) {
      return throwError(() => ({ message: 'Fund Name must be unique within engagement.' }));
    }
    const updated = { ...fund, ...formData };
    this.funds.update(funds => funds.map(f => f.id === fundId ? updated : f));
    return of({ success: true, data: updated, message: 'Fund updated successfully', errors: null, timestamp: new Date().toISOString() }).pipe(delay(400));
  }

  deleteFunds(request: DeleteFundRequest): Observable<ApiResponse<{ deleted: string[] }>> {
    const blocked = request.fundIds.map(id => this.funds().find(f => f.id === id)).filter(f => f?.dataImportComplete).map(f => f!.name);
    if (blocked.length > 0) return throwError(() => ({ message: `Cannot delete fund(s) with completed Data Import: ${blocked.join(', ')}` }));
    this.funds.update(funds => funds.filter(f => !request.fundIds.includes(f.id)));
    return of({ success: true, data: { deleted: request.fundIds }, message: `${request.fundIds.length} fund(s) deleted successfully`, errors: null, timestamp: new Date().toISOString() }).pipe(delay(400));
  }

  getControlTableValues(): Observable<ControlTableValues> {
    return of(this.controlTableValues).pipe(delay(200));
  }
}
