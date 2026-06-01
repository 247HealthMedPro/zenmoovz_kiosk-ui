"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

export function useCricketStepGuard(requiredStep) {
  const router = useRouter();
  const kiosk = useAppSelector((s) => s.kiosk);
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (requiredStep >= 1 && (!kiosk.recommendationMode || kiosk.recommendationMode.length === 0)) {
      router.replace("/kiosk/cricket/kit-categories");
      return;
    }
    if (requiredStep >= 2 && !auth.otpVerified) {
      router.replace("/kiosk/cricket/step-1");
      return;
    }
    if (requiredStep >= 2 && !kiosk.name) {
      router.replace("/kiosk/cricket/step-1");
      return;
    }
    if (requiredStep >= 3 && !kiosk.genderCategory) {
      router.replace("/kiosk/cricket/step-2");
    }
  }, [
    auth.otpVerified,
    kiosk.name,
    kiosk.genderCategory,
    kiosk.recommendationMode,
    requiredStep,
    router,
  ]);
}
