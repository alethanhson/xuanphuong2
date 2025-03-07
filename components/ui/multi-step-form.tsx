'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  description?: string;
  isComplete?: boolean;
  isActive?: boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStepIndex: number;
  goToStep?: (stepIndex: number) => void;
  className?: string;
}

export function MultiStepForm({
  steps,
  currentStepIndex,
  goToStep,
  className,
}: MultiStepFormProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.id} className="md:flex-1">
            <div
              className={cn(
                'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
                index < currentStepIndex || step.isComplete
                  ? 'border-primary'
                  : index === currentStepIndex || step.isActive
                  ? 'border-primary'
                  : 'border-muted',
                goToStep && (index < currentStepIndex || step.isComplete)
                  ? 'cursor-pointer hover:border-primary/80'
                  : ''
              )}
              onClick={() => {
                if (goToStep && (index < currentStepIndex || step.isComplete)) {
                  goToStep(index);
                }
              }}
            >
              <span className="flex items-center text-sm font-medium">
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    index < currentStepIndex || step.isComplete
                      ? 'bg-primary text-primary-foreground group-hover:bg-primary/80'
                      : index === currentStepIndex || step.isActive
                      ? 'border-2 border-primary text-primary'
                      : 'border-2 border-muted-foreground/25 bg-muted text-muted-foreground'
                  )}
                >
                  {index < currentStepIndex || step.isComplete ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                <span
                  className={cn(
                    'ml-3 text-sm font-medium',
                    index < currentStepIndex || step.isComplete
                      ? 'text-foreground'
                      : index === currentStepIndex || step.isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </span>
              {step.description && (
                <span
                  className={cn(
                    'ml-11 text-sm',
                    index < currentStepIndex || step.isComplete
                      ? 'text-muted-foreground'
                      : index === currentStepIndex || step.isActive
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/70'
                  )}
                >
                  {step.description}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface MultiStepFormContentProps {
  steps: { id: string; content: React.ReactNode }[];
  currentStepIndex: number;
  className?: string;
}

export function MultiStepFormContent({
  steps,
  currentStepIndex,
  className,
}: MultiStepFormContentProps) {
  return (
    <div className={cn('mt-4', className)}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'transition-opacity duration-200',
            index === currentStepIndex
              ? 'block opacity-100'
              : 'hidden opacity-0'
          )}
        >
          {step.content}
        </div>
      ))}
    </div>
  );
}
