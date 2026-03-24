export interface Fund {
  id: string;
  engagementId: string;
  name: string;
  type: string;
  investmentTypes: string[];
  administrator: string;
  brokerCustodian: string;
  reportingCurrency: string;
  periodBegin: string;
  periodEnd: string;
  auditSignoff: string;
  materiality: number | null;
  performanceMateriality: number | null;
  misstatementThreshold: number | null;
  status: FundStatus;
  dataImportComplete: boolean;
  group?: string;
}

export type FundStatus =
  | 'Active'
  | 'Routine Selection'
  | 'Data Import Complete'
  | 'Analysis Complete';

export interface FundFormData {
  name: string;
  type: string;
  investmentTypes: string[];
  administrator: string;
  brokerCustodian: string;
  reportingCurrency: string;
  periodBegin: string;
  periodEnd: string;
  auditSignoff: string;
  materiality: number | null;
  performanceMateriality: number | null;
  misstatementThreshold: number | null;
}

export interface ControlTableValues {
  fundTypes: string[];
  investmentTypes: string[];
  administrators: string[];
  brokerCustodians: string[];
  reportingCurrencies: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: string[] | null;
  timestamp: string;
}

export interface DeleteFundRequest {
  fundIds: string[];
  engagementId: string;
}
