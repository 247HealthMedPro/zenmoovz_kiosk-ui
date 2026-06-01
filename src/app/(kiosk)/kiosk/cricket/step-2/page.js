"use client";

import { CricketWizardShell } from "@/features/kiosk/components/CricketWizardShell";
import { Step2PhysicalForm } from "@/features/kiosk/components/Step2PhysicalForm";
import { useCricketStepGuard } from "@/features/kiosk/hooks/useCricketStepGuard";

export default function CricketStep2Page() {
  useCricketStepGuard(2);
  return (
    <CricketWizardShell title="Step 2 — Your profile" subtitle="Gender, age, height, and weight power better fits.">
      <Step2PhysicalForm />
    </CricketWizardShell>
  );
}
