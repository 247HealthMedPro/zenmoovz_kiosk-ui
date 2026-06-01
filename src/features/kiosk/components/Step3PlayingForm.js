"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KioskButton } from "@/components/ui/KioskButton";
import { copy } from "@/lib/constants/kioskCopy";
import { createStep3PlayingSchema } from "@/lib/validations/step3PlayingSchema";
import { setStep3Data, setWizardCompleted } from "@/api/kioskSlice";
import { setLoading, setReport, setFailure } from "@/api/recommendationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePostBatsRecommendationsMutation } from "@/redux/api/recommendationApi";
import { buildRecommendationPayload } from "@/lib/utils/recommendationPayload";
import {
  BALL_TYPE,
  BATTING_POSITION,
  BATTING_STYLE,
  PLAYING_LEVEL,
  WILLOW_TYPE,
} from "@/lib/constants/kioskTheme";
import { cn } from "@/shared/utils/cn";

const levels = [
  { value: PLAYING_LEVEL.BEGINNER, title: "Beginner", hint: "Getting started" },
  { value: PLAYING_LEVEL.SCHOOL, title: "School / Academy", hint: "Structured training" },
  { value: PLAYING_LEVEL.CLUB, title: "Club Cricket", hint: "Competitive weekends" },
  { value: PLAYING_LEVEL.DISTRICT, title: "District / State", hint: "Elite pathway" },
];

const batting = [
  { value: BATTING_STYLE.RIGHT, title: "Right Hand" },
  { value: BATTING_STYLE.LEFT, title: "Left Hand" },
];

const willow = [
  { value: WILLOW_TYPE.EW, title: "English Willow", hint: "EW" },
  { value: WILLOW_TYPE.KW, title: "Kashmir Willow", hint: "KW" },
  // { value: WILLOW_TYPE.PLASTIC, title: "Plastic", hint: "Tennis / casual" },
  // { value: WILLOW_TYPE.PRACTICE_COMPOSITE, title: "Practice Composite", hint: "Training" },
];

const ballTypes = [
  { value: BALL_TYPE.SOFT_TENNIS, title: "Soft tennis ball" },
  { value: BALL_TYPE.HARD_TENNIS, title: "Hard tennis ball" },
  { value: BALL_TYPE.CORK, title: "Cork ball" },
  { value: BALL_TYPE.LEATHER, title: "Leather ball" },
];

const battingPositions = [
  { value: BATTING_POSITION.OPENER, title: "Opener", hint: "(No 1 and 2)" },
  { value: BATTING_POSITION.TOP_ORDER, title: "Top Order", hint: "(No 3 and 4)" },
  { value: BATTING_POSITION.MIDDLE_ORDER, title: "Middle Order", hint: "(No 5 and 6)" },
  { value: BATTING_POSITION.LOWER_ORDER, title: "Lower Order", hint: "(No 7 and 8)" },
  { value: BATTING_POSITION.TAIL_ENDER, title: "Tail Ender", hint: "(No 9, 10 and 11)" },
];

export function Step3PlayingForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const kiosk = useAppSelector((s) => s.kiosk);
  const [postBats, { isLoading: posting }] = usePostBatsRecommendationsMutation();
  const wantsBat = kiosk.recommendationMode?.includes("BAT");
  const schema = useMemo(() => createStep3PlayingSchema(wantsBat), [wantsBat]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      playingLevel: kiosk.playingLevel || undefined,
      battingPosition: kiosk.battingPosition || undefined,
      battingStyle: kiosk.battingStyle || undefined,
      willowType: kiosk.willowType || undefined,
      ballType: kiosk.ballType || undefined,
    },
  });

  const playingLevel = watch("playingLevel");
  const battingPosition = watch("battingPosition");
  const battingStyle = watch("battingStyle");
  const willowType = watch("willowType");
  const ballType = watch("ballType");
  const showBallType = wantsBat && willowType === WILLOW_TYPE.KW;

  const onWillowSelect = (value) => {
    setValue("willowType", value, { shouldValidate: true });
    if (value !== WILLOW_TYPE.KW) {
      setValue("ballType", undefined, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    dispatch(setStep3Data(data));
    dispatch(setLoading());
    const merged = { ...kiosk, ...data };
    const body = buildRecommendationPayload(merged);
    try {
      const report = await postBats(body).unwrap();
      dispatch(setReport(report));
      dispatch(setWizardCompleted(true));
      router.push("/kiosk/cricket/recommendations");
    } catch (err) {
      const msg =
        err?.data?.message || err?.error || err?.message || "Could not load recommendations.";
      dispatch(setFailure(msg));
      window.alert(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex max-w-lg flex-col gap-6">
      <section aria-labelledby="lvl-h" className="space-y-2">
        <h2 id="lvl-h" className="text-center text-lg font-semibold text-brand">
          Playing level
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {levels.map((o) => (
            <OptionCard
              key={o.value}
              selected={playingLevel === o.value}
              onClick={() => setValue("playingLevel", o.value, { shouldValidate: true })}
              title={o.title}
              hint={o.hint}
            />
          ))}
        </div>
        {errors.playingLevel ? (
          <p className="text-center text-sm text-red-600">{errors.playingLevel.message}</p>
        ) : null}
        <input type="hidden" {...register("playingLevel")} />
      </section>

      <section aria-labelledby="pos-h" className="space-y-2">
        <h2 id="pos-h" className="text-center text-lg font-semibold text-brand">
          Batting position
        </h2>
        <p className="text-center text-sm text-text-muted">Where you usually bat in the order</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {battingPositions.map((o) => (
            <OptionCard
              key={o.value}
              selected={battingPosition === o.value}
              onClick={() => setValue("battingPosition", o.value, { shouldValidate: true })}
              title={o.title}
              hint={o.hint}
            />
          ))}
        </div>
        {errors.battingPosition ? (
          <p className="text-center text-sm text-red-600">{errors.battingPosition.message}</p>
        ) : null}
        <input type="hidden" {...register("battingPosition")} />
      </section>

      <section aria-labelledby="bat-h" className="space-y-2">
        <h2 id="bat-h" className="text-center text-lg font-semibold text-brand">
          Batting style
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {batting.map((o) => (
            <OptionCard
              key={o.value}
              selected={battingStyle === o.value}
              onClick={() => setValue("battingStyle", o.value, { shouldValidate: true })}
              title={o.title}
            />
          ))}
        </div>
        {errors.battingStyle ? (
          <p className="text-center text-sm text-red-600">{errors.battingStyle.message}</p>
        ) : null}
        <input type="hidden" {...register("battingStyle")} />
      </section>

      {wantsBat ? (
        <section aria-labelledby="wil-h" className="space-y-2">
          <h2 id="wil-h" className="text-center text-lg font-semibold text-brand">
            Willow type
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {willow.map((o) => (
              <OptionCard
                key={o.value}
                selected={willowType === o.value}
                onClick={() => onWillowSelect(o.value)}
                title={o.title}
                hint={o.hint}
              />
            ))}
          </div>
          {errors.willowType ? (
            <p className="text-center text-sm text-red-600">{errors.willowType.message}</p>
          ) : null}
          <input type="hidden" {...register("willowType")} />

          {showBallType ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 space-y-2 overflow-hidden"
              aria-labelledby="ball-h"
            >
              <h3 id="ball-h" className="text-center text-lg font-semibold text-brand">
                {copy.ballTypeTitle}
              </h3>
              <p className="text-center text-sm text-text-muted">{copy.ballTypeSubtitle}</p>
              <div className="grid grid-cols-2 gap-2">
                {ballTypes.map((o) => (
                  <OptionCard
                    key={o.value}
                    selected={ballType === o.value}
                    onClick={() => setValue("ballType", o.value, { shouldValidate: true })}
                    title={o.title}
                  />
                ))}
              </div>
              {errors.ballType ? (
                <p className="text-center text-sm text-red-600">{errors.ballType.message}</p>
              ) : null}
              <input type="hidden" {...register("ballType")} />
            </motion.div>
          ) : null}
        </section>
      ) : null}

      <KioskButton type="submit" className="w-full" disabled={posting}>
        {posting ? "Fetching recommendations…" : "See recommendations"}
      </KioskButton>
    </form>
  );
}

function OptionCard({ selected, onClick, title, hint }) {
  return (
    <motion.button
      type="button"
      layout
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-[80px] flex-col items-center justify-center rounded-kiosk border-2 p-3 text-center transition sm:p-4",
        selected
          ? "border-accent bg-gradient-to-br from-accent/15 to-brand-soft text-brand shadow-kiosk-soft"
          : "border-border bg-surface-elevated text-text-muted hover:border-brand/25"
      )}
    >
      <span className="text-base font-semibold sm:text-lg">{title}</span>
      {hint ? <span className="mt-1 text-[11px] text-text-muted sm:text-xs">{hint}</span> : null}
    </motion.button>
  );
}
