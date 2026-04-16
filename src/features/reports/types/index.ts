export interface SubmissionStatusCount {
  status: string;
  count: number;
}

export interface MonthlySubmission {
  month: string;
  count: number;
}

export interface CountryStats {
  country_id: string;
  country_name: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  approval_rate: number;
}

export interface ReportsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  byStatus: SubmissionStatusCount[];
  byMonth: MonthlySubmission[];
  byCountry: CountryStats[];
}
