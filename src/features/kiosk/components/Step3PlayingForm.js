"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FormCard } from "@/components/ui/FormCard";
import { KioskButton } from "@/components/ui/KioskButton";
import { SelectionCard } from "@/components/ui/SelectionCard";
import {
  IconCricketBat,
  IconHandLeft,
  IconHandRight,
  IconSchool,
  IconStar,
  IconTrophy,
  IconUsers,
  IconWillow,
} from "@/components/ui/icons/SportIcons";
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
import { useMotionSafe } from "@/features/kiosk/hooks/useMotionSafe";

const levels = [
  { value: PLAYING_LEVEL.BEGINNER, title: "Beginner", hint: "Getting started", icon: IconStar },
  { value: PLAYING_LEVEL.SCHOOL, title: "School / Academy", hint: "Structured training", icon: IconSchool },
  { value: PLAYING_LEVEL.CLUB, title: "Club Cricket", hint: "Competitive weekends", icon: IconUsers },
  { value: PLAYING_LEVEL.DISTRICT, title: "District / State", hint: "Elite pathway", icon: IconTrophy },
];

const batting = [
  { value: BATTING_STYLE.RIGHT, title: "Right Hand", icon: IconHandRight },
  { value: BATTING_STYLE.LEFT, title: "Left Hand", icon: IconHandLeft },
];

const willow = [
  { value: WILLOW_TYPE.EW, title: "English Willow", hint: "Premium grade", icon: IconWillow },
  { value: WILLOW_TYPE.KW, title: "Kashmir Willow", hint: "Value & durability", icon: IconCricketBat },
];

const ballTypes = [
  { value: BALL_TYPE.SOFT_TENNIS, title: "Soft tennis ball" },
  { value: BALL_TYPE.HARD_TENNIS, title: "Hard tennis ball" },
  { value: BALL_TYPE.CORK, title: "Cork ball" },
  { value: BALL_TYPE.LEATHER, title: "Leather ball" },
];

export function Step3PlayingForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const kiosk = useAppSelector((s) => s.kiosk);
  const { fade } = useMotionSafe();
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
      battingPosition: kiosk.battingPosition || BATTING_POSITION.OPENER,
      battingStyle: kiosk.battingStyle || undefined,
      willowType: kiosk.willowType || undefined,
      ballType: kiosk.ballType || undefined,
    },
  });

  const playingLevel = watch("playingLevel");
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 tablet:gap-8">
      <input type="hidden" {...register("battingPosition")} />

      <FormCard title="Playing level">
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 tablet:gap-4 kiosk:grid-cols-4 kiosk:gap-4">
          {levels.map((o) => (
            <SelectionCard
              key={o.value}
              icon={o.icon}
              title={o.title}
              hint={o.hint}
              selected={playingLevel === o.value}
              onClick={() => setValue("playingLevel", o.value, { shouldValidate: true })}
            />
          ))}
        </div>
        {errors.playingLevel ? (
          <p className="mt-4 text-center text-sm text-error">{errors.playingLevel.message}</p>
        ) : null}
        <input type="hidden" {...register("playingLevel")} />
      </FormCard>

      <FormCard title="Batting style">
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-4">
          {batting.map((o) => (
            <SelectionCard
              key={o.value}
              icon={o.icon}
              title={o.title}
              selected={battingStyle === o.value}
              onClick={() => setValue("battingStyle", o.value, { shouldValidate: true })}
            />
          ))}
        </div>
        {errors.battingStyle ? (
          <p className="mt-4 text-center text-sm text-error">{errors.battingStyle.message}</p>
        ) : null}
        <input type="hidden" {...register("battingStyle")} />
      </FormCard>

      {wantsBat ? (
        <FormCard title="Willow type">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 tablet:grid-cols-2">
            {willow.map((o) => (
              <SelectionCard
                key={o.value}
                icon={o.icon}
                title={o.title}
                hint={o.hint}
                selected={willowType === o.value}
                onClick={() => onWillowSelect(o.value)}
              />
            ))}
          </div>
          {errors.willowType ? (
            <p className="mt-4 text-center text-sm text-error">{errors.willowType.message}</p>
          ) : null}
          <input type="hidden" {...register("willowType")} />

          <AnimatePresence>
            {showBallType ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={fade}
                className="mt-6 overflow-hidden"
              >
                <p className="mb-4 text-center text-section">{copy.ballTypeTitle}</p>
                <p className="mb-4 text-center text-sm text-text-muted">{copy.ballTypeSubtitle}</p>
                <div className="grid grid-cols-2 gap-3 tablet:gap-4">
                  {ballTypes.map((o) => (
                    <SelectionCard
                      key={o.value}
                      title={o.title}
                      compact
                      selected={ballType === o.value}
                      onClick={() => setValue("ballType", o.value, { shouldValidate: true })}
                    />
                  ))}
                </div>
                {errors.ballType ? (
                  <p className="mt-4 text-center text-sm text-error">{errors.ballType.message}</p>
                ) : null}
                <input type="hidden" {...register("ballType")} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </FormCard>
      ) : null}

      <KioskButton type="submit" size="xl" loading={posting} className="mx-auto w-full max-w-md">
        {posting ? "Finding your perfect kit…" : "See recommendations"}
      </KioskButton>
    </form>
  );
}
