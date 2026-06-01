"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CricketRecommendationReport } from "@/features/kiosk/components/CricketRecommendationReport";
import { Skeleton } from "@/components/ui/Skeleton";
import { KioskButton } from "@/components/ui/KioskButton";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { resetCricketFlow } from "@/lib/store/slices/kioskSlice";
import { resetOtpFlow } from "@/lib/store/slices/authSlice";
import { resetRecommendations } from "@/lib/store/slices/recommendationSlice";
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";

export function RecommendationScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { report, status, error } = useAppSelector((s) => s.recommendation);
  const kiosk = useAppSelector((s) => s.kiosk);
  const { spring } = useMotionSafe();

  useEffect(() => {
    if (!kiosk.wizardCompleted) {
      router.replace("/kiosk/cricket/kit-categories");
    }
  }, [kiosk.wizardCompleted, router]);

  const onStartAgain = () => {
    dispatch(resetCricketFlow());
    dispatch(resetOtpFlow());
    dispatch(resetRecommendations());
    router.push("/kiosk");
  };

  return (
    <div className="min-h-dvh bg-surface px-3 py-6 sm:px-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="mx-auto max-w-5xl"
      >
        {status === "loading" || (kiosk.wizardCompleted && !report && status !== "error") ? (
          <motion.div className="space-y-4 rounded-kiosk border border-border bg-surface-elevated p-6 shadow-kiosk">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
            <p className="text-center font-outfit text-sm text-text-muted">
              {status === "loading" ? "Loading recommendations…" : "Almost there…"}
            </p>
          </motion.div>
        ) : status === "error" && !report ? (
          <motion.div className="rounded-kiosk border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-sora text-lg font-semibold text-brand">Could not show recommendations</p>
            <p className="font-outfit mt-2 text-sm text-text-muted">{error}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/kiosk/cricket/step-3">
                <KioskButton type="button">Try again</KioskButton>
              </Link>
              <KioskButton type="button" variant="ghost" onClick={onStartAgain}>
                Start over
              </KioskButton>
            </div>
          </motion.div>
        ) : report ? (
          <CricketRecommendationReport report={report} onStartAgain={onStartAgain} />
        ) : (
          <motion.div className="rounded-kiosk border border-border bg-surface-elevated p-8 text-center shadow-kiosk-soft">
            <p className="font-outfit text-text-muted">No report data. Complete the wizard from step 1.</p>
            <Link href="/kiosk/cricket/step-1" className="mt-4 inline-block text-brand underline">
              Go to step 1
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
