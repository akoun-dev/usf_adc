import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function FsuFormStepper({ currentStep, onStepClick }: Props) {
  const { t } = useTranslation();

  const STEPS = [
    { label: t('fsu.steps.connectivity'), description: t('fsu.steps.connectivityDesc') },
    { label: t('fsu.steps.financing'), description: t('fsu.steps.financingDesc') },
    { label: t('fsu.steps.quality'), description: t('fsu.steps.qualityDesc') },
    { label: t('fsu.steps.preview'), description: t('fsu.steps.previewDesc') },
  ];

  return (
    <nav aria-label={t('fsu.formNav')} className="mb-8">
      <ol className="flex items-center gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <li key={index} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={index > currentStep}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors w-full',
                  isCompleted && 'bg-primary/10 text-primary cursor-pointer',
                  isCurrent && 'bg-primary text-primary-foreground font-medium',
                  !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
                  index > currentStep && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-primary-foreground text-primary',
                  !isCompleted && !isCurrent && 'bg-muted-foreground/20 text-muted-foreground'
                )}>
                  {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                <div className="hidden md:block text-left">
                  <div className="font-medium text-xs">{step.label}</div>
                  <div className="text-[10px] opacity-70">{step.description}</div>
                </div>
              </button>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  'h-px flex-1 min-w-4',
                  index < currentStep ? 'bg-primary' : 'bg-border'
                )} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}