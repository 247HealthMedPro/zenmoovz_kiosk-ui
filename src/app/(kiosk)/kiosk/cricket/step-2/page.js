"use client";

import { WizardLayout } from "@/components/layout/WizardLayout";
import { Step2PhysicalForm } from "@/features/kiosk/components/Step2PhysicalForm";
import { useCricketStepGuard } from "@/features/kiosk/hooks/useCricketStepGuard";
import { copy } from "@/lib/constants/kioskCopy";

export default function CricketStep2Page() {
  useCricketStepGuard(2);
  return (
    <WizardLayout
      step={2}
      title={copy.step2Title}
      subtitle={copy.step2Subtitle}
    >
      <Step2PhysicalForm />
    </WizardLayout>
  );
}
