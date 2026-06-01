"use client";

import { WizardLayout } from "@/components/layout/WizardLayout";

/** @deprecated use WizardLayout directly from pages */
export function CricketWizardShell({ children, title, subtitle, compact: _compact }) {
  const step = title?.includes("Step 1") ? 1 : title?.includes("Step 2") ? 2 : 3;
  return (
    <WizardLayout title={title} subtitle={subtitle} step={step}>
      {children}
    </WizardLayout>
  );
}
