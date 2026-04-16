import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCreateSubmission, useSaveDraft } from '../hooks/useCreateSubmission';
import { useSubmitSubmission } from '../hooks/useSubmitSubmission';
import { FsuFormStepper } from '../components/FsuFormStepper';
import { ConnectivityStep } from '../components/steps/ConnectivityStep';
import { FinancingStep } from '../components/steps/FinancingStep';
import { QualityStep } from '../components/steps/QualityStep';
import { SubmissionPreview } from '../components/SubmissionPreview';
import { AttachmentUploader } from '../components/AttachmentUploader';
import { fsuFormSchema, type FsuFormValues } from '../schemas/fsuFormSchema';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { FsuFormData } from '../types';

export default function FsuNewSubmissionPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const createMutation = useCreateSubmission();
  const saveDraftMutation = useSaveDraft();
  const submitMutation = useSubmitSubmission();

  const form = useForm<FsuFormValues>({
    resolver: zodResolver(fsuFormSchema),
    defaultValues: {
      period_start: '',
      period_end: '',
      connectivity: { population_covered: 0, mobile_penetration_rate: 0, internet_penetration_rate: 0, num_operators: 0, mobile_subscribers: 0, internet_subscribers: 0 },
      financing: { annual_fsu_budget: 0, contributions_collected: 0, expenses_incurred: 0, balance: 0, num_funded_projects: 0 },
      quality: { average_latency_ms: 0, network_availability_percent: 0, geographic_coverage_percent: 0, population_coverage_percent: 0, avg_download_speed_mbps: 0 },
    },
    mode: 'onBlur',
  });

  const values = form.watch();

  const toFormData = (v: FsuFormValues): FsuFormData => ({
    period_start: v.period_start,
    period_end: v.period_end,
    connectivity: {
      population_covered: v.connectivity.population_covered ?? 0,
      mobile_penetration_rate: v.connectivity.mobile_penetration_rate ?? 0,
      internet_penetration_rate: v.connectivity.internet_penetration_rate ?? 0,
      num_operators: v.connectivity.num_operators ?? 0,
      mobile_subscribers: v.connectivity.mobile_subscribers ?? 0,
      internet_subscribers: v.connectivity.internet_subscribers ?? 0,
    },
    financing: {
      annual_fsu_budget: v.financing.annual_fsu_budget ?? 0,
      contributions_collected: v.financing.contributions_collected ?? 0,
      expenses_incurred: v.financing.expenses_incurred ?? 0,
      balance: v.financing.balance ?? 0,
      num_funded_projects: v.financing.num_funded_projects ?? 0,
    },
    quality: {
      average_latency_ms: v.quality.average_latency_ms ?? 0,
      network_availability_percent: v.quality.network_availability_percent ?? 0,
      geographic_coverage_percent: v.quality.geographic_coverage_percent ?? 0,
      population_coverage_percent: v.quality.population_coverage_percent ?? 0,
      avg_download_speed_mbps: v.quality.avg_download_speed_mbps ?? 0,
    },
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    if (step === 0) return form.trigger(['period_start', 'period_end', 'connectivity']);
    if (step === 1) return form.trigger(['financing']);
    if (step === 2) return form.trigger(['quality']);
    return true;
  };

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const handleSaveDraft = async () => {
    const countryId = profile?.country_id as string | undefined;
    if (!user || !countryId) {
      toast({ title: t('common.error'), description: t('fsu.profileError'), variant: 'destructive' });
      return;
    }

    const formData = toFormData(form.getValues());

    try {
      if (submissionId) {
        await saveDraftMutation.mutateAsync({ id: submissionId, userId: user.id, formData });
      } else {
        const result = await createMutation.mutateAsync({
          userId: user.id,
          countryId,
          formData,
        });
        setSubmissionId(result.id);
      }
      toast({ title: t('fsu.draftSaved') });
    } catch {
      toast({ title: t('common.error'), description: t('fsu.draftError'), variant: 'destructive' });
    }
  };

  const handleSubmit = async () => {
    const countryId = profile?.country_id as string | undefined;
    if (!user || !countryId) return;

    const valid = await form.trigger();
    if (!valid) {
      toast({ title: t('fsu.formIncomplete'), description: t('fsu.fillRequired'), variant: 'destructive' });
      return;
    }

    const formData = toFormData(form.getValues());

    try {
      let id = submissionId;
      if (!id) {
        const result = await createMutation.mutateAsync({
          userId: user.id,
          countryId,
          formData,
        });
        id = result.id;
        setSubmissionId(id);
      }

      await submitMutation.mutateAsync({ id, userId: user.id, formData });
      toast({ title: t('fsu.submitted'), description: t('fsu.submittedDesc') });
      navigate('/fsu/submissions');
    } catch {
      toast({ title: t('common.error'), description: t('fsu.submitError'), variant: 'destructive' });
    }
  };

  const isSubmitting = createMutation.isPending || saveDraftMutation.isPending || submitMutation.isPending;

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/fsu/submissions')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('fsu.newSubmission')}</h1>
          <p className="text-sm text-muted-foreground">{t('fsu.newSubmissionDesc')}</p>
        </div>
      </div>

      <FsuFormStepper currentStep={step} onStepClick={(s) => s <= step && setStep(s)} />

      <FormProvider {...form}>
        <Card>
          <CardContent className="pt-6">
            {step === 0 && <ConnectivityStep />}
            {step === 1 && <FinancingStep />}
            {step === 2 && <QualityStep />}
            {step === 3 && (
              <div className="space-y-6">
                <SubmissionPreview data={values as FsuFormValues} />
                {submissionId && (
                  <AttachmentUploader submissionId={submissionId} userId={user?.id ?? ''} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </FormProvider>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('fsu.previous')}
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {t('fsu.saveDraft')}
          </Button>

          {step < 3 ? (
            <Button onClick={handleNext}>
              {t('fsu.next')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {t('fsu.submit')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}