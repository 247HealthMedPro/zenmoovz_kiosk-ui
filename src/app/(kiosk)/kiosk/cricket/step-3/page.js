"use client";

import { CricketWizardShell } from "@/features/kiosk/components/CricketWizardShell";
import { Step3PlayingForm } from "@/features/kiosk/components/Step3PlayingForm";
import { useCricketStepGuard } from "@/features/kiosk/hooks/useCricketStepGuard";

export default function CricketStep3Page() {
  useCricketStepGuard(3);
  return (
    <CricketWizardShell
      compact
      title="Step 3 — Playing style"
      subtitle="Level, batting position, hand, and willow."
    >
      <Step3PlayingForm />
    </CricketWizardShell>
  );
}
