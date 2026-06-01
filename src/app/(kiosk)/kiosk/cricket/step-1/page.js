import { CricketWizardShell } from "@/features/kiosk/components/CricketWizardShell";
import { Step1UserForm } from "@/features/kiosk/components/Step1UserForm";

export default function CricketStep1Page() {
  return (
    <CricketWizardShell title="Step 1 — Your details" subtitle="Verify your mobile to continue.">
      <Step1UserForm />
    </CricketWizardShell>
  );
}
