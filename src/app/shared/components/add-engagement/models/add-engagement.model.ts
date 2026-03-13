export interface AddEngagementModel {
  engagementName: string;
  periodEndDate: string;
  regionDisplayName?: string;
  engagementTypeId: number;
  businessUnit?: string;
  adGroup?: string;
  description?: string;
}

export interface AddEngagementResponse {
  success: boolean;
  engagementId?: number;
  message: string;
}
