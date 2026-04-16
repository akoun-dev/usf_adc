import { supabase } from '@/integrations/supabase/client';
import type { ReportsData, SubmissionStatusCount, MonthlySubmission, CountryStats } from '../types';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  submitted: 'Soumis',
  under_review: 'En révision',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  revision_requested: 'Révision demandée',
};

export const reportsService = {
  async getReportsData(): Promise<ReportsData> {
    const { data: submissions, error } = await supabase
      .from('fsu_submissions')
      .select('id, status, country_id, created_at, submitted_at');

    if (error) throw error;
    const rows = submissions ?? [];

    // KPI counts
    const total = rows.length;
    const pending = rows.filter((s) => s.status === 'submitted' || s.status === 'under_review').length;
    const approved = rows.filter((s) => s.status === 'approved').length;
    const rejected = rows.filter((s) => s.status === 'rejected').length;
    const nonDraft = rows.filter((s) => s.status !== 'draft').length;
    const approvalRate = nonDraft > 0 ? Math.round((approved / nonDraft) * 100) : 0;

    // By status
    const statusMap = new Map<string, number>();
    for (const s of rows) {
      statusMap.set(s.status, (statusMap.get(s.status) ?? 0) + 1);
    }
    const byStatus: SubmissionStatusCount[] = Array.from(statusMap.entries()).map(([status, count]) => ({
      status: STATUS_LABELS[status] ?? status,
      count,
    }));

    // By month (last 12 months)
    const monthMap = new Map<string, number>();
    for (const s of rows) {
      const date = s.submitted_at ?? s.created_at;
      const month = date.slice(0, 7); // YYYY-MM
      monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
    }
    const byMonth: MonthlySubmission[] = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, count]) => ({ month, count }));

    // By country — need country names
    const countryIds = [...new Set(rows.map((s) => s.country_id))];
    const { data: countries } = await supabase
      .from('countries')
      .select('id, name_fr')
      .in('id', countryIds);

    const countryNameMap = new Map((countries ?? []).map((c) => [c.id, c.name_fr]));
    const countryStatsMap = new Map<string, { total: number; approved: number; rejected: number; pending: number }>();

    for (const s of rows) {
      const stats = countryStatsMap.get(s.country_id) ?? { total: 0, approved: 0, rejected: 0, pending: 0 };
      stats.total++;
      if (s.status === 'approved') stats.approved++;
      if (s.status === 'rejected') stats.rejected++;
      if (s.status === 'submitted' || s.status === 'under_review') stats.pending++;
      countryStatsMap.set(s.country_id, stats);
    }

    const byCountry: CountryStats[] = Array.from(countryStatsMap.entries()).map(([country_id, stats]) => ({
      country_id,
      country_name: countryNameMap.get(country_id) ?? 'Inconnu',
      ...stats,
      approval_rate: stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0,
    }));

    return { total, pending, approved, rejected, approvalRate, byStatus, byMonth, byCountry };
  },
};
