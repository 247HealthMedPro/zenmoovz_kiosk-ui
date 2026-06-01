"use client";

import { WizardLayout } from "@/components/layout/WizardLayout";
import { Step1UserForm } from "@/features/kiosk/components/Step1UserForm";
import { useCricketStepGuard } from "@/features/kiosk/hooks/useCricketStepGuard";
import { copy } from "@/lib/constants/kioskCopy";

export default function CricketStep1Page() {
  useCricketStepGuard(1);
  return (
    <WizardLayout
      step={1}
      compact
      title={copy.step1Title}
      subtitle={copy.step1Subtitle}
    >
      <Step1UserForm />
    </WizardLayout>
  );
}
