"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/ui/KioskShell";
import { CricketRecommendationReport } from "@/features/kiosk/components/CricketRecommendationReport";
import { Skeleton } from "@/components/ui/Skeleton";
import { KioskButton } from "@/components/ui/KioskButton";
import { copy } from "@/lib/constants/kioskCopy";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetCricketFlow } from "@/api/kioskSlice";
import { resetOtpFlow } from "@/api/authSlice";
import { resetRecommendations } from "@/api/recommendationSlice";
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
    <div className="min-h-dvh bg-surface">
      <div className="recommendation-hero text-center text-text-on-dark">
        <AppShell className="min-h-0 items-center py-3 tablet:py-3.5">
          <motion.div
            className="flex flex-col gap-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-muted tablet:text-sm">
              Personalised for you
            </p>
            <h1 className="font-sora text-2xl font-semibold leading-tight tablet:text-3xl kiosk:text-4xl">
              {copy.recommendationTitle}
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-snug text-text-on-dark/80 tablet:text-base">
              {copy.recommendationSubtitle}
            </p>
          </motion.div>
        </AppShell>
      </div>

      <AppShell
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.1 }}
        className="min-h-0 -mt-2 gap-0 pb-12 pt-0"
      >
        {status === "loading" || (kiosk.wizardCompleted && !report && status !== "error") ? (
          <div className="ui-card-elevated space-y-4 p-8">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <p className="text-center text-text-muted">Loading recommendations…</p>
          </div>
        ) : status === "error" && !report ? (
          <div className="ui-card-elevated p-10 text-center">
            <p className="text-headline text-xl">Could not show recommendations</p>
            <p className="mt-2 text-text-muted">{error}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/kiosk/cricket/step-3">
                <KioskButton type="button">Try again</KioskButton>
              </Link>
              <KioskButton type="button" variant="ghost" onClick={onStartAgain}>
                Start over
              </KioskButton>
            </div>
          </div>
        ) : report ? (
          <CricketRecommendationReport report={report} onStartAgain={onStartAgain} />
        ) : (
          <div className="ui-card-elevated p-10 text-center">
            <p className="text-text-muted">No report data. Complete the wizard from step 1.</p>
            <Link href="/kiosk/cricket/step-1" className="mt-4 inline-block font-semibold text-accent">
              Go to step 1 →
            </Link>
          </div>
        )}
      </AppShell>
    </div>
  );
}
