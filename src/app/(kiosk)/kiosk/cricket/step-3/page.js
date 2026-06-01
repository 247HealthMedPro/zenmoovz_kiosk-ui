"use client";

import { WizardLayout } from "@/components/layout/WizardLayout";
import { Step3PlayingForm } from "@/features/kiosk/components/Step3PlayingForm";
import { useCricketStepGuard } from "@/features/kiosk/hooks/useCricketStepGuard";
import { copy } from "@/lib/constants/kioskCopy";

export default function CricketStep3Page() {
  useCricketStepGuard(3);
  return (
    <WizardLayout
      step={3}
      title={copy.step3Title}
      subtitle={copy.step3Subtitle}
    >
      <Step3PlayingForm />
    </WizardLayout>
  );
}
